import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Copy } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// Removed unused imports
// Removed unused imports

export default function WaitingRoom() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Guest";

  const sendClientInfo = (field, value) => {
    if (wss && ws_connected) {
      wss.send(
        JSON.stringify({
          type: `room${field.charAt(0).toUpperCase() + field.slice(1)}`,
          payload: { [field]: value },
        })
      );
    }
  };

  const [players, setPlayers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserState, setCurrentUserState] = useState({
    ready: false,
    choices: {
      gameMode: "default",
      difficulty: "default",
      language: "default",
    },
  });
  const [gameState, setGameState] = useState({});
  const [step, setStep] = useState(1);

  const [wss, setWss] = useState(null);
  const [ws_connected, setWs_connected] = useState(false);
  const [clientInfo, setClientInfo] = useState({});

  useEffect(() => {
    const socket = new WebSocket(`ws:${import.meta.env.VITE_API_URL}`);
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
          break;
        case "connected":
          setCurrentUserId(message.payload.id);
          break;
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
      console.log("All players are ready. Starting the game...");
    }
  }, [clientInfo]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Room code copied!");
  };

  const updateUserState = (field, value) => {
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
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-700">Room: {code}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={copyCode}
              className="h-7 w-7 p-0 bg-gray-200 text-gray-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5 text-gray-600" />
            <span>{players.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
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
                        <p className="flex items-center justify-between text-sm font-medium">
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
                  {["difference", "fill", "lobby"].map((mode) => (
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
      </main>

      <ConnectionStatus />
    </div>
  );
}