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
    anusGuild: {
        online: [],
        messageState: {},
    },
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

        console.log('ready');

        // initial state code
        state.anusGuild.online = fetchOnlineMembers(membersList);
    });
};

app.listen(process.env.PORT || 8080);

main();
