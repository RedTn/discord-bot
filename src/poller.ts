import Discord from 'discord.js';
import { watchGameMembers } from './watch';

export default (client: Discord.Client): void => {
    setInterval(() => {
        watchGameMembers(client);
    }, 1500);
};
