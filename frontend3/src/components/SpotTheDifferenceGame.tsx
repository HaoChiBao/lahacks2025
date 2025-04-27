import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CodeBlock } from "./ui/CodeBlock";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { codeSnippets } from "../lib/code-snippets";
import AnimalFloat from "./HerringFloat";

const animalModel = "/animals/Sparrow_LOD_All.glb";

interface SpotTheDifferenceGameProps {
  mode?: "single" | "multi";
  playerName?: string;
  players?: string[];
  selectedLanguage: string;
  selectedDifficulty: string;
  onGameEnd?: (result: { score: number; correct: number; total: number; level: string }) => void;
}

export default function SpotTheDifferenceGame({
  mode = "single",
  playerName = "Player",
  players = [],
  selectedLanguage,
  selectedDifficulty,
  onGameEnd
}: SpotTheDifferenceGameProps) {
  const navigate = useNavigate();

  // ✅ You forgot to add this line!
  const matchingSnippets = codeSnippets[selectedDifficulty]?.filter(
    snippet => snippet.language.toLowerCase() === selectedLanguage.toLowerCase()
  ) || [];

  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const nextPuzzleButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentPuzzle = matchingSnippets[currentSnippet];
  const totalQuestions = matchingSnippets.length;
  const totalDifferences = currentPuzzle?.differences.length || 0;

  useEffect(() => {
    if (!gameActive) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
  }, [showExplanation]);

  const handleTimeUp = () => {
    setGameActive(false);
    navigateToGameOver();
  };

  const handleLineClick = (lineNumber: number) => {
    if (!gameActive || showExplanation) return;
    if (currentPuzzle?.differences.includes(lineNumber)) {
      if (!foundDifferences.includes(lineNumber)) {
        setFoundDifferences(prev => [...prev, lineNumber]);
        const points = Math.round(10 * (timeLeft / 60));
        setScore(prev => prev + points);

        if (foundDifferences.length + 1 === totalDifferences) {
          setShowExplanation(true);
        }
      }
    } else {
      // Wrong choice: immediately move to explanation
      setShowExplanation(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentSnippet + 1 >= totalQuestions) {
      navigateToGameOver();
    } else {
      setCurrentSnippet(prev => prev + 1);
      setFoundDifferences([]);
      setShowExplanation(false);
      setTimeLeft(60);
    }
  };
  

  const navigateToGameOver = () => {
    const correctAnswers = currentSnippet + (showExplanation ? 1 : 0);  // Fix: count if currently in explanation stage
    navigate(`/gameover`, {
      state: {
        score,
        level: selectedDifficulty,
        mode,
        correct: correctAnswers,
        total: totalQuestions,
      },
    });
  };

  if (!currentPuzzle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold">No Questions Available!</h2>
        <p>Please choose another language or difficulty.</p>
        <Button onClick={() => navigate("/game")}>
          Back to Game Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Progress Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <Badge>{selectedLanguage}</Badge>
          <Badge variant="outline" className="capitalize">{selectedDifficulty}</Badge>
          <Badge>{foundDifferences.length} / {totalDifferences} Bugs Found</Badge>
        </div>

        <div className="text-gray-600">
          ⏳ {timeLeft}s
        </div>
      </div>

      <Progress value={(foundDifferences.length / totalDifferences) * 100} />

      {/* Code Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-700">Incorrect Code</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <CodeBlock
              code={currentPuzzle.incorrectCode}
              language={currentPuzzle.language}
              highlightLines={foundDifferences}
              onLineClick={handleLineClick}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-700">Correct Code</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <CodeBlock
              code={currentPuzzle.correctCode}
              language={currentPuzzle.language}
              highlightLines={foundDifferences}
              onLineClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Animal and Explanation */}
      {showExplanation && (
        <div className="flex flex-col md:flex-row items-center bg-white shadow rounded-lg p-8 mt-8 space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex justify-center w-full md:w-1/3">
            <AnimalFloat model={animalModel} />
          </div>

          <div className="w-full md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Explanation</h3>
            <p className="text-gray-600 mb-4">{currentPuzzle.explanation}</p>
            <Button ref={nextPuzzleButtonRef} onClick={handleNextPuzzle} className="bg-blue-500 hover:bg-blue-600 text-white">
              {currentSnippet + 1 >= totalQuestions ? "View Results →" : "Next Puzzle →"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
