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
  const [currentUserId, setCurrentUserId] = useState(null); // Current user's UID
  const [currentUserState, setCurrentUserState] = useState({
    ready: false,
    choices: {
      gameMode: "default",
      difficulty: "default",
      language: "default",
    },
  }); // Current user's state
  const [step, setStep] = useState(1);

  const [wss, setWss] = useState(null); // WebSocket connection
  const [ws_connected, setWs_connected] = useState(false); // WebSocket connection status
  const [clientInfo, setClientInfo] = useState({})

  useEffect(() => {
    console.log("Connecting to WebSocket server at:", import.meta.env.VITE_API_URL);
    const socket = new WebSocket(`ws:${import.meta.env.VITE_API_URL}`); // Replace with your WebSocket URL

    const room_id = code; // Use the room ID from the URL

    console.log("Joining room:", room_id);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs_connected(true);
      setWss(socket);

      // Join the room
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
          console.log("Current players:", current_players);
          setPlayers(current_players); // Update players list
          setClientInfo(message.payload.clientInfo); // Update client info
          break;
        case "connected":
          setCurrentUserId(message.payload.id); // Set the current user's UID
          break;
        default:
          console.warn("Unknown message type:", message.type);
          break;
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setWs_connected(false);
      setWss(null);
    };

    return () => {
      socket.close();
    };
  }, [code, playerName]);

  useEffect(() => {
    const counts = clientInfo
  
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

      // startGame
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/multiplayer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Room: {code}</h1>
            <Button variant="outline" size="icon" onClick={copyCode} className="h-7 w-7 p-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" />
            <span>{players.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Waiting Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Players</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.map((player) => (
                      <div
                        key={player}
                        className={`p-2 rounded ${
                          player === currentUserId ? "bg-green-500 text-black" : ""
                        }`}
                      >
                        <p className="flex items-center gap-2 text-sm font-medium">
                          {player}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
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
            <Card>
              <CardHeader>
                <CardTitle>Select Game Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["difference", "fill", "lobby"].map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => updateUserState("gameMode", mode)}
                      className={`${
                        currentUserState.choices.gameMode === mode ? "bg-green-500" : ""
                      }`}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Language</CardTitle>
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
                      className={`${
                        currentUserState.choices.language === lang ? "bg-green-500" : ""
                      }`}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button
                      key={level}
                      onClick={() => updateUserState("difficulty", level)}
                      className={`${
                        currentUserState.choices.difficulty === level ? "bg-green-500" : ""
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Connection Status */}
      <ConnectionStatus />
    </div>
  );
}