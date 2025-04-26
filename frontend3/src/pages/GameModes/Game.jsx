import { useState } from "react";
import { Button } from "../../components/ui/button";
import SpotTheDifferenceGame from "../../components/SpotTheDifferenceGame"; // ✅ REUSABLE
import FillTheBlankGame from "../../components/FillTheBlankGame";         // ✅ REUSABLE

export default function Game() {
  const [gameMode, setGameMode] = useState(null);

  if (!gameMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800">
        <h2 className="text-4xl font-extrabold mb-8">Choose Your Game Mode</h2>

        <div className="flex gap-6">
          <Button
            onClick={() => setGameMode("spot")}
            className="rounded-lg bg-gray-200 px-10 py-6 text-lg font-semibold text-gray-700 hover:bg-pink-400 hover:text-white transition"
          >
            Spot the Difference
          </Button>

          <Button
            onClick={() => setGameMode("fill")}
            className="rounded-lg bg-gray-200 px-10 py-6 text-lg font-semibold text-gray-700 hover:bg-purple-400 hover:text-white transition"
          >
            Fill in the Blanks
          </Button>
        </div>
      </div>
    );
  }

  // 👇 Based on what user clicked, render the actual game component:
  if (gameMode === "spot") {
    return <SpotTheDifferenceGame mode="single" />;
  }

  if (gameMode === "fill") {
    return <FillTheBlankGame mode="single" />;
  }

  return null;
}
