import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Code2, Heart } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { AnimalFloat } from "../../components/HerringFloat"; // <- assuming you built it
import { codeSnippets } from "../../lib/code-snippets";

const animalModels = [
  "/animals/Herring_LOD_All.glb",
  "/animals/Sparrow_LOD_All.glb",
  "/animals/Pudu_LOD_All.glb",
];

export default function SpotTheDifference() {
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wasAnswerCorrect, setWasAnswerCorrect] = useState(true);

  const navigate = useNavigate();
  const currentPuzzle = codeSnippets[currentLevel][currentSnippet];
  const totalDifferences = currentPuzzle.differences.length;
  const animalModel = "/animals/Pudu_LOD_All.glb";

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
        const newFound = [...foundDifferences, lineNumber];
        setFoundDifferences(newFound);
        const difficultyMultiplier = currentLevel === "beginner" ? 1 : currentLevel === "intermediate" ? 2 : 3;
        const points = Math.round(10 * difficultyMultiplier * (timeLeft / 60));
        setScore((prev) => prev + points);

        if (newFound.length === totalDifferences) {
          setWasAnswerCorrect(true);
          setShowExplanation(true);
        }
      }
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setWasAnswerCorrect(false);
      setShowExplanation(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentSnippet + 1 >= 3) {
      navigate(`/gameover?score=${score}&correct=3&total=3&level=${currentLevel}&mode=single`);
    } else {
      setCurrentSnippet((prev) => prev + 1);
      setFoundDifferences([]);
      setShowExplanation(false);
      setTimeLeft(60);
    }
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
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-gray-700">BrainBug</h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
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

      {/* Main */}
      <main className="flex-1 container py-8">
        {gameActive ? (
          <div className="space-y-8">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Tabs value={currentLevel} onValueChange={handleLevelChange}>
                <TabsList className="rounded-lg bg-gray-100">
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center space-x-3">
                <Badge className="bg-gray-200 text-gray-700">{currentPuzzle.language}</Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {foundDifferences.length} / {totalDifferences} found
                </Badge>
              </div>
            </div>

            {/* Progress */}
            <Progress value={(foundDifferences.length / totalDifferences) * 100} className="h-2 bg-gray-200 rounded-full" />

            {/* Code Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-white shadow-md p-6">
                <h3 className="text-gray-700 font-semibold mb-4">Incorrect Code</h3>
                <div className="rounded-xl bg-[#0f172a] p-4">
                  <CodeBlock
                    code={currentPuzzle.incorrectCode}
                    language={currentPuzzle.language}
                    highlightLines={foundDifferences}
                    onLineClick={handleLineClick}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-md p-6">
                <h3 className="text-gray-700 font-semibold mb-4">Correct Code</h3>
                <div className="rounded-xl bg-[#0f172a] p-4">
                  <CodeBlock
                    code={currentPuzzle.correctCode}
                    language={currentPuzzle.language}
                    highlightLines={foundDifferences}
                    onLineClick={handleLineClick}
                  />
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            {showExplanation && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white rounded-2xl shadow-md p-8 mt-8">
                {/* 3D Animal */}
                <div className="w-full md:w-1/3 flex justify-center">
                  <div style={{ width: "200px", height: "200px" }}>
                    <AnimalFloat model={randomAnimalModel} />
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {wasAnswerCorrect ? "🎉 Good Job!" : "😅 Oops!"}
                  </h3>
                  <p className="text-gray-600">{currentPuzzle.explanation}</p>

                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNextPuzzle}>
                    {wasAnswerCorrect ? "Next Challenge →" : "Try Again →"}
                  </Button>
                </div>
              </div>
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
