import { useState } from "react";
import { Button } from "../../components/ui/button";
import SpotTheDifferenceGame from "../../components/SpotTheDifferenceGame"; // ✅ REUSABLE
import FillTheBlankGame from "../../components/FillTheBlankGame";         // ✅ REUSABLE

export default function Game() {
  const [gameMode, setGameMode] = useState<"spot" | "fill" | null>(null);

  if (!gameMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
        Choose Your Game Mode
      </h2>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-md md:max-w-none justify-center items-center">
        <Button
        onClick={() => setGameMode("spot")}
        className="rounded-lg bg-gray-200 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-gray-700 hover:bg-pink-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out w-full max-w-xs"
        >
        Spot the Difference
        </Button>

        <Button
        onClick={() => setGameMode("fill")}
        className="rounded-lg bg-gray-200 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-gray-700 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out w-full max-w-xs"
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
    return <FillTheBlankGame />;
  }

  return null;
}
