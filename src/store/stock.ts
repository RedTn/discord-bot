import { createSlice, configureStore } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import ReduxPayload from 'interfaces/ReduxPayload';

const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        keys: [] as string[],
    },
    reducers: {
        setKeys: (state, action: ReduxPayload<string[]>) => {
            state.keys = action.payload;
        },
    },
});

export const { setKeys } = stockSlice.actions;

export const store = configureStore({
    reducer: stockSlice.reducer,
});

let currentKeyIndex = 0;

const getNextKey = (): string => {
    const { keys } = store.getState();
    const key = keys[currentKeyIndex % keys.length];
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    return key;
};

const getApiError = (data: Record<string, unknown>): string | null => {
    const errorField =
        data['Information'] || data['Error Message'] || data['Note'];
    if (typeof errorField === 'string') {
        return errorField;
    }
    return null;
};

const fetchWithKeyRotation = async <T>(
    buildUrl: (key: string) => string,
    extractData: (data: Record<string, unknown>) => T,
    label: string
): Promise<T | string> => {
    const { keys } = store.getState();
    let lastError = '';

    for (let i = 0; i < keys.length; i++) {
        const key = getNextKey();
        try {
            const { data } = await axios.get(buildUrl(key));
            const apiError = getApiError(data);
            if (apiError) {
                console.error(
                    `[${label}] key ${i + 1}/${keys.length}: ${apiError}`
                );
                lastError = apiError;
                continue;
            }
            return extractData(data);
        } catch (err: unknown) {
            lastError = (err as AxiosError).toString();
            console.error(
                `[${label}] key ${i + 1}/${keys.length}: ${lastError}`
            );
        }
    }

    return lastError;
};

export const fetchStockQuote = async (
    stock: string
): Promise<Record<string, string> | string> =>
    fetchWithKeyRotation(
        (key) =>
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${key}`,
        (data) => data as Record<string, string>,
        `fetchStockQuote ${stock}`
    );

export const fetchStockOverview = async (
    stock: string
): Promise<Record<string, string> | string> =>
    fetchWithKeyRotation(
        (key) =>
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock}&apikey=${key}`,
        (data) => data as Record<string, string>,
        `fetchStockOverview ${stock}`
    );

export const fetchIntraday = async (
    stock: string
): Promise<Record<string, Record<string, string>> | string> => {
    const interval = '5min';
    return fetchWithKeyRotation(
        (key) =>
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=${interval}&symbol=${stock}&apikey=${key}`,
        (data) =>
            data[`Time Series (${interval})`] as Record<
                string,
                Record<string, string>
            >,
        `fetchIntraday ${stock}`
    );
};

export const fetchDaily = async (
    stock: string
): Promise<Record<string, Record<string, string>> | string> =>
    fetchWithKeyRotation(
        (key) =>
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${stock}&apikey=${key}`,
        (data) =>
            data['Time Series (Daily)'] as Record<
                string,
                Record<string, string>
            >,
        `fetchDaily ${stock}`
    );

export type RootState = Record<string, string>;
