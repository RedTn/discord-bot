import { createSlice, configureStore } from '@reduxjs/toolkit';
import ReduxPayload from 'interfaces/ReduxPayload';

const messageSlice = createSlice({
    name: 'muted',
    initialState: [],
    reducers: {
        addMuted: (state: Array<string>, action: ReduxPayload<string>) => {
            if (!state.includes(action.payload)) {
                state.push(action.payload);
            }
        },
        removeMuted: (state: Array<string>, action: ReduxPayload<string>) =>
            state.filter((guild) => guild !== action.payload) as never[],
    },
});

export const { addMuted, removeMuted } = messageSlice.actions;

export const store = configureStore({
    reducer: messageSlice.reducer,
});

export type RootState = Array<string>;
