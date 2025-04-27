import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function ChooseOptionsPage() {
  const [language, setLanguage] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (language && difficulty) {
      navigate(`/game/spot?language=${language}&difficulty=${difficulty}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] p-6">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Set Up Your Challenge</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <Label className="text-gray-700">Choose a Language</Label>
            <Select onValueChange={(value: string) => setLanguage(value)}>
              <SelectTrigger className="bg-gray-100 text-gray-700">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <Label className="text-gray-700">Choose a Difficulty</Label>
            <Select onValueChange={(value: string) => setDifficulty(value)}>
              <SelectTrigger className="bg-gray-100 text-gray-700">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4"
            onClick={handleStartGame}
            disabled={!language || !difficulty}
          >
            Start Game →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
