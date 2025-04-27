import { WebSocketServer } from "ws";

import SocketRooms from "./websocketRooms";
import { WebSocketMessage } from "../types/socket";

class Custom_WSS {
    private wss: WebSocketServer | null = null;
    private rooms: SocketRooms = new SocketRooms();
    private clients = {};

    init(server:any){
        this.wss = new WebSocketServer({ server });
        this.wss.on("connection", (ws: any) => {
            const id = Math.random().toString(36).substring(2, 15);

            ws.id = id;
            ws.room_id = null;

            this.clients[id] = ws;

            console.log("Client connected", id);
            this.sendMessage({
                type: "connected",
                payload: { id },
            }, ws);

            ws.on("message", (message: WebSocketMessage) => {
                const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
                this.messageHandler(parsedMessage, ws);
            });

            ws.on("close", () => {
                console.log("Client disconnected");
                if (ws.room_id) {
                    this.rooms.leaveRoom(ws.room_id, ws);
                }
                delete this.clients[id];
            });
        
        });
    }

    sendMessage(message: WebSocketMessage, ws: any) {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. Unable to send message.");
        }
    }

    messageHandler(message: WebSocketMessage, ws: any) {
        const { type, payload } = message;
        if (!type || !payload) {
            this.sendMessage({
                type: "error",
                payload: { message: "Invalid message format" },
            }, ws);
            return;
        }

        console.log("Received message:", type, payload);

        switch (type) {
            case "message":
                console.log(`Message received: ${payload.text}`);
                break;
            case "roomReady":
                if (ws.room_id) {
                    const room = this.rooms.rooms[ws.room_id];
                    if (room) {
                        room.state.client_state[ws.id].ready = payload.ready;
                        this.sendMessage({
                            type: "roomReady",
                            payload: { room_id: ws.room_id, ready: payload.ready },
                        }, ws);
                    } else {
                        this.sendMessage({
                            type: "error",
                            payload: { message: "Room does not exist" },
                        }, ws);
                    }
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Client is not in a room" },
                    }, ws);
                }
                break;

            case "roomGameMode":
                if (ws.room_id) {
                    const room = this.rooms.rooms[ws.room_id];
                    if (room) {
                        room.state.client_state[ws.id].choices.gameMode = payload.gameMode;
                        this.sendMessage({
                            type: "roomGameMode",
                            payload: { room_id: ws.room_id, gameMode: payload.gameMode },
                        }, ws);
                    } else {
                        this.sendMessage({
                            type: "error",
                            payload: { message: "Room does not exist" },
                        }, ws);
                    }
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Client is not in a room" },
                    }, ws);
                }
                break;
            case "roomDifficulty": 
                if (ws.room_id) {
                    const room = this.rooms.rooms[ws.room_id];
                    if (room) {
                        room.state.client_state[ws.id].choices.difficulty = payload.difficulty;
                        this.sendMessage({
                            type: "roomDifficulty",
                            payload: { room_id: ws.room_id, difficulty: payload.difficulty },
                        }, ws);
                    } else {
                        this.sendMessage({
                            type: "error",
                            payload: { message: "Room does not exist" },
                        }, ws);
                    }
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Client is not in a room" },
                    }, ws);
                }
                break;
            case "roomLanguage":    
                if (ws.room_id) {
                    const room = this.rooms.rooms[ws.room_id];
                    if (room) {
                        room.state.client_state[ws.id].choices.language = payload.language;
                        this.sendMessage({
                            type: "roomLanguage",
                            payload: { room_id: ws.room_id, language: payload.language },
                        }, ws);
                    } else {
                        this.sendMessage({
                            type: "error",
                            payload: { message: "Room does not exist" },
                        }, ws);
                    }
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Client is not in a room" },
                    }, ws);
                }
                break;

            case "updateGameScore":
                if (ws.room_id) {
                    const room = this.rooms.rooms[ws.room_id];
                    if (room) {
                        room.state.client_state[ws.id].score = payload.score;
                        this.sendMessage({
                            type: "updateGameScore",
                            payload: { room_id: ws.room_id, score: payload.score },
                        }, ws);
                    } else {
                        this.sendMessage({
                            type: "error",
                            payload: { message: "Room does not exist" },
                        }, ws);
                    }
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Client is not in a room" },
                    }, ws);
                }
                break;

            case "createRoom":
                const room_id = this.rooms.createRoom(null);
                const join = this.rooms.joinRoom(room_id, ws);
                if (!join) {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Failed to join room" },
                    }, ws);
                    return;
                }
                this.sendMessage({
                    type: "roomCreated",
                    payload: { room_id },
                }, ws);
                this.sendMessage({
                    type: "roomJoined",
                    payload: { room_id },
                }, ws);
                break;
            case "joinRoom":
                if (this.rooms.joinRoom(payload.room_id, ws)) {
                    this.sendMessage({
                        type: "roomJoined",
                        payload: { room_id: payload.room_id },
                    }, ws);
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Room does not exist" },
                    }, ws);
                }
                break;
            case "leaveRoom":
                console.log(`Leaving room: ${payload.room_id}`);
                if (this.rooms.leaveRoom(payload.room_id, ws)) {
                    this.sendMessage({
                        type: "roomLeft",
                        payload: { room_id: payload.room_id },
                    }, ws); 
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Failed to leave room or room does not exist" },
                    }, ws);
                }
                break;

            // send message to all clients in the same room
            case "messageAll":
                const room = this.rooms.rooms[ws.room_id];
                if (room) {
                    Object.values(room).forEach((client: any) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({
                                type: "message",
                                payload: { text: `${payload.text} from ${ws.id}` },
                            }));
                        }
                    });
                } else {
                    this.sendMessage({
                        type: "error",
                        payload: { message: "Room does not exist" },
                    }, ws);
                }
                break;
            default:
                this.sendMessage({
                    type: "error",
                    payload: { message: "Unknown message type" },
                }, ws);
                return;
        }
    }

    getClients(){
        return this.clients
    }

    getRooms(){
        return this.rooms.rooms
    }

}


export const wss = new Custom_WSS();