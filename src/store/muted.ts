import { createSlice, configureStore } from '@reduxjs/toolkit';
import ReduxPayload from 'typings/ReduxPayload';

const messageSlice = createSlice({
    name: 'muted',
    initialState: [],
    reducers: {
        addMuted: (state: Array<string>, action: ReduxPayload<string>) => {
            if (!state.includes(action.payload)) {
                state.push(action.payload);
            }
        },
        removeMuted: (state: Array<string>, action: ReduxPayload<string>) => {
            const index = state.indexOf(action.payload);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
    },
});

export const { addMuted, removeMuted } = messageSlice.actions;

export const store = configureStore({
    reducer: messageSlice.reducer,
});

export type RootState = Array<string>;
