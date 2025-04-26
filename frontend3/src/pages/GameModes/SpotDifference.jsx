import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Code2, Heart } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { codeSnippets } from "../../lib/code-snippets";

export default function SpotTheDifference() {
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentPuzzle = codeSnippets[currentLevel][currentSnippet];
  const totalDifferences = currentPuzzle.differences.length;

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const handleTimeUp = () => {
    if (lives > 1) {
      setLives((prev) => prev - 1);
      setTimeLeft(60);
      setFoundDifferences([]);
    } else {
      setGameActive(false);
    }
  };

  const handleLineClick = (lineNumber) => {
    if (!gameActive || showExplanation) return;

    if (currentPuzzle.differences.includes(lineNumber)) {
      if (!foundDifferences.includes(lineNumber)) {
        const newFoundDifferences = [...foundDifferences, lineNumber];
        setFoundDifferences(newFoundDifferences);

        const difficultyMultiplier = currentLevel === "beginner" ? 1 : currentLevel === "intermediate" ? 2 : 3;
        const pointsEarned = Math.round(10 * difficultyMultiplier * (timeLeft / 60));
        setScore((prev) => prev + pointsEarned);

        if (newFoundDifferences.length === totalDifferences) {
          setShowExplanation(true);
        }
      }
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const handleNextPuzzle = () => {
    const nextSnippet = (currentSnippet + 1) % codeSnippets[currentLevel].length;
    setCurrentSnippet(nextSnippet);
    setFoundDifferences([]);
    setShowExplanation(false);
    setTimeLeft(60);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
    setCurrentSnippet(0);
    setFoundDifferences([]);
    setShowExplanation(false);
    setTimeLeft(60);
  };

  const handleRestartGame = () => {
    setScore(0);
    setLives(3);
    setCurrentSnippet(0);
    setFoundDifferences([]);
    setShowExplanation(false);
    setTimeLeft(60);
    setGameActive(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Code Difference Spotter</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Code2 className="mr-2 h-4 w-4" />
              <span>{score} pts</span>
            </div>
            <div className="flex items-center">
              <Heart className="mr-2 h-4 w-4 text-red-500" />
              <span>{lives}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {gameActive ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Tabs value={currentLevel} onValueChange={handleLevelChange} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{currentPuzzle.language}</Badge>
                <Badge>
                  {foundDifferences.length} / {totalDifferences} differences found
                </Badge>
              </div>
            </div>

            <Progress value={(foundDifferences.length / totalDifferences) * 100} className="h-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2 font-medium">Incorrect Code</div>
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
                  <div className="mb-2 font-medium">Correct Code</div>
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
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Explanation</h3>
                  <p className="mb-4">{currentPuzzle.explanation}</p>
                  <Button onClick={handleNextPuzzle}>Next Puzzle</Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <h2 className="text-3xl font-bold">Game Over</h2>
            <p className="text-xl">Your final score: {score} points</p>
            <Button size="lg" onClick={handleRestartGame}>
              Play Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
