import Discord from 'discord.js';
import axios from 'axios';
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
    [`${COMMAND_PREFIX}joke`]: {
        command: `${COMMAND_PREFIX}joke`,
        description: 'random joke',
        callback: async (message: Discord.Message) => {
            const { data: { setup, punchline } = {} } = await axios.get(
                'https://official-joke-api.appspot.com/jokes/random'
            );
            message.channel.send(setup);
            message.channel.send(`||${punchline}||`);
        },
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

export default (message: Discord.Message): void => {
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
