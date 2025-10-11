import Discord from 'discord.js';

const fetchOnlineMembers = (guild?: Discord.Guild): Array<string> => {
    if (!guild) {
        return [];
    }

    return guild.members.cache
        .filter((member) => member.presence?.status === 'online')
        .map(({ user: { id } }) => id);
};

export default fetchOnlineMembers;
