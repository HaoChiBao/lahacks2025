import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Trophy } from "lucide-react";

export default function GlobalLeaderboard() {
  interface Player {
    name: string;
    score: number;
    level: string;
  }

  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    // Fetch from localStorage or dummy fallback
    const data = JSON.parse(localStorage.getItem("codeSpotterLeaderboard") || "[]") || [
      { name: "Alex", score: 550, level: "advanced" },
      { name: "Jamie", score: 430, level: "intermediate" },
      { name: "Taylor", score: 390, level: "beginner" },
      { name: "Riley", score: 320, level: "advanced" },
      { name: "Jordan", score: 300, level: "beginner" },
    ];
    setLeaderboard(data);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-[#f9fafb] py-10 px-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white rounded-2xl shadow-lg p-6">
          <CardHeader className="flex flex-col items-center space-y-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Global Leaderboard
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-6 space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500">No scores yet. Play a game to get started!</p>
            ) : (
              <div className="space-y-4">
                {leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-700">{index + 1}.</div>
                        <div className="text-gray-800 font-semibold">{player.name}</div>
                        <div className="text-xs text-gray-500 capitalize">({player.level})</div>
                      </div>
                      <div className="text-blue-500 font-bold text-lg">{player.score} pts</div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>

          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-500">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
