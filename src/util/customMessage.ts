// custom handler for discord messages
import Discord from 'discord.js';
import * as R from 'ramda';
import { store } from 'store/muted';
import type { RootState } from 'store/muted';

export const sendMessage = R.curry(
    (text: string, messageObject: Discord.Message): void => {
        if (
            messageObject.guild?.id == null ||
            (store.getState() as RootState).every(
                (id) => id !== messageObject.guild?.id
            )
        ) {
            messageObject.channel.send(text);
        }
    }
);

export const sendMessageChannel = (
    text: string,
    channel: Discord.TextChannel,
    guild?: Discord.Guild
): void => {
    if (
        guild?.id == null ||
        (store.getState() as RootState).every((id) => id !== guild?.id)
    ) {
        channel.send(text);
    }
};
