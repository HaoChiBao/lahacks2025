import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Trophy, Home, RotateCcw, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import confetti from "canvas-confetti";

export default function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const score = parseInt(searchParams.get("score") || "0", 10);
  const level = searchParams.get("level") || "beginner";
  const mode = searchParams.get("mode") || "single";
  const correctAnswers = parseInt(searchParams.get("correct") || "0", 10);
  const totalQuestions = parseInt(searchParams.get("total") || "0", 10);

  // Save to leaderboard
  useEffect(() => {
    if (score > 0) {
      const leaderboardData = JSON.parse(localStorage.getItem("codeSpotterLeaderboard") || "[]");
      leaderboardData.push({
        name: localStorage.getItem("playerName") || "Player",
        score,
        level,
        date: new Date().toISOString(),
      });

      leaderboardData.sort((a, b) => b.score - a.score);
      localStorage.setItem("codeSpotterLeaderboard", JSON.stringify(leaderboardData.slice(0, 10)));
    }
  }, [score, level]);

  // Trigger confetti on high score
  useEffect(() => {
    if (showConfetti && score > 100) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showConfetti, score]);

  const handlePlayAgain = () => {
    if (mode === "multi") {
      navigate("/multiplayer");
    } else {
      navigate("/game");
    }
  };

  const getPerformanceMessage = () => {
    if (score > 500) return "Outstanding! You have a keen eye for code details!";
    if (score > 300) return "Great job! Your debugging skills are impressive!";
    if (score > 100) return "Good work! Keep practicing to improve your skills!";
    return "Nice try! With more practice, you'll spot differences faster!";
  };

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Game Over!</CardTitle>
          <CardDescription>Here's how you did</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold">{score}</div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center rounded-lg border p-3">
              <div className="text-xl font-semibold">{correctAnswers}</div>
              <p className="text-xs text-muted-foreground">Questions Correct</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-3">
              <div className="text-xl font-semibold">{accuracy}%</div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">{getPerformanceMessage()}</p>
          </div>

          <div className="flex justify-center">
            <Badge variant="outline" className="capitalize">
              {level} level
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="grid w-full grid-cols-2 gap-2">
            <Button onClick={handlePlayAgain} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(`I scored ${score} points in Code Difference Spotter!`);
              alert("Score copied to clipboard!");
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Score
          </Button>

          <div className="mt-2 text-center">
            <Link to="/leaderboard" className="text-sm text-muted-foreground hover:underline">
              View Global Leaderboard
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
