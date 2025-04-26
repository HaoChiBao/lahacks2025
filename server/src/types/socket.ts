interface SocketRoom {
    [roomID: string]: {
        [clientID: string]: any;
    };
}

interface WebSocketMessage {
    type: string;
    payload: any;
}

export {WebSocketMessage, SocketRoom};