import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Copy } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

import RoomSpotDifference from "./RoomSpotDifference"; // 👈 important import

const simulatedPlayers = [
  { id: 1, name: "Player 1", score: 0, avatar: "P1" },
  { id: 2, name: "Player 2", score: 0, avatar: "P2" },
  { id: 3, name: "Player 3", score: 0, avatar: "P3" },
];

export default function WaitingRoom() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Guest";

  const [players, setPlayers] = useState([
    { id: 0, name: playerName, score: 0, avatar: playerName.slice(0, 2).toUpperCase() },
    ...simulatedPlayers,
  ]);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("beginner");

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Room code copied!");
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

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
        {!gameStarted ? (
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
                      <div key={player.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Avatar><AvatarFallback>{player.avatar}</AvatarFallback></Avatar>
                        <div className="font-medium">{player.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Difficulty</h3>
                  <Tabs value={currentLevel} onValueChange={handleLevelChange}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="beginner">Beginner</TabsTrigger>
                      <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button size="lg" className="w-full" onClick={startGame}>
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <RoomSpotDifference
            playerName={playerName}
            roomCode={code}
            players={players}
            setPlayers={setPlayers}
            currentLevel={currentLevel}
          />
        )}
      </main>
    </div>
  );
}
