import { Guild } from 'discord.js';

const fetchOnlineMembers = (guild?: Guild): Array<string> => {
    if (guild) {
        return guild.members.cache
            .filter(({ presence }) => presence?.status === 'online')
            .map(({ user: { id } }) => id);
    }
    return [];
};

export default fetchOnlineMembers;
