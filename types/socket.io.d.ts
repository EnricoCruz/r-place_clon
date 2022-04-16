export interface IServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export interface IClientToServerEvents {
    hello: () => void;
}

export interface IInterServerEvents {
    ping: () => void;
}

export interface ISocketData {
    name: string;
    age: number;
}


// Data packets

export interface IPixelData {
    userid: number;
    pixelid: number;
    color: string;
    time: number;
    id?: number
}
