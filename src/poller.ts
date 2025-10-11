import Discord from 'discord.js';
import { watchGameMembers } from './watch';

// Poll interval for checking game watchers (in milliseconds)
// 1500ms = 1.5 seconds - balance between responsiveness and API rate limits
const POLL_INTERVAL_MS = 1500;

export default (client: Discord.Client): void => {
    setInterval(() => {
        watchGameMembers(client);
    }, POLL_INTERVAL_MS);
};
