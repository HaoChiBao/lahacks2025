import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import SpotTheDifferenceGame from "../../components/SpotTheDifferenceGame"; // ✅ REUSABLE
import FillTheBlankGame from "../../components/FillTheBlankGame";         // ✅ REUSABLE

const questions = [
  {
      code: `
<option: 1> countUp(limit: number) {
  let i = 0;
  while (<option: 2>) {
      <option: 3> i;
      i++;
  }
}

const <option: 4> = countUp(3);

console.log(iterator.<option: 5>().<option: 6>); // Output: 0
console.log(iterator.next().value); // Output: 1
console.log(iterator.next().value); // Output: 2
console.log(iterator.next().done);  // Output: true
`,
      options: ["function*", "i < limit", "yield", "iterator", "next", "value"],
      description:
          "Creates a generator function 'countUp' that yields numbers sequentially from 0 up to (but not including) a specified limit.",
  },
  {
      code: `
interface Configuration {
  apiUrl: string;
  timeout: number;
  retries: number;
  featureFlags: { [key: string]: boolean };
}

// Create a type where all properties of T are optional
<option: 1> MakeOptional<<option: 2>> = {
  [P in <option: 3> SourceType]<option: 4>: SourceType[P];
};

// Usage: PartialConfig can have some, all, or none of Configuration's properties
const partialSettings: <option: 5><Configuration> = {
  timeout: 5000
};

function applyConfiguration(config: MakeOptional<<option: 6>>) {
  console.log("Applying config:", config);
}

applyConfiguration(partialSettings);
`,
      options: ["type", "SourceType", "keyof", "?", "MakeOptional", "Configuration"],
      description:
          "Defines a generic mapped type 'MakeOptional' that takes an interface 'SourceType' and creates a new type where all properties are optional.",
  },
];


export default function Game() {
  const [gameMode, setGameMode] = useState<"spot" | "fill" | null>(null);

  const [gameScore, setGameScore] = useState(0); // State to hold the game score

  const [completed, setCompleted] = useState(false); // State to track if the game is completed

  const [questionsAnswered, setQuestionsAnswered] = useState(0); // State to track the number of questions answered

  useEffect(() => {
    console.log("Questions answered:", questionsAnswered); // Log the number of questions answered
  }, [questionsAnswered]); // Effect to handle side effects when questionsAnswered changes

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
  }

  return null;
}
