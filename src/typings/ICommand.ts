import Discord from 'discord.js';

interface ICommand {
    [command: string]: {
        command: string;
        description?: string;
        callback: (message: Discord.Message) => void;
    };
}

export default ICommand;
