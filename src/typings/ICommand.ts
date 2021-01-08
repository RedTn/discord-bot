import Discord from 'discord.js';

interface ICommand {
    [command: string]: {
        command: string;
        description?: string;
        callback: (message: Discord.Message, ...args: string[]) => void;
    };
}

export default ICommand;
