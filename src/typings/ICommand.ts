import Discord from 'discord.js';
import IState from './IState';

interface ICommand {
    [command: string]: {
        command: string;
        description?: string;
        callback: (message: Discord.Message, state: IState) => void;
    };
}

export default ICommand;
