import { useState } from "react";
import { Button } from "../../components/ui/button";
import SpotDifference from "./SpotDifference";
import FillBlanks from "./FillBlanks";

export default function Game() {
  const [gameMode, setGameMode] = useState(null);

  if (!gameMode) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f9fafb]">
        {/* Header */}
        <header className="bg-background border-b border-gray-200">
          <div className="flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-800">Select Your Game Mode</h1>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="flex flex-wrap justify-center gap-8">
            {/* Spot the Difference */}
            <button
              onClick={() => setGameMode("spot-difference")}
              className="w-64 h-40 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 transition hover:bg-pink-200 hover:text-white hover:scale-105 shadow-md"
            >
              Spot the Difference
            </button>

            {/* Fill in the Blanks */}
            <button
              onClick={() => setGameMode("fill-blanks")}
              className="w-64 h-40 rounded-2xl bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 transition hover:bg-purple-200 hover:text-white hover:scale-105 shadow-md"
            >
              Fill in the Blanks
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (gameMode === "spot-difference") {
    return <SpotDifference />;
  }

  if (gameMode === "fill-blanks") {
    return <FillBlanks />;
  }
}
