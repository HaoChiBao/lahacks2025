// import { useState, ChangeEvent } from "react";
// import { Button } from "../../components/ui/button";
// import SpotTheDifferenceGame from "../../components/SpotTheDifferenceGame";
// // import FillTheBlankGame from "../../components/FillTheBlankGame";

// type GameMode = "spot" | "fill" | null;
// type Screen = "mode-selection" | "settings-selection" | "game";

// export default function Game() {
//   const [gameMode, setGameMode] = useState<GameMode>(null);
//   const [language, setLanguage] = useState<string>("");
//   const [difficulty, setDifficulty] = useState<string>("");
//   const [screen, setScreen] = useState<Screen>("mode-selection");

//   const handleStartGame = () => {
//     setScreen("game");
//   };

//   const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setLanguage(e.target.value);
//   };

//   const handleDifficultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setDifficulty(e.target.value);
//   };

//   if (screen === "mode-selection") {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 px-4">
//         <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
//           Choose Your Game Mode
//         </h2>

//         <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-md md:max-w-none justify-center items-center">
//           <Button
//             onClick={() => { setGameMode("spot"); setScreen("settings-selection"); }}
//             className="rounded-lg bg-gray-200 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-gray-700 hover:bg-pink-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out w-full max-w-xs"
//           >
//             Spot the Difference
//           </Button>

//           <Button
//             onClick={() => { setGameMode("fill"); setScreen("settings-selection"); }}
//             className="rounded-lg bg-gray-200 px-6 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold text-gray-700 hover:bg-purple-400 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out w-full max-w-xs"
//           >
//             Fill in the Blanks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (screen === "settings-selection") {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] text-gray-800 px-4">
//         <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
//           Choose Language & Difficulty
//         </h2>

//         <div className="flex flex-col gap-6 w-full max-w-sm">
//           {/* Language Select */}
//           <select
//             value={language}
//             onChange={handleLanguageChange}
//             className="rounded-lg border-gray-300 text-gray-700 py-3 px-4 bg-white shadow-md"
//           >
//             <option value="">Select Language</option>
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="java">Java</option>
//           </select>

//           {/* Difficulty Select */}
//           <select
//             value={difficulty}
//             onChange={handleDifficultyChange}
//             className="rounded-lg border-gray-300 text-gray-700 py-3 px-4 bg-white shadow-md"
//           >
//             <option value="">Select Difficulty</option>
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>

//           {/* Start Button */}
//           <Button
//             onClick={handleStartGame}
//             disabled={!language || !difficulty}
//             className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 shadow-md transition-all duration-300 ease-out"
//           >
//             Start Game
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (screen === "game") {
//     if (gameMode === "spot") {
//       return <SpotTheDifferenceGame mode="single" selectedLanguage={language} selectedDifficulty={difficulty} />;
//     }

//     if (gameMode === "fill") {
//       // return <FillTheBlankGame mode="single" selectedLanguage={language} selectedDifficulty={difficulty} />;
//     }
//   }

//   return null;
// }
