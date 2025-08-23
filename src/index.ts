import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import poller from 'discord-bot/poller';
import commands from 'discord-bot/commands';
import { store as stockStore, setKey } from 'store/stock';

dotenv.config();

const secretsClient = new SecretManagerServiceClient();
const app = express();

const accessSecretVersion = async () => {
    const [version] = await secretsClient.accessSecretVersion({
        name: config.get('secrets.discordBotTokenLocation'),
    });

    // Extract the payload as a string.
    return version?.payload?.data?.toString() || '';
};

const accessApiKey = async () => {
    const [version] = await secretsClient.accessSecretVersion({
        name: config.get('secrets.alphaVantageKeyLocation'),
    });

    // Extract the payload as a string.
    return version?.payload?.data?.toString() || '';
};

const main = async () => {
    const token =
        process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

    const stockAPIKey = process.env.STOCK_API_KEY || (await accessApiKey());

    stockStore.dispatch(setKey(stockAPIKey));

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMembers,
        ],
    });

    client.login(token);

    client.once('ready', () => {
        client.on('messageCreate', (message) => {
            commands(message);
        });

        poller(client);

        // eslint-disable-next-line no-console
        console.log('ready');
    });
};

app.get('/_ah/warmup', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT || 8080);

main();
