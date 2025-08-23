import { Client } from 'discord.js';
import { watchGameMembers } from './watch';

export default (client: Client): void => {
    setInterval(() => {
        watchGameMembers(client);
    }, 1500);
};
