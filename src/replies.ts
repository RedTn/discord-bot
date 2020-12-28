import Discord from 'discord.js';
import ICommand from './typings/ICommand';

const COMMAND_PREFIX = '!';

const AVAILABLE_COMMANDS = {
    'john is gay': {
        command: 'john is gay',
        description: 'type this in and see',
        callback: (message: Discord.Message) => {
            message.channel.send('agreed');
        },
    },
    [`${COMMAND_PREFIX}help`]: {
        command: `${COMMAND_PREFIX}help`,
        description: 'list all commands',
        callback: () => {},
    },
} as ICommand;

const PRIVATE_COMMANDS = {
    'who is the best kiddo?': {
        command: 'who is the best kiddo?',
        callback: (message: Discord.Message) => {
            message.channel.send('Naynay!');
        },
    },
    'what does reddy want to wear today?': {
        command: 'what does reddy want to wear today?',
        callback: (message: Discord.Message) => {
            message.channel.send('tanks and shorts all day err day!');
        },
    },
} as ICommand;

const main = (message: Discord.Message): void => {
    const parsedMsg = message.content.toLowerCase();

    try {
        const { callback = () => {} } =
            (AVAILABLE_COMMANDS[parsedMsg] != null
                ? AVAILABLE_COMMANDS[parsedMsg]
                : PRIVATE_COMMANDS[parsedMsg]) || {};

        callback(message);
    } catch (err) {
        console.error(err);
    }
};

export default main;
