type GameModes = string | 'difference' | 'fill' | 'default';
type Difficulty = string | 'Beginner' | 'Intermediate' | 'Advanced' | 'default';
type Language = string | 'JavaScript' | 'Python' | 'Java' | 'C++' | 'C#' | 'Go' | 'Ruby' | 'PHP' | 'Swift' | 'TypeScript' | 'default';

interface ClientGameState {
    ready: boolean;
    score: number;
    questionsAnswered: number;
    choices: {
        gameMode: GameModes;
        difficulty: Difficulty;
        language: Language;
    }
}

interface SocketRoom {
    [roomID: string]: {
        mode: GameModes; // game_type
        loop: any; // setInterval
        state: {
            in_progress: boolean;
            difficulty: Difficulty;
            language: Language;
            questions: any[]; // array of questions
            client_state: {
                [ws_id: string]: ClientGameState
            };
        };
        clients: {
            [wsID: string]: any;
        };
    };
}

interface WebSocketMessage {
    type: string;
    payload: any;
}

export {WebSocketMessage, SocketRoom, ClientGameState, GameModes, Difficulty, Language};