import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ClientProgressMeter from "@/components/ClientProgressMeter";

import FillTheBlankGame from "../../components/FillTheBlankGame";
// import { QRCodeCanvas } from "qrcode.react"; // ✅ ADD THIS import
import { RoomQRCode } from "../../components/RoomQRCode";


// Removed unused imports
// Removed unused imports

interface finalGameSelection {
  gameMode: string;
  language: string;
  difficulty: string;
}

export default function WaitingRoom() {
  const navigate = useNavigate();
  // get code query param
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Guest";

  const sendClientInfo = (field: string, value: any) => {
    if (wss && ws_connected) {
      wss.send(
        JSON.stringify({
          type: `room${field.charAt(0).toUpperCase() + field.slice(1)}`,
          payload: { [field]: value },
        })
      );
    }
  };

  const [players, setPlayers] = useState<string[]>([]);
  // const [currentUserId, setCurrentUserId] = useState(null);
  let currentUserId = '';
  const [currentUserState, setCurrentUserState] = useState({
    ready: false,
    choices: {
      gameMode: "default",
      difficulty: "default",
      language: "default",
    },
  });
  interface GameState {
    client_state: {
      [player: string]: {
        ready: boolean;
        choices?: {
          gameMode?: string;
          language?: string;
          difficulty?: string;
        };
      };
    };
  }

  const [gameState, setGameState] = useState<GameState>({
    client_state: {},
  });
  const [step, setStep] = useState(1);

  const [wss, setWss] = useState<WebSocket | null>(null);
  const [ws_connected, setWs_connected] = useState(false);
  interface ClientInfo {
    ready: number;
    total: number;
    gameMode?: number;
    language?: number;
    difficulty?: number;
  }

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    ready: 0,
    total: 0,
  });

  const [gameStartCountdown, setGameStartCountdown] = useState(0);
  const [finalGameSelection, setFinalGameSelection] = useState<finalGameSelection>({language: "", gameMode: "", difficulty: ""});

  const [gameQuestions, setGameQuestions] = useState([]);

  const [gameScore, setGameScore] = useState(0);
  
  const [clientStates, setClientStates] = useState({});

  const [completed, setCompleted] = useState(false); // State to track if the game is completed

  const [questionsAnswered, setQuestionsAnswered] = useState(0); // State to track the number of questions answered

  let timerActive = false; // Flag to track if the timer is active

  useEffect(() => {
    console.log("User completed game:", completed);
  }, [completed]);

  useEffect(() => {
    // const socket = new WebSocket(`ws:${import.meta.env.VITE_API_URL}`);
    const socket = new WebSocket(`wss:${import.meta.env.VITE_API_URL}`);
    const room_id = code;

    socket.onopen = () => {
      setWs_connected(true);
      setWss(socket);
      socket.send(
        JSON.stringify({
          type: "joinRoom",
          payload: { room_id, name: playerName },
        })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "gameState":
          const current_players = message.payload?.gameState?.client_state
            ? Object.keys(message.payload.gameState.client_state)
            : [];
          setPlayers(current_players);
          setClientInfo(message.payload.clientInfo);
          setGameState(message.payload.gameState);

          setClientStates(message.payload.gameState.client_state);

          if ((message.payload.gameState.questions).length > 0) {
            setGameQuestions(message.payload.gameState.questions);

            if(!timerActive) {
              timerActive = true; // Set the flag to indicate the timer is active
              setTimeout(() => {
                setGameStartCountdown(3);
        
                const loop = setInterval(() => {
                  setGameStartCountdown((prev) => {
                    if (prev <= 0) {
                      clearInterval(loop);
                      setStep(6);
                      timerActive = false; // Reset the flag when the countdown ends
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }, 500);
            }
          }

          break;
        case "connected":
          // setCurrentUserId(message.payload.id);
          currentUserId = message.payload.id;
          break;
        case "gameOver":
          console.log("gameOver", message.payload);
          setTimeout(() => {

            // find the player with the highest score and set it as the winner
            const winner = Object.keys(message.payload.client_state).reduce((prev, curr) => {
              return message.payload.client_state[curr].score > message.payload.client_state[prev].score ? curr : prev;
            });
            const winnerId = winner;
            const winnerScore = message.payload.client_state[winner].score;
            const winnerQuestionsAnswered = message.payload.client_state[winner].questionsAnswered;
            const totalQuestions = message.payload.client_state[winner].questionsAnswered;
            const gameMode = message.payload.client_state[winner].choices.gameMode;
            const language = message.payload.client_state[winner].choices.language;
            const difficulty = message.payload.client_state[winner].choices.difficulty;
  
            navigate(`/multiplayer/gameover?winnerId=${winnerId}&winnerScore=${winnerScore}&questionsAnswered=${winnerQuestionsAnswered}&totalQuestions=${totalQuestions}&gameMode=${gameMode}&language=${language}&difficulty=${difficulty}&currentUserId=${currentUserId}&room_id=${room_id}`);
          
          }, 1000);

          break;
        case "gameSelection":
          console.log("gameSelection", message.payload);
          setFinalGameSelection(message.payload);
          setStep(5);
          break
        default:
          break;
      }
    };

    socket.onclose = () => {
      setWs_connected(false);
      setWss(null);
    };

    return () => {
      socket.close();
    };
  }, [code, playerName]);

  useEffect(() => {
    // update the game score to the server ws
    if (wss && ws_connected) {
      wss.send(
        JSON.stringify({
          type: "updateGameScore",
          payload: { score: gameScore },
        })
      );
    }
  }, [gameScore])

  useEffect(() => {
    // update the game score to the server ws
    if (wss && ws_connected) {
      wss.send(
        JSON.stringify({
          type: "updateQuestionsAnswered",
          payload: { questionsAnswered },
        })
      );
    }
  }, [questionsAnswered]);

  useEffect(() => {
    const counts = clientInfo;

    if (step === 1 && counts.ready === counts.total && counts.total >= 2) {
      setStep(2);
    }
    if (step === 2 && counts.gameMode === counts.total) {
      setStep(3);
    }
    if (step === 3 && counts.language === counts.total) {
      setStep(4);
    }
    if (step === 4 && counts.difficulty === counts.total) {
      // setStep(5);
    }
  }, [clientInfo]);

  // const copyCode = () => {
  //   if (code) {
  //     navigator.clipboard.writeText(code);
  //     alert("Room code copied!");
  //   } else {
  //     alert("Room code is unavailable!");
  //   }
  // };

  const updateUserState = (field: string, value: any) => {
    const updatedState = {
      ...currentUserState,
      choices: {
        ...currentUserState.choices,
        [field]: value,
      },
    };
    setCurrentUserState(updatedState);
    sendClientInfo(field, value);
  };

  const ConnectionStatus = () => (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2">
      <div
        className={`h-3 w-3 rounded-full ${
          ws_connected ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span>{ws_connected ? "Connected" : "Not Connected"}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <header className="border-b border-gray-300 px-4 py-3 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/multiplayer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-gray-700">Room Code</h1>
                <p className="text-lg font-bold text-blue-600">{code}</p>
              </div>
              <RoomQRCode code={code || ""} />
            </div>
          </div>

        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5 text-gray-600" />
            <span>{players.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-</Button>auto p-6">
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-700">Waiting Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Players</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.map((player) => (
                      <div
                        key={player}
                        className={`p-2 rounded ${
                          player === currentUserId
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <p className="flex items-cent</Card>er justify-between text-sm font-medium">
                          {player}
                          <span
                            className={`${
                              gameState?.client_state?.[player]?.ready
                                ? "text-green-500"
                                : "text-gray-500"
                            }`}
                          >
                            {gameState?.client_state?.[player]?.ready
                              ? "Ready"
                              : "Waiting..."}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-blue-500 text-white"
                  onClick={() => {
                    updateUserState("ready", true);
                  }}
                  disabled={players.length < 2}
                >
                  Ready
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-700">Select Game Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["difference", "fill"].map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => updateUserState("gameMode", mode)}
                      className={`relative ${
                        currentUserState.choices.gameMode === mode
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {mode}
                      <span className="absolute -top-0 -right-0 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        {
                          Object.values(gameState?.client_state || {}).filter(
                            (state) => state.choices?.gameMode === mode
                          ).length
                        }
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-700">Select Language</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "JavaScript",
                    "Python",
                    "Java",
                    "C++",
                    "C#",
                    "Go",
                    "Ruby",
                    "PHP",
                    "Swift",
                    "TypeScript",
                  ].map((lang) => (
                    <Button
                      key={lang}
                      onClick={() => updateUserState("language", lang)}
                      className={`relative ${
                        currentUserState.choices.language === lang
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lang}
                      <span className="absolute -top-0 -right-0 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        {
                          Object.values(gameState?.client_state || {}).filter(
                            (state) => state.choices?.language === lang
                          ).length
                        }
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-700">Select Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button
                      key={level}
                      onClick={() => updateUserState("difficulty", level)}
                      className={`relative ${
                        currentUserState.choices.difficulty === level
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {level}
                      <span className="absolute -top-0 -right-0 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        {
                          Object.values(gameState?.client_state || {}).filter(
                            (state) => state.choices?.difficulty === level
                          ).length
                        }
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* step 6 is an animation the pops up in order all of the final selection options. this builds anticipation and suspense */}
        {step === 5 && (
          <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
            
            {/* Countdown Overlay */}
            {gameStartCountdown > 0 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                <p className="text-6xl md:text-8xl font-extrabold text-gray-800">{gameStartCountdown}</p>
              </div>
            )}

            {/* Actual Content */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center z-10">
              Final Game Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
              
              {/* Game Mode Card */}
              <Card className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center py-12 px-8">
                <CardHeader className="flex flex-col items-center justify-center">
                  <CardTitle className="text-gray-800 text-2xl md:text-3xl font-bold mb-4">
                    Game Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-2xl md:text-3xl font-semibold text-gray-600 truncate max-w-[14rem]">
                    {finalGameSelection?.gameMode}
                  </p>
                </CardContent>
              </Card>

              {/* Language Card */}
              <Card className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center py-12 px-8">
                <CardHeader className="flex flex-col items-center justify-center">
                  <CardTitle className="text-gray-800 text-2xl md:text-3xl font-bold mb-4">
                    Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-2xl md:text-3xl font-semibold text-gray-600 truncate max-w-[14rem]">
                    {finalGameSelection?.language}
                  </p>
                </CardContent>
              </Card>

              {/* Difficulty Card */}
              <Card className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center py-12 px-8">
                <CardHeader className="flex flex-col items-center justify-center">
                  <CardTitle className="text-gray-800 text-2xl md:text-3xl font-bold mb-4">
                    Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-2xl md:text-3xl font-semibold text-gray-600 truncate max-w-[14rem]">
                    {finalGameSelection?.difficulty}
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        )}

        {step === 6 && (
          <>
            <div className="max-w-2xl mx-auto">
              {/* <FillTheBlankGame setGameScore={setGameScore} /> */}
              <FillTheBlankGame score = {gameScore} setScore={setGameScore} setCompleted = {setCompleted} questions = {gameQuestions} setQuestionsAnswered={setQuestionsAnswered} />
            </div>
              {/* Player Progress Meters (right side) */}
            <div className="w-full lg:w-1/3 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-700 text-center">Players Progress</h2>
                <ClientProgressMeter
                  clients={clientStates}
                  totalQuestions={gameQuestions.length}
                />
            </div>
          </>
        )}

      </main>

      <ConnectionStatus />
    </div>
  );
}