import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Code2, Heart, Users, Copy } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { codeSnippets } from "../../lib/code-snippets";

// Fake players for now
const simulatedPlayers = [
  { id: 1, name: "Player 1", score: 0, avatar: "P1" },
  { id: 2, name: "Player 2", score: 0, avatar: "P2" },
  { id: 3, name: "Player 3", score: 0, avatar: "P3" },
];

export default function WaitingRoom() {
  const { code } = useParams(); // :code from /multiplayer/room/:code
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Guest";
  const navigate = useNavigate();

  const [players, setPlayers] = useState([
    { id: 0, name: playerName, score: 0, avatar: playerName.slice(0, 2).toUpperCase() },
    ...simulatedPlayers,
  ]);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentPuzzle = codeSnippets[currentLevel][currentSnippet];
  const totalDifferences = currentPuzzle.differences.length;

  // Timer for the game
  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted]);

  const handleLineClick = (lineNumber) => {
    if (!gameStarted) return;
    if (currentPuzzle.differences.includes(lineNumber)) {
      if (!foundDifferences.includes(lineNumber)) {
        const updated = [...foundDifferences, lineNumber];
        setFoundDifferences(updated);
        setScore((prev) => prev + 10);
      }
    } else {
      setLives((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleNextPuzzle = () => {
    setCurrentSnippet((prev) => (prev + 1) % codeSnippets[currentLevel].length);
    setFoundDifferences([]);
    setShowExplanation(false);
    setTimeLeft(60);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
    setCurrentSnippet(0);
    setFoundDifferences([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Room code copied!");
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
          {gameStarted && (
            <>
              <div className="flex items-center gap-1">
                <Code2 className="h-5 w-5" />
                <span>{score} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-500" />
                <span>{lives}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{timeLeft}s</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main */}
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
          <>
            {/* If game is started */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Progress value={(foundDifferences.length / totalDifferences) * 100} className="h-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="font-medium mb-2">Incorrect Code</div>
                      <CodeBlock
                        code={currentPuzzle.incorrectCode}
                        language={currentPuzzle.language}
                        highlightLines={foundDifferences}
                        onLineClick={handleLineClick}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="font-medium mb-2">Correct Code</div>
                      <CodeBlock
                        code={currentPuzzle.correctCode}
                        language={currentPuzzle.language}
                        highlightLines={foundDifferences}
                        onLineClick={handleLineClick}
                      />
                    </CardContent>
                  </Card>
                </div>

                {showExplanation && (
                  <Card className="mt-6">
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-2">Explanation</h3>
                      <p className="mb-4">{currentPuzzle.explanation}</p>
                      <Button onClick={handleNextPuzzle}>Next Puzzle</Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {players.sort((a, b) => b.score - a.score).map((player, idx) => (
                      <div key={player.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{idx + 1}</span>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{player.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{player.name}</span>
                        </div>
                        <span className="font-mono">{player.score}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
