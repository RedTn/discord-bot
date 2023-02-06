import { MessageAttachment, Message } from 'discord.js';
import axios from 'axios';
import stringArgv from 'string-argv';
import yargs from 'yargs';
import { CanvasRenderService } from 'chartjs-node-canvas';
import { sendMessage } from 'discord-bot/util';
import { addMuted, removeMuted, store as mutedStore } from 'store/muted';
import { addWatch, removeAll, store as watchStore } from 'store/watchGame';
import {
    fetchStockQuote,
    fetchStockOverview,
    fetchIntraday,
    fetchDaily,
} from 'store/stock';
import ICommand from 'interfaces/ICommand';

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
        callback: async (message: Message) => {
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
        callback: async (message: Message) => {
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
        callback: (message: Message) => {
            if (message.guild?.id) {
                message.channel.send("Alright, I'm muted.");
                mutedStore.dispatch(addMuted(message.guild.id));
            }
        },
    },
    [`${COMMAND_PREFIX}unmute`]: {
        command: `${COMMAND_PREFIX}unmute`,
        description: 'unmute',
        callback: (message: Message) => {
            if (message.guild?.id) {
                message.channel.send("Woohoo, I'm unmuted.");
                mutedStore.dispatch(removeMuted(message.guild.id));
            }
        },
    },
    [`${COMMAND_PREFIX}alert`]: {
        command: `${COMMAND_PREFIX}alert`,
        description: 'alert game',
        callback: (message: Message, argv) => {
            const {
                argv: {
                    _: [, ...players],
                    game,
                },
            } = argv;
            const parsedPlayers = players.flatMap((player: string | number) => {
                if (typeof player !== 'string') {
                    return [];
                }

                if (player.startsWith('<@') && player.endsWith('>')) {
                    const rawId = player.slice(2, -1);

                    if (rawId.startsWith('!')) {
                        return rawId.slice(1);
                    }
                }

                return [];
            });

            if (
                game &&
                players.length > 0 &&
                message.guild?.id &&
                message.channel?.id
            ) {
                watchStore.dispatch(
                    addWatch({
                        playerIds: parsedPlayers,
                        game,
                        guildId: message.guild.id,
                        channelId: message.channel.id,
                    })
                );
                sendMessage(`Alerting for game ${game}.`, message);
            }
        },
    },
    [`${COMMAND_PREFIX}removealerts`]: {
        command: `${COMMAND_PREFIX}removealerts`,
        description: 'remove all game alerts',
        callback: (message: Message) => {
            watchStore.dispatch(removeAll());
            sendMessage('Removing all alerts.', message);
        },
    },
    [`${COMMAND_PREFIX}quote`]: {
        command: `${COMMAND_PREFIX}quote`,
        description: 'Fetch stock quote',
        callback: async (message: Message, argv) => {
            const {
                argv: {
                    _: [, stock, timeline = ''],
                },
            } = argv;

            if (typeof stock === 'string' && stock.length > 0) {
                const parsedStock = stock.toUpperCase();

                let fetchedData;

                if (timeline === 'daily') {
                    fetchedData = await fetchDaily(parsedStock);
                } else {
                    fetchedData = await fetchIntraday(parsedStock);
                }

                const quoteData = await fetchStockQuote(parsedStock);
                const overviewData = await fetchStockOverview(parsedStock);

                if (
                    typeof overviewData !== 'string' &&
                    typeof quoteData !== 'string'
                ) {
                    const allowed = new Set(['high', 'low', 'price', 'change']);
                    const { Name } = overviewData;
                    const fields = Object.entries(quoteData['Global Quote'])
                        .map(([key, value]) => {
                            const [, name] = key.split(' ');
                            return {
                                name,
                                value,
                            };
                        })
                        .filter(({ name }) => allowed.has(name));

                    sendMessage(
                        `${Name || parsedStock}, Price: ${
                            fields.find(({ name }) => name === 'price')?.value
                        }, Change: ${
                            fields.find(({ name }) => name === 'change')?.value
                        }`,
                        message
                    );
                } else {
                    sendMessage('An error has occured.', message);
                }

                if (typeof fetchedData !== 'string') {
                    const data = Object.entries(fetchedData).map(
                        ([key, { '1. open': open }]) => ({
                            x: new Date(key),
                            y: open,
                        })
                    );

                    const width = 1500;
                    const height = 800;

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const chartCallback = (ChartJS: any) => {
                        ChartJS.plugins.register({
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            beforeDraw: (chartInstance: any) => {
                                const { chart } = chartInstance;
                                const { ctx } = chart;
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, chart.width, chart.height);
                            },
                        });
                    };

                    const canvas = new CanvasRenderService(
                        width,
                        height,
                        chartCallback
                    );

                    const configuration = {
                        type: 'line',
                        data: {
                            datasets: [
                                {
                                    label: parsedStock,
                                    data,
                                    backgroundColor: '#7289d9',
                                },
                            ],
                        },
                        options: {
                            scales: {
                                xAxes: [
                                    {
                                        type: 'time',
                                        distribution: 'series',
                                        ticks: {
                                            fontSize: 40,
                                        },
                                    },
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            fontSize: 40,
                                        },
                                    },
                                ],
                            },
                        },
                    };

                    const image = await canvas.renderToBuffer(configuration);

                    const attachment = new MessageAttachment(image);

                    sendMessage(attachment, message);
                }
            }
        },
    },
    '(╯°□°）╯︵ ┻━┻': {
        command: `table flip`,
        description: 'unflips table',
        callback: sendMessage('┬─┬ ノ( ゜-゜ノ)'),
    },
    '(╯°□°)╯︵ ┻━┻': {
        command: `table flip v2`,
        description: 'unflips table',
        callback: sendMessage('┬─┬ ノ( ゜-゜ノ)'),
    },
    [`${COMMAND_PREFIX}shrek`]: {
        command: `${COMMAND_PREFIX}shrek`,
        description: 'shrek',
        callback: sendMessage(`
shrek is love, shrek is life
         ⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀ ⣀⣀⣤⣤⣤⣀⡀
        ⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀
        ⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆
        ⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆
        ⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆
        ⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠸⣼⡿
        ⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉
        ⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
        ⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇
        ⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇
        ⠀⠀ ⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠇
        ⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇
        ⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`),
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

export default (message: Message): void => {
    const parsedMsg = message.content.toLowerCase();
    const argv = yargs(stringArgv(parsedMsg));
    const [command] = argv.argv._;

    try {
        const { callback = () => {} } =
            AVAILABLE_COMMANDS[command] ||
            PRIVATE_COMMANDS[command] ||
            AVAILABLE_COMMANDS[parsedMsg] ||
            PRIVATE_COMMANDS[parsedMsg] ||
            {};

        callback(message, argv);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
};
