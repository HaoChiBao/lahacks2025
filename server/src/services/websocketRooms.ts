import { SocketRoom } from "../types/socket"

import { Difficulty, Language, GameModes } from "../types/socket"

import { generateFillInTheBlank } from "./generateQuestions"

class SocketRooms {
    rooms: SocketRoom
    constructor() {
        this.rooms = {}
    }

    generateRoomId() {
        const room_id = Math.random().toString(36).substring(2, 15)
        return room_id
    }
    
    createRoom(room_id: string | null = null) {
        if(!room_id) room_id = this.generateRoomId()
        if (!this.rooms[room_id]) {
            this.rooms[room_id] = {
                mode: 'default',
                loop: this.roomLoop(room_id),
                state: {
                    questions: [],
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
            // console.log("Room Loop", room_id)
            const clients = this.rooms[room_id].clients
            const clientInfo = this.getClientRoomInfo(room_id)

            for (const ws in clients) {
                if (clients[ws].readyState === clients[ws].OPEN) {
                    this.rooms[room_id].clients[ws].send(JSON.stringify({
                        type: 'gameState',
                        payload: {
                            gameState: this.rooms[room_id].state,
                            clientInfo,
                        }
                    }))
                } else {
                    console.log("Client not open")
                }
            }

            if (clientInfo.ready === clientInfo.total) {
                this.rooms[room_id].state.in_progress = true
            }

            // check if clientInfo is all ready and difficulty, language, game mode are all chosen
            if (clientInfo.ready === clientInfo.total && clientInfo.difficulty === clientInfo.total && clientInfo.language === clientInfo.total && clientInfo.gameMode === clientInfo.total) {
                // console.log("Game selection")

                const clientStates = this.rooms[room_id].state.client_state;
                const options = {
                    difficulty: {},
                    language: {},
                    gameMode: {}
                };

                // Count occurrences of each choice
                for (const ws in clientStates) {
                    const choices = clientStates[ws].choices;
                    options.difficulty[choices.difficulty] = (options.difficulty[choices.difficulty] || 0) + 1;
                    options.language[choices.language] = (options.language[choices.language] || 0) + 1;
                    options.gameMode[choices.gameMode] = (options.gameMode[choices.gameMode] || 0) + 1;
                }

                if (clientInfo.difficulty === clientInfo.total && clientInfo.language === clientInfo.total && clientInfo.gameMode === clientInfo.total && this.rooms[room_id].mode === 'default') {

                    
                    // Helper function to determine the most selected option or break ties randomly
                    const selectOption = (optionCounts: Record<string, number>) => {
                        const maxCount = Math.max(...Object.values(optionCounts));
                        const topOptions = Object.keys(optionCounts).filter(key => optionCounts[key] === maxCount);
                        return topOptions[Math.floor(Math.random() * topOptions.length)];
                    };
    
                    const finalState = {
                        difficulty: selectOption(options.difficulty),
                        language: selectOption(options.language),
                        gameMode: selectOption(options.gameMode),
                    };
    
                    this.rooms[room_id].state.difficulty = finalState.difficulty as Difficulty;
                    this.rooms[room_id].state.language = finalState.language as Language;
                    this.rooms[room_id].mode = finalState.gameMode as GameModes;

                    console.log("Final State", finalState)
                    // send message to all clients with the final state
                    for (const ws in clients) {
                        if (clients[ws].readyState === clients[ws].OPEN) {
                            this.rooms[room_id].clients[ws].send(JSON.stringify({
                                type: 'gameSelection',
                                payload: finalState
                            }))
                        } else {
                            console.log("Client not open")
                        }
                    }

                    generateFillInTheBlank(finalState.language, finalState.difficulty, 5)
                    .then((questions) => {
                        this.rooms[room_id].state.questions = questions
                    })
                    .catch((err) => {})
                }

                const allClientsAnswered = () => {
                    for (const ws in clients) {
                        if (this.rooms[room_id].state.client_state[ws].questionsAnswered !== this.rooms[room_id].state.questions.length) {
                            return false
                        }
                    }
                    return true
                }
                if (this.rooms[room_id].state.questions.length > 0 && allClientsAnswered()) {
                    // for all clients if questionsAnswered is equal to questions.length, set in_progress to false and send message to all clients
                    const client_ids = Object.keys(this.rooms[room_id].state.client_state)
                    for (const id of client_ids) {
                        
                        this.rooms[room_id].state.in_progress = false
                        const ws = this.rooms[room_id].clients[id]
                        if (ws.readyState === ws.OPEN) {
                            this.rooms[room_id].clients[id].send(JSON.stringify({
                                type: 'gameOver',
                                payload: {
                                    client_state: this.rooms[room_id].state.client_state,
                                }
                            }))
                        } else {
                            console.log("Client not open")
                        }
                    }
                    clearInterval(this.rooms[room_id].loop)

                }

            }

            // console.log("Client Info", clientInfo)

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
        if (!this.rooms[room_id]) {
            // create room if it doesn't exist
            room_id = this.createRoom(room_id)
        } else {
            // check if room is in progress
            if (this.rooms[room_id].state.in_progress) {
                return false
            }
        }
        this.rooms[room_id].clients[ws.id] = ws
        this.rooms[room_id].state.client_state[ws.id] = {
            ready: false,
            score: 0,
            questionsAnswered: 0,
            choices: {
                gameMode: 'default',
                difficulty: 'default',
                language: 'default',
            }
        }

        ws.room_id = room_id
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
