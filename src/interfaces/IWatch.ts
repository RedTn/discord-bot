export interface IWatchPayload {
    playerIds: string[];
    game: string;
    guildId: string;
    channelId: string;
}

interface IWatch extends IWatchPayload {
    id: string;
}

export default IWatch;
