import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import Discord from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import poller from './poller';
import replies from './replies';
import { fetchOnlineMembers } from './util';
import IState from './typings/IState';

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

const state = {
    online: [],
    pingGloom: false,
} as IState;

const main = async () => {
    const token =
        process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

    const client = new Discord.Client({ fetchAllMembers: true });

    client.login(token);

    client.once('ready', () => {
        const membersList = client.guilds.cache.get(
            config.get('anusPartyGuild.id')
        );
        state.online = fetchOnlineMembers(membersList);

        client.on('message', (message) => {
            replies(message);
        });

        client.on('presenceUpdate', (oldPresence, newPresence) => {
            if (newPresence?.guild?.id === config.get('anusPartyGuild.id')) {
                // empty
            }
        });

        poller();

        console.log('ready');
    });
};

app.listen(process.env.PORT || 8080);

main();
