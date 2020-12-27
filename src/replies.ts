import Discord from 'discord.js';

const COMMAND_PREFIX = '!';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AVAILABLE_COMMANDS = [
    {
        command: 'john is gay',
        description: 'type this in and see',
    },
    {
        command: `${COMMAND_PREFIX}help`,
        description: 'list all commands',
    },
];

const main = (message: Discord.Message): void => {
    const parsedMsg = message.content.toLowerCase();

    if (parsedMsg === 'who is the best kiddo?') {
        message.channel.send('Naynay!');
    }
    if (parsedMsg === 'john is gay') {
        message.channel.send('agreed');
    }
};

export default main;
