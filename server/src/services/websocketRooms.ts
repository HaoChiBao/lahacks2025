import { SocketRoom } from "../types/socket"

class SocketRooms {
    rooms: SocketRoom
    constructor() {
        this.rooms = {}
    }

    generateRoomId() {
        const room_id = Math.random().toString(36).substring(2, 15)
        return room_id
    }
    
    createRoom() {
        const room_id = this.generateRoomId()
        if (!this.rooms[room_id]) {
            this.rooms[room_id] = {
                mode: 'lobby',
                loop: this.roomLoop(room_id),
                state: {
                    in_progress: false,
                    difficulty: 'default', // Replace 'default' with a valid Difficulty value
                    language: 'default', // Replace 'default' with a valid Language value
                    client_state: {},
                },
                clients: {},
            }
        }
        return room_id
    }

    roomLoop(room_id: string) {
        const loop = setInterval(() => {
            console.log("Room Loop", room_id)
            const clients = this.rooms[room_id].clients

            for (const ws in clients) {
                if (clients[ws].readyState === clients[ws].OPEN) {
                    this.rooms[room_id].clients[ws].send(JSON.stringify({
                        type: 'gameState',
                        payload: {
                            gameState: this.rooms[room_id].state,
                        }
                    }))
                } else {
                    console.log("Client not open")
                }
            }

            const clientInfo = this.getClientRoomInfo(room_id)

            console.log("Client Info", clientInfo)

        }, 500)
        return loop
    }

    // returns ready clients count, client count, client difficulty chosen count, client language chosen count, client game mode chosen count
    getClientRoomInfo(room_id: string) {
        const clientResponses = {
            ready: 0,
            total: 0,
            difficulty: 0,
            language: 0,
            gameMode: 0,
        }
        if (this.rooms[room_id]) {
            const clients = this.rooms[room_id].clients
            for (const ws in clients) {
                clientResponses.total++
                if (this.rooms[room_id].state.client_state[ws].ready) {
                    clientResponses.ready++
                }
                if (this.rooms[room_id].state.client_state[ws].choices.difficulty !== 'default') {
                    clientResponses.difficulty++
                }
                if (this.rooms[room_id].state.client_state[ws].choices.language !== 'default') {
                    clientResponses.language++
                }
                if (this.rooms[room_id].state.client_state[ws].choices.gameMode !== 'default') {
                    clientResponses.gameMode++
                }
            }
        }
        return clientResponses
    }
    
    joinRoom(room_id: string, ws : any) {
        if (this.rooms[room_id]) {
            this.rooms[room_id].clients[ws.id] = ws
            this.rooms[room_id].state.client_state[ws.id] = {
                ready: false,
                score: 0,
                choices: {
                    gameMode: 'default',
                    difficulty: 'default',
                    language: 'default',
                }
            }

            ws.room_id = room_id
        }
        return this.rooms[room_id] ? true : false
    }
    
    leaveRoom(room_id: string, ws: any): boolean {
        if (this.rooms[room_id]) {
            if (this.rooms[room_id].clients[ws.id]) {
                delete this.rooms[room_id].clients[ws.id];
                delete this.rooms[room_id].state.client_state[ws.id];
                ws.room_id = null;

                if (Object.keys(this.rooms[room_id].clients).length === 0) {
                    this.rooms[room_id].loop && clearInterval(this.rooms[room_id].loop);
                    delete this.rooms[room_id];
                }
                return true;
            }
        }
        return false;
    }
}

export default SocketRooms;
