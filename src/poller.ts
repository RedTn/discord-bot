/* eslint-disable @typescript-eslint/no-unused-vars */
import Discord from 'discord.js';
import IState from './typings/IState';
import { watchGameMembers } from './watch';

export default (client: Discord.Client, state: IState): void => {
    setInterval(() => {
        // watchGameMembers(client, state);
    }, 1500);
};
