import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import Discord from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import poller from 'discord-bot/poller';
import replies from 'discord-bot/replies';
import { fetchOnlineMembers } from 'discord-bot/util';
import IState from 'discord-bot/typings/IState';
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

const state = {
    anusGuild: {
        id: config.get('anusPartyGuild.id'),
        online: [],
        messageState: {},
    },
    mutedGuilds: new Set(),
} as IState;

const main = async () => {
    const token =
        process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

    const stockAPIKey = process.env.STOCK_API_KEY || (await accessApiKey());

    stockStore.dispatch(setKey(stockAPIKey));

    const client = new Discord.Client({ fetchAllMembers: true });

    client.login(token);

    client.once('ready', () => {
        const anusGuild = client.guilds.cache.get(
            config.get('anusPartyGuild.id')
        );

        client.on('message', (message) => {
            replies(message);
        });

        client.on('presenceUpdate', (oldPresence, newPresence) => {
            if (newPresence?.guild?.id === config.get('anusPartyGuild.id')) {
                if (newPresence.guild != null) {
                    state.anusGuild.online = fetchOnlineMembers(
                        newPresence.guild
                    );
                }
            }
        });

        poller(client, state);

        // eslint-disable-next-line no-console
        console.log('ready');

        // initial state code
        state.anusGuild.online = fetchOnlineMembers(anusGuild);
    });
};

app.get('/_ah/warmup', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT || 8080);

main();
