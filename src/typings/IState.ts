interface IState {
    anusGuild: {
        online: string[];
        messageState: {
            [game: string]: {
                messaged: boolean;
            };
        };
    };
    mutedGuilds: Set<string>;
}

export default IState;
