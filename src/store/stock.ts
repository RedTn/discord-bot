import { createSlice, configureStore } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import ReduxPayload from 'interfaces/ReduxPayload';

const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        key: '',
    },
    reducers: {
        setKey: (state, action: ReduxPayload<string>) => {
            state.key = action.payload;
        },
    },
});

export const { setKey } = stockSlice.actions;

export const store = configureStore({
    reducer: stockSlice.reducer,
});

export const fetchStockQuote = async (
    stock: string
): Promise<Record<string, string> | string> => {
    try {
        const { data } = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${
                store.getState().key
            }`
        );
        return data;
    } catch (err: unknown) {
        return (err as AxiosError).toString();
    }
};

export const fetchStockOverview = async (
    stock: string
): Promise<Record<string, string> | string> => {
    try {
        const { data } = await axios.get(
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=${
                store.getState().key
            }`
        );
        return data;
    } catch (err: unknown) {
        return (err as AxiosError).toString();
    }
};

export const fetchIntraday = async (
    stock: string
): Promise<Record<string, Record<string, string>> | string> => {
    const interval = '5min';
    try {
        const { data } = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=${interval}&symbol=${stock}&apikey=${
                store.getState().key
            }`
        );
        return data[`Time Series (${interval})`];
    } catch (err: unknown) {
        return (err as AxiosError).toString();
    }
};

export const fetchDaily = async (
    stock: string
): Promise<Record<string, Record<string, string>> | string> => {
    try {
        const { data } = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${stock}&apikey=${
                store.getState().key
            }`
        );
        return data['Time Series (Daily)'];
    } catch (err: unknown) {
        return (err as AxiosError).toString();
    }
};

export type RootState = {
    key: string;
};
