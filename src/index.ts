import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import Discord from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import poller from 'discord-bot/poller';
import commands from 'discord-bot/commands';
import { store as stockStore, setKey } from 'store/stock';

dotenv.config();

const secretsClient = new SecretManagerServiceClient();
const app = express();

const accessSecretVersion = async (): Promise<string> => {
    try {
        const [version] = await secretsClient.accessSecretVersion({
            name: config.get('secrets.discordBotTokenLocation'),
        });

        // Extract the payload as a string.
        return version?.payload?.data?.toString() || '';
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error accessing Discord bot token secret:', error);
        return '';
    }
};

const accessApiKey = async (): Promise<string> => {
    try {
        const [version] = await secretsClient.accessSecretVersion({
            name: config.get('secrets.alphaVantageKeyLocation'),
        });

        // Extract the payload as a string.
        return version?.payload?.data?.toString() || '';
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error accessing Alpha Vantage API key secret:', error);
        return '';
    }
};

const main = async (): Promise<void> => {
    try {
        const token =
            process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

        if (!token) {
            throw new Error(
                'Discord bot token not found in environment or secrets'
            );
        }

        const stockAPIKey = process.env.STOCK_API_KEY || (await accessApiKey());

        if (!stockAPIKey) {
            // eslint-disable-next-line no-console
            console.warn('Stock API key not found - stock commands will fail');
        }

        stockStore.dispatch(setKey(stockAPIKey));

        // Note: fetchAllMembers is deprecated in discord.js v12+
        // For v14+, use GatewayIntentBits.GUILD_MEMBERS and partials
        // Casting to any for compatibility with discord.js v12 types
        const client = new Discord.Client({
            fetchAllMembers: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        await client.login(token);

        client.once('ready', () => {
            client.on('message', (message) => {
                commands(message);
            });

            poller(client);

            // eslint-disable-next-line no-console
            console.log('ready');
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to start Discord bot:', error);
        process.exit(1);
    }
};

app.get('/_ah/warmup', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(process.env.PORT || 8080);

main();
