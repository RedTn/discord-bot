interface IState {
    anusGuild: {
        online: string[];
        messageState: {
            [game: string]: {
                messaged: boolean;
            };
        };
    };
}

export default IState;
