const dotenv = require('dotenv');

dotenv.config();

const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
    // console.log(client.users.cache.toJSON())
});

client.on('message', message => {
    if (message.content === 'who is the best kiddo?') {
        message.channel.send('Naynay!');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);