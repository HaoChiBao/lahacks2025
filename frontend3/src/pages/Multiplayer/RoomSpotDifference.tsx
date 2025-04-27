import { useEffect, useState } from "react";
import { Clock, Code2, Heart } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { codeSnippets } from "../../lib/code-snippets";

interface RoomSpotDifferenceProps {
  playerName: string;
  players: { id: string; name: string; score: number; avatar: string }[];
  setPlayers: React.Dispatch<React.SetStateAction<{ id: string; name: string; score: number; avatar: string }[]>>;
  currentLevel: number;
}

export default function RoomSpotDifference({ playerName, players, setPlayers, currentLevel }: RoomSpotDifferenceProps) {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentPuzzle = codeSnippets[currentLevel][currentSnippet];
  const totalDifferences = currentPuzzle.differences.length;

  // Timer
  useEffect(() => {
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
  }, []);

  const handleLineClick = (lineNumber: number) => {
    if (currentPuzzle.differences.includes(lineNumber)) {
      if (!foundDifferences.includes(lineNumber)) {
        const updated = [...foundDifferences, lineNumber];
        setFoundDifferences(updated);
        const pointsEarned = 10;
        setScore((prev) => prev + pointsEarned);

        // Update the player in the leaderboard
        setPlayers((prev) =>
          prev.map((p) =>
            p.name === playerName ? { ...p, score: p.score + pointsEarned } : p
          )
        );
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

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{currentPuzzle.language}</Badge>
          <Badge>
            {foundDifferences.length} / {totalDifferences} differences found
          </Badge>
        </div>
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      <Progress value={(foundDifferences.length / totalDifferences) * 100} className="h-2" />

      {/* Code Blocks */}
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

      {/* Explanation + Next Puzzle */}
      {showExplanation && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">Explanation</h3>
            <p className="mb-4">{currentPuzzle.explanation}</p>
            <Button onClick={handleNextPuzzle}>Next Puzzle</Button>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
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
  );
}
