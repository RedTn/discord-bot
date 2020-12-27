import Discord from 'discord.js';

const fetchOnlineMembers = (membersList?: Discord.Guild): Array<string> =>
    membersList.members.cache
        .filter(({ presence: { status } }) => status === 'online')
        .map(({ user: { id } }) => id);

export default fetchOnlineMembers;
