import Discord from 'discord.js';
import IWatch from 'interfaces/IWatch';
import { removeWatch, store as watchStore } from 'store/watchGame';
import {
    fetchOnlineMembers,
    sendMessageChannel,
    mentionTemplate,
} from 'discord-bot/util';

const watchGameMembers = (client: Discord.Client): void => {
    (watchStore.getState() as IWatch[]).forEach(
        ({ game, playerIds, id, guildId, channelId }) => {
            const guildInstance = client.guilds.cache.get(guildId);
            if (guildInstance) {
                const channelInstance = guildInstance.channels.cache.get(
                    channelId
                ) as Discord.TextChannel;
                if (channelInstance) {
                    const onlineMembers = fetchOnlineMembers(guildInstance);
                    if (playerIds.every((val) => onlineMembers.includes(val))) {
                        const playersString = playerIds
                            .map((playerId) => mentionTemplate`${playerId}`)
                            .join(', ');
                        sendMessageChannel(
                            `${game} group is online. ${playersString} game?`,
                            channelInstance,
                            guildInstance
                        );
                        watchStore.dispatch(removeWatch(id));
                    }
                }
            }
        }
    );
};

export { watchGameMembers };
