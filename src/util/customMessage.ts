// custom handler for discord messages
import Discord from 'discord.js';
import * as R from 'ramda';
import { store } from 'store/muted';
import type { RootState } from 'store/muted';

export const sendMessage = R.curry(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: string | any, messageObject: Discord.Message): void => {
        if (
            messageObject.guild?.id == null ||
            (store.getState() as RootState).every(
                (id) => id !== messageObject.guild?.id
            )
        ) {
            // Type guard for channels that support send
            if ('send' in messageObject.channel) {
                messageObject.channel.send(value);
            }
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
        // Type guard for channels that support send
        if ('send' in channel) {
            channel.send(text);
        }
    }
};
