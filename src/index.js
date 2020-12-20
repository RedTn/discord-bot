const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const Discord = require('discord.js');
const express = require('express');
const poller = require('./poller');
const replys = require('./replys');

const secretsClient = new SecretManagerServiceClient();
const app = express();

const accessSecretVersion = async () => {
    const [version] = await secretsClient.accessSecretVersion({
      name: 'projects/redtn-discord-bots/secrets/discord-bot-token/versions/latest',
    });

    // Extract the payload as a string.
    return version.payload.data.toString();

}

const main = async () => {
    const token = await accessSecretVersion();

    const client = new Discord.Client();

    client.once('ready', () => {
        poller();
    });

    client.on('message', message => {
        replys(message);
    });

    client.login(token);
};

app.listen(process.env.PORT || 8080);

main();