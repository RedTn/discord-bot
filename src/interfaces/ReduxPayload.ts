interface ReduxPayload<T> {
    type: string;
    payload: T;
}

export default ReduxPayload;
