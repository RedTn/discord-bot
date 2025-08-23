import Discord from 'discord.js';

const fetchOnlineMembers = (guild?: Discord.Guild): Array<string> => {
    if (guild) {
        return guild.members.cache
            .filter(({ presence: { status } }) => status === 'online')
            .map(({ user: { id } }) => id);
    }
    return [];
};

export default fetchOnlineMembers;
