import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "../../components/ui/button";
import SpotTheDifferenceGame from "../../components/SpotTheDifferenceGame";
import FillTheBlankGame from "../../components/FillTheBlankGame";

import {fillSnippets} from "../../lib/fill-in-codes"

export default function Game() {
  const [gameMode, setGameMode] = useState<"spot" | "fill" | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [screen, setScreen] = useState<"mode-selection" | "settings-selection" | "game">("mode-selection");

  const [gameScore, setGameScore] = useState(0); // State to hold the game score

  const [completed, setCompleted] = useState(false); // State to track if the game is completed

  const questions = fillSnippets.intermediate // State to hold the questions for the game

  const [questionsAnswered, setQuestionsAnswered] = useState(0); // State to track the number of questions answered

  useEffect(() => {
    console.log("Questions answered:", questionsAnswered); // Log the number of questions answered
  }, [questionsAnswered]); // Effect to handle side effects when questionsAnswered changes

  const handleStartGame = () => {
    setScreen("game");
  };
  
  if (screen === "mode-selection") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Choose Your Game Mode
        </h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-md justify-center items-center">
          <Button
            onClick={() => { setGameMode("spot"); setScreen("settings-selection"); }}
            className="rounded-lg bg-gray-200 px-6 py-4 text-base font-semibold text-gray-700 hover:bg-pink-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 w-full max-w-xs"
          >
            Spot the Difference
          </Button>

          <Button
            onClick={() => { setGameMode("fill"); setScreen("settings-selection"); }}
            className="rounded-lg bg-gray-200 px-6 py-4 text-base font-semibold text-gray-700 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 w-full max-w-xs"
          >
            Fill in the Blanks
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "settings-selection") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Choose Language & Difficulty
        </h2>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
            className="rounded-lg border-gray-300 text-gray-700 py-3 px-4 bg-white shadow-md"
          >
            <option value="">Select Language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={difficulty}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
            className="rounded-lg border-gray-300 text-gray-700 py-3 px-4 bg-white shadow-md"
          >
            <option value="">Select Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Start Button */}
          <Button
            onClick={handleStartGame}
            disabled={!language || !difficulty}
            className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 shadow-md transition-all duration-300"
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameMode === "fill" && !completed) {
    return <FillTheBlankGame score={gameScore} setScore={setGameScore} setCompleted={setCompleted} questions={questions} setQuestionsAnswered = {setQuestionsAnswered} />;
  } else if (gameMode === "fill" && completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] text-gray-800 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
          Game Over! Your Score: {gameScore}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => {
              setGameMode(null); // Reset game mode to null to show the selection screen again
              setGameScore(0); // Reset score for the next game
              setCompleted(false); // Reset completed state for the next game
            }}
            className="rounded-lg bg-blue-500 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-white hover:bg-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
          >
            Play Again
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/"; // Redirect to home page
            }}
            className="rounded-lg bg-gray-200 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-gray-700 hover:bg-gray-300 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  } else if (screen === "game") {
    if (gameMode === "spot") {
      return (
        <SpotTheDifferenceGame
          mode="single"
          selectedLanguage={language}
          selectedDifficulty={difficulty}
        />
      );
    }
  }
  return null;
}
