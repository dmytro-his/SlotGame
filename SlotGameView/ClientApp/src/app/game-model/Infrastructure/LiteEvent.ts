import { ILiteEvent } from './ILiteEvent';

export class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public subscribe(handler: { (data?: T): void }) : void {
        this.handlers.push(handler);
    }

    public unsubscribe(handler: { (data?: T): void }) : void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public raise(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
    }

    public expose() : ILiteEvent<T> {
        return this;
    }
}