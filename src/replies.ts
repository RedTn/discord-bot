import Discord from 'discord.js';
import axios from 'axios';
import { sendMessage } from 'util/customMessage';
import { addMuted, removeMuted, store as mutedStore } from 'store/muted';
import ICommand from './typings/ICommand';
import IState from './typings/IState';

const COMMAND_PREFIX = '!';

const AVAILABLE_COMMANDS = {
    'john is gay': {
        command: 'john is gay',
        description: 'type this in and see',
        callback: sendMessage('agreed'),
    },
    "mark's peepee": {
        command: "mark's peepee",
        description: 'type this in and see',
        callback: sendMessage('very small'),
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
            sendMessage(setup, message);
            sendMessage(`||${punchline}||`, message);
        },
    },
    [`${COMMAND_PREFIX}njoke`]: {
        command: `${COMMAND_PREFIX}njoke`,
        description: 'random explicit joke',
        callback: async (message: Discord.Message) => {
            const { data: { setup, delivery } = {} } = await axios.get(
                'https://v2.jokeapi.dev/joke/Dark?blacklistFlags=nsfw,religious,political,sexist,explicit&type=twopart'
            );
            sendMessage(setup, message);
            sendMessage(`||${delivery}||`, message);
        },
    },
    [`${COMMAND_PREFIX}mute`]: {
        command: `${COMMAND_PREFIX}mute`,
        description: 'mute',
        callback: (message: Discord.Message) => {
            if (message.guild?.id) {
                message.channel.send("Alright, I'm muted.");
                mutedStore.dispatch(addMuted(message.guild.id));
            }
        },
    },
    [`${COMMAND_PREFIX}unmute`]: {
        command: `${COMMAND_PREFIX}unmute`,
        description: 'unmute',
        callback: (message: Discord.Message) => {
            if (message.guild?.id) {
                message.channel.send("Woohoo, I'm unmuted.");
                mutedStore.dispatch(removeMuted(message.guild.id));
            }
        },
    },
    '(╯°□°）╯︵ ┻━┻': {
        command: `table flip`,
        description: 'unflips table',
        callback: sendMessage('┬─┬ ノ( ゜-゜ノ)'),
    },
} as ICommand;

const PRIVATE_COMMANDS = {
    'who is the best kiddo?': {
        command: 'who is the best kiddo?',
        callback: sendMessage('Naynay!'),
    },
    'what does reddy want to wear today?': {
        command: 'what does reddy want to wear today?',
        callback: sendMessage('tanks and shorts all day err day!'),
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
        // eslint-disable-next-line no-console
        console.error(err);
    }
};
