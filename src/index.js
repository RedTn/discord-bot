const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
require('dotenv').config();
const Discord = require('discord.js');
const express = require('express');
const config = require('config');
const poller = require('./poller');
const replies = require('./replies');

const secretsClient = new SecretManagerServiceClient();
const app = express();

const accessSecretVersion = async () => {
    const [version] = await secretsClient.accessSecretVersion({
        name: config.secrets.discordBotTokenLocation,
    });

    // Extract the payload as a string.
    return version.payload.data.toString();
};

const main = async () => {
    const token = process.env.DISCORD_BOT_TOKEN || await accessSecretVersion();

    const client = new Discord.Client();

    client.login(token);

    client.once('ready', () => {
        poller();

        console.log('ready');
    });

    client.on('message', (message) => {
        // disable on local, so people don't see double messages
        if (!process.env.REPLIES) {
            replies(message);
        }
    });

    client.on('presenceUpdate', (oldPresence, newPresence) => {
        if (!newPresence.activities) return;
        newPresence.activities.forEach((activity) => {
            if (activity.type === 'STREAMING') {
                console.log(
                    `${newPresence.user.tag} is streaming at ${activity.url}.`
                );
            }
        });
    });
};

app.listen(process.env.PORT || 8080);

main();
