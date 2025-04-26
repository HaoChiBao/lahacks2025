import { useState } from "react";
import { Button } from "../../components/ui/button";
import SpotDifference from "./SpotDifference";
import FillBlanks from "./FillBlanks";

export default function Game() {
  const [gameMode, setGameMode] = useState(null);

  if (!gameMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
        <h2 className="text-4xl font-extrabold mb-8">Choose Your Game Mode</h2>
        <div className="flex flex-col gap-6">
          <Button
            size="lg"
            className="text-lg px-10 py-6 transition hover:shadow-lg hover:shadow-blue-500/50"
            onClick={() => setGameMode("spot-difference")}
          >
            Spot the Difference
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-10 py-6 transition hover:shadow-lg hover:shadow-purple-500/50"
            onClick={() => setGameMode("fill-blanks")}
          >
            Fill in the Blanks
          </Button>
        </div>
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
