// custom handler for discord messages
import {
    Message,
    EmbedBuilder,
    AttachmentBuilder,
    TextChannel,
    Guild,
} from 'discord.js';
import * as R from 'ramda';
import { store } from 'store/muted';
import type { RootState } from 'store/muted';

export const sendMessage = R.curry(
    (
        value: string | EmbedBuilder | AttachmentBuilder,
        messageObject: Message
    ): void => {
        if (
            messageObject.guild?.id == null ||
            (store.getState() as RootState).every(
                (id) => id !== messageObject.guild?.id
            )
        ) {
            if ('send' in messageObject.channel) {
                if (typeof value === 'string') {
                    messageObject.channel.send(value);
                } else if (value instanceof EmbedBuilder) {
                    messageObject.channel.send({ embeds: [value] });
                } else if (value instanceof AttachmentBuilder) {
                    messageObject.channel.send({ files: [value] });
                }
            }
        }
    }
);

export const sendMessageChannel = (
    text: string,
    channel: TextChannel,
    guild?: Guild
): void => {
    if (
        guild?.id == null ||
        (store.getState() as RootState).every((id) => id !== guild?.id)
    ) {
        channel.send(text);
    }
};
