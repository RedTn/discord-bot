import Discord from 'discord.js';

const fetchOnlineMembers = (membersList?: Discord.Guild): Array<string> => {
    if (Array.isArray(membersList)) {
        return membersList.members.cache
            .filter(({ presence: { status } }) => status === 'online')
            .map(({ user: { id } }) => id);
    }
    return [];
};

export default fetchOnlineMembers;
