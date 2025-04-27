import { useState, useEffect, useRef } from "react";
import { CodeBlock } from "./ui/CodeBlock";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { codeSnippets } from "../lib/code-snippets";
import AnimalFloat from "./HerringFloat";
import { useNavigate } from "react-router-dom";


const animalModel = "/animals/Sparrow_LOD_All.glb";

export default function SpotTheDifferenceGame({ mode = "single", playerName = "Player", players = [], onGameEnd }) {
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const nextPuzzleButtonRef = useRef(null); // Ref for the "Next Puzzle" button

  const currentPuzzle = codeSnippets[currentLevel][currentSnippet];
  const totalDifferences = currentPuzzle.differences.length;
  const navigate = useNavigate();


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

  useEffect(() => {
    if (showExplanation && nextPuzzleButtonRef.current) {
      nextPuzzleButtonRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showExplanation]); // Scroll when showExplanation becomes true

  const handleTimeUp = () => {
    if (lives > 1) {
      setLives((prev) => prev - 1);
      setTimeLeft(60);
      setFoundDifferences([]);
    } else {
      endGame();
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
          setShowExplanation(true);
        }
      }
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const handleNextPuzzle = () => {
    if (currentSnippet + 1 >= 3) {
      // Finish the game
      navigate(`/gameover?score=${score}&level=${currentLevel}&mode=single`);
    } else {
      setCurrentSnippet(prev => prev + 1);
      setFoundDifferences([]);
      setShowExplanation(false);
      setTimeLeft(60);
    }
  };
  

  const endGame = () => {
    setGameActive(false);
    if (onGameEnd) {
      onGameEnd({ score, correct: 3, total: 3, level: currentLevel });
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Tabs value={currentLevel} onValueChange={setCurrentLevel}>
          <TabsList className="rounded-lg bg-white shadow-sm">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-3">
          <Badge className="bg-gray-100 text-gray-800">{currentPuzzle.language}</Badge>
          <Badge className="bg-blue-100 text-blue-700">
            {foundDifferences.length} / {totalDifferences} found
          </Badge>
        </div>
      </div>

      <Progress value={(foundDifferences.length / totalDifferences) * 100} className="h-2 bg-gray-200 rounded-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white shadow-md p-6">
          <h3 className="text-gray-800 font-semibold mb-4">Incorrect Code</h3>
          <div className="rounded-lg bg-gray-100 p-4">
            <CodeBlock
              code={currentPuzzle.incorrectCode}
              language={currentPuzzle.language}
              highlightLines={foundDifferences}
              onLineClick={handleLineClick}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-md p-6">
          <h3 className="text-gray-800 font-semibold mb-4">Correct Code</h3>
          <div className="rounded-lg bg-gray-100 p-4">
            <CodeBlock
              code={currentPuzzle.correctCode}
              language={currentPuzzle.language}
              highlightLines={foundDifferences}
              onLineClick={handleLineClick}
            />
          </div>
        </div>
      </div>

      {showExplanation && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white rounded-xl shadow-md p-6">
          <div className="w-full md:w-1/3 flex justify-center">
            <AnimalFloat model={animalModel} />
          </div>

          <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">🎉 Good Job!</h3>
            <p className="text-gray-600">{currentPuzzle.explanation}</p>

            <Button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleNextPuzzle}
                >
                {currentSnippet + 1 >= 3 ? "View Results →" : "Next Puzzle →"}
                </Button>
          </div>
        </div>
      )}
    </div>
  );
}
