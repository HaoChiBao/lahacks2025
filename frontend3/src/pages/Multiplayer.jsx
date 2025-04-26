import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { generateRoomCode } from "../lib/utils";

export default function MultiplayerPage() {
  const [tab, setTab] = useState("join");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [gameModeSelect, setGameModeSelect] = useState(false); // NEW
  const navigate = useNavigate();

  function handleJoin() {
    if (!playerName || !roomCode) return;
    navigate(`/multiplayer/room/${roomCode}?name=${encodeURIComponent(playerName)}`);
  }

  function handleCreate() {
    if (!playerName) return;
    const code = generateRoomCode();
    setCreatedCode(code);
    setGameModeSelect(true); // NEW: after create, move to pick mode
  }

  function handleModeSelect(mode) {
    if (!createdCode || !playerName) return;
    navigate(`/multiplayer/${mode}/${createdCode}?name=${encodeURIComponent(playerName)}`);
  }

  function copyCode() {
    navigator.clipboard.writeText(createdCode);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Multiplayer</h1>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          {!gameModeSelect ? (
            <Tabs defaultValue="join" value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="join">Join a Game</TabsTrigger>
                <TabsTrigger value="create">Create a Game</TabsTrigger>
              </TabsList>

              <TabsContent value="join">
                <Card>
                  <CardHeader>
                    <CardTitle>Join a Game</CardTitle>
                    <CardDescription>Enter a room code to join an existing game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="room" className="text-sm font-medium">Room Code</label>
                      <Input
                        id="room"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleJoin}>
                      Join Game
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a Game</CardTitle>
                    <CardDescription>Create a new room and share the code</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name-create" className="text-sm font-medium">Your Name</label>
                      <Input
                        id="name-create"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                      />
                    </div>

                    {createdCode && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Room Code</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-muted p-2 rounded-md font-mono text-center flex-1">
                            {createdCode}
                          </div>
                          <Button variant="outline" size="icon" onClick={copyCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Share this code with friends
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {!createdCode ? (
                      <Button onClick={handleCreate} className="w-full">
                        Create Game
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => {
                        setCreatedCode("");
                        setGameModeSelect(false);
                      }}>
                        Generate New Code
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select Game Mode</CardTitle>
                <CardDescription>Choose how you want to play</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <Button onClick={() => handleModeSelect("spot")} size="lg" className="w-full">
                  Spot the Difference
                </Button>
                <Button onClick={() => handleModeSelect("fill")} size="lg" variant="secondary" className="w-full">
                  Fill in the Blanks
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
