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
        id: config.get('anusPartyGuild.id'),
        online: [],
        messageState: {}
    },
    mutedGuilds: new Set(),
} as IState;

const main = async () => {
    const token =
        process.env.DISCORD_BOT_TOKEN || (await accessSecretVersion());

    const client = new Discord.Client({ fetchAllMembers: true });

    client.login(token);

    client.once('ready', () => {
        const anusGuild = client.guilds.cache.get(
            config.get('anusPartyGuild.id')
        );

        client.on('message', (message) => {
            replies(message, state);
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

        // const channel = moohuGuild?.channels.cache.get(config.get('moohuGuild.test-channel.id')) as Discord.TextChannel;
        // channel.send('<@205505902579679241> test');

        // initial state code
        state.anusGuild.online = fetchOnlineMembers(anusGuild);
    });
};

app.listen(process.env.PORT || 8080);

main();
