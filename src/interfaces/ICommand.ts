import Discord from 'discord.js';
import yargs from 'yargs';

interface ICommand {
    [command: string]: {
        command: string;
        description?: string;
        callback: (
            message: Discord.Message,
            argv: yargs.Argv<Record<string, string>>
        ) => void;
    };
}

export default ICommand;
