import { createSlice, configureStore } from '@reduxjs/toolkit';
import ReduxPayload from 'interfaces/ReduxPayload';
import IWatch, { IWatchPayload } from 'interfaces/IWatch';
import { v4 as uuidv4 } from 'uuid';

const watchSlice = createSlice({
    name: 'watchGame',
    initialState: [],
    reducers: {
        addWatch(state: Array<IWatch>, action: ReduxPayload<IWatchPayload>) {
            const id = uuidv4();
            const { game, playerIds, guildId, channelId } = action.payload;
            state.push({
                id,
                game,
                playerIds,
                guildId,
                channelId,
            });
        },
        removeWatch(state: Array<IWatch>, action: ReduxPayload<string>) {
            return state.filter(
                (watchGroup) => watchGroup.id !== action.payload
            ) as never[];
        },
        removeAll() {
            return [];
        },
    },
});

export const { addWatch, removeWatch, removeAll } = watchSlice.actions;

export const store = configureStore({
    reducer: watchSlice.reducer,
});

export type RootState = IWatch[];
