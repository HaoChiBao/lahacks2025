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
            this.rooms[room_id] = {}
        }
        return room_id
    }
    
    joinRoom(room_id: string, ws : any) {
        if (this.rooms[room_id]) {
            this.rooms[room_id][ws.id] = ws
            ws.room_id = room_id
        }
        return this.rooms[room_id] ? true : false
    }
    
    leaveRoom(room_id: string, ws: any): boolean {
        if (this.rooms[room_id]) {
            if (this.rooms[room_id][ws.id]) {
                delete this.rooms[room_id][ws.id]
                ws.room_id = null

                if (Object.keys(this.rooms[room_id]).length === 0) {
                    delete this.rooms[room_id]
                }
                return true
            }
        }
        return false
    }
}

export default SocketRooms;
