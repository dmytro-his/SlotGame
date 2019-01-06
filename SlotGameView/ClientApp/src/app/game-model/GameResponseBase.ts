import { Guid } from "guid-typescript";

export class GameResponseBase {
    public sessionId: Guid;

    public statusResponse: StatusResponse;
}

