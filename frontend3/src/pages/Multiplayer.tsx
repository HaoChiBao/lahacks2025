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
  const [roomCode, setRoomCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [gameModeSelect, setGameModeSelect] = useState(false);
  const [tempCode, setTempCode] = useState("");

  const navigate = useNavigate();

  function handleJoin() {
    if (!roomCode) return;
    navigate(`/multiplayer/room/${roomCode}`);
  }

  function handleCreate() {
    const code = generateRoomCode();
    setTempCode(code);
    setGameModeSelect(true);
  }

  function handleModeSelect() {
    if (!tempCode) return;
    setCreatedCode(tempCode); // finalize the code
    setGameModeSelect(false); // return to the "waiting for players" room screen
    navigate(`/multiplayer/room/${tempCode}`);
  }

  function joinRoom(mode:any) {
    if (!roomCode) return;
    navigate(`/multiplayer/room/${roomCode}?mode=${mode}`);
  }

  function copyCode() {
    navigator.clipboard.writeText(createdCode);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb] text-gray-800">
      {/* Header */}
      <header className="bg-[#f9fafb]">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon" className="hover:bg-blue-100">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Multiplayer</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          {!gameModeSelect ? (
            <Tabs defaultValue="join" value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#f1f5f9] rounded-xl p-1 shadow-inner">
                <TabsTrigger value="join" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black transition-all">
                  Join
                </TabsTrigger>
                <TabsTrigger value="create" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black transition-all">
                  Create
                </TabsTrigger>
              </TabsList>

              <TabsContent value="join">
                <Card className="bg-white shadow-md rounded-2xl p-4 border-0">
                  <CardHeader>
                    <CardTitle>Join a Game</CardTitle>
                    <CardDescription className="text-gray-500">Enter a room code to join</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <label htmlFor="room" className="text-sm font-medium">Room Code</label>
                      <Input
                        id="room"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="rounded-xl bg-gray-100 border-0 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white rounded-xl"
                      onClick={() => joinRoom("default")}
                    >
                      Join Game
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="create">
                <Card className="bg-white shadow-md rounded-2xl p-4 border-0">
                  <CardHeader>
                    <CardTitle>Create a Game</CardTitle>
                    <CardDescription className="text-gray-500">Generate a new room code</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {createdCode && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Room Code</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-2 rounded-xl font-mono text-center flex-1 text-lg">
                            {createdCode}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100"
                            onClick={copyCode}
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {!createdCode ? (
                      <Button className="w-full bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white rounded-xl" onClick={handleCreate}>
                        Create Game
                      </Button>
                    ) : (
                      <Button variant="ghost" className="w-full hover:bg-blue-100 rounded-xl" onClick={() => {
                        setCreatedCode("");
                        setTempCode("");
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
            <>
              {handleModeSelect()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
