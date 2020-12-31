import Discord from 'discord.js';
import axios from 'axios';
import ICommand from './typings/ICommand';
import IState from './typings/IState';

const COMMAND_PREFIX = '!';

const AVAILABLE_COMMANDS = {
    'john is gay': {
        command: 'john is gay',
        description: 'type this in and see',
        callback: (message: Discord.Message) => {
            message.channel.send('agreed');
        },
    },
    'mark\'s peepee': {
        command: 'mark\'s peepee',
        description: 'type this in and see',
        callback: (message: Discord.Message) => {
            message.channel.send('very small');
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
    [`${COMMAND_PREFIX}mute`]: {
        command: `${COMMAND_PREFIX}mute`,
        description: 'mute',
        callback: (message: Discord.Message, state: IState) => {
            if(message.guild?.id) {
                const guildId = message.guild?.id;
                if(!state.mutedGuilds.has(guildId)) {
                    state.mutedGuilds.add(guildId);
                }
            }
            message.channel.send('Alright, I\'m muted.');
        },
    },
    [`${COMMAND_PREFIX}unmute`]: {
        command: `${COMMAND_PREFIX}unmute`,
        description: 'unmute',
        callback: (message: Discord.Message, state: IState) => {
            if(message.guild?.id) {
                const guildId = message.guild?.id;
                if(state.mutedGuilds.has(guildId)) {
                    state.mutedGuilds.delete(guildId);
                }
            }
            message.channel.send('Woohoo, I\'m unmuted.');
        },
    }
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

export default (message: Discord.Message, state: IState): void => {
    const parsedMsg = message.content.toLowerCase();

    try {
        const { callback = () => {} } =
            (AVAILABLE_COMMANDS[parsedMsg] != null
                ? AVAILABLE_COMMANDS[parsedMsg]
                : PRIVATE_COMMANDS[parsedMsg]) || {};

        callback(message, state);
    } catch (err) {
        console.error(err);
    }
};
