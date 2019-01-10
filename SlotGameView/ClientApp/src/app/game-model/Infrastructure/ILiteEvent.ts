export interface ILiteEvent<T> {
    subscribe(handler: {
        (data?: T): void;
    }): void;
    unsubscribe(handler: {
        (data?: T): void;
    }): void;
}
