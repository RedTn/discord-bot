import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import Discord from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import poller from './poller';
import replies from './replies';
import { fetchOnlineMembers } from './util';

dotenv.config();

const secretsClient = new SecretManagerServiceClient();
const app = express();

const accessSecretVersion = async () => {
    const [version] = await secretsClient.accessSecretVersion({
        name: config.secrets.discordBotTokenLocation,
    });

    // Extract the payload as a string.
    return version?.payload?.data?.toString() || '';
};

const state = {
    online: [],
    pingGloom: false,
};

const main = async () => {
    const token =
        process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

    const client = new Discord.Client({ fetchAllMembers: true });

    client.login(token);

    client.once('ready', () => {
        const membersList = client.guilds.cache.get(config.anusPartyGuild.id);
        state.online = fetchOnlineMembers(membersList);

        console.log(state.online);

        client.on('message', (message) => {
            replies(message);
        });

        client.on('presenceUpdate', (oldPresence, newPresence) => {
            console.log(newPresence.activities);
            if (newPresence?.guild?.id === config.anusPartyGuild.id) {
                console.log(newPresence.user);
            }
        });

        poller();

        console.log('ready');
    });
};

app.listen(process.env.PORT || 8080);

main();
