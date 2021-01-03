import Discord from 'discord.js';
import config from 'config';
import IWatch from './typings/IWatch';
import IState from './typings/IState';

const watchGameMembers = (client: Discord.Client, state: IState): void => {
    (config.get('anusPartyGuild.watch') as Array<IWatch>).forEach(
        ({ group, game }) => {
            if (group.every((val) => state.anusGuild.online.includes(val))) {
                if (state.anusGuild.messageState[game] == null) {
                    state.anusGuild.messageState[game] = {
                        messaged: false,
                    };
                }

                if (!state.anusGuild.messageState[game].messaged) {
                    state.anusGuild.messageState[game].messaged = true;

                    const anusGuild = client.guilds.cache.get(
                        config.get('anusPartyGuild.id')
                    );

                    (anusGuild?.channels.cache.get(
                        config.get('anusPartyGuild.text-anus.id')
                    ) as Discord.TextChannel).send(
                        'gloom group is online, gloom?'
                    );
                }
            } else {
                if (state.anusGuild.messageState[game] == null) {
                    state.anusGuild.messageState[game] = {
                        messaged: false,
                    };
                }
                if (state.anusGuild.messageState[game].messaged) {
                    state.anusGuild.messageState[game].messaged = false;
                }
            }
        }
    );
};

export { watchGameMembers };
