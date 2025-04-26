import { useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function WaitingRoom() {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Guest";
  const gameMode = searchParams.get("mode") || "spot";

  const dummyPlayers = [
    { id: 1, name: playerName, avatar: playerName.slice(0, 2).toUpperCase() },
    { id: 2, name: "Player 1", avatar: "P1" },
    { id: 3, name: "Player 2", avatar: "P2" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Link to="/multiplayer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Room: {roomCode}</h1>
          </div>
          <div className="text-sm">{dummyPlayers.length} Players</div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Waiting for Players</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Players List */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Players in Room</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyPlayers.map((player) => (
                  <div key={player.id} className="flex items-center space-x-3 border rounded-md p-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-black font-bold">
                      {player.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">Ready</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Settings */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Game Mode</h2>
              <div className="text-center text-lg capitalize">{gameMode.replace("-", " ")}</div>

              <h2 className="text-xl font-semibold mt-6 mb-4">Difficulty</h2>
              <Tabs defaultValue="beginner" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Start Game */}
            <div className="flex justify-center pt-6">
              <Button size="lg" className="w-full max-w-xs">
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
