import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import AnimalFloat from "./HerringFloat";
import { useNavigate } from "react-router-dom";

const animalModel = "/animals/Sparrow_LOD_All.glb";

interface Question {
  code: string;
  options: string[];
  description: string;
}

interface FillTheBlankGameProps {
  questions: Question[];
  score: number;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setQuestionsAnswered: React.Dispatch<React.SetStateAction<number>>;
}

export default function FillTheBlankGame({
  questions,
  score,
  setScore,
  setCompleted,
  setQuestionsAnswered,
}: FillTheBlankGameProps) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [usedOptionIndexes, setUsedOptionIndexes] = useState<number[]>([]);
  const nextQuestionRef = useRef<HTMLButtonElement>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { option: string; optionIndex: number }>>({});


  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setUsedOptionIndexes([]);
    }
  }, [currentQuestionIndex]);

  const pruneExtraAnswers = (selected: Record<string, { option: string; optionIndex: number }>, availablePlaceholderCount: number) => {
    const pruned: Record<string, { option: string; optionIndex: number }> = {};
  
    Object.entries(selected).forEach(([key, value]) => {
      const placeholderNumber = parseInt(key);
      if (placeholderNumber <= availablePlaceholderCount) {
        pruned[key] = value;
      }
    });
  
    return pruned;
  };
  
  
  const handleOptionSelect = (option: string, optionIndex: number) => {
    if (isSubmitted) return;
  
    const availablePlaceholders = currentQuestion.code.match(/<option: \d+>/g) || [];
  
    // Check if the option is already used
    const usedPlaceholder = Object.entries(selectedAnswers).find(
      ([_, value]) => value.optionIndex === optionIndex
    );
  
    if (usedPlaceholder) {
      // Deselect
      const placeholderKey = usedPlaceholder[0];
      setSelectedAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[placeholderKey];
        return newAnswers;
      });
      setUsedOptionIndexes((prev) => prev.filter((idx) => idx !== optionIndex));
    } else {
      // Find next empty placeholder
      const filledPlaceholders = Object.keys(selectedAnswers);
      const nextPlaceholder = availablePlaceholders
        .map(ph => ph.match(/\d+/)?.[0])
        .find(number => !filledPlaceholders.includes(number!));
  
      if (!nextPlaceholder) return;
  
      setSelectedAnswers((prev) => ({
        ...prev,
        [nextPlaceholder]: { option, optionIndex }
      }));
      setUsedOptionIndexes((prev) => [...prev, optionIndex]);
    }
  };
  
  
  
  const handleSubmit = () => {
    setIsSubmitted(true);
  
    const availablePlaceholders = currentQuestion.code.match(/<option: \d+>/g) || [];
    const placeholderCount = availablePlaceholders.length;
  
    // Prune extra answers
    setSelectedAnswers((prev) => pruneExtraAnswers(prev, placeholderCount));
  
    const correct = Object.keys(selectedAnswers).filter(
      (key) => selectedAnswers[key].option === currentQuestion.options[Number(key) - 1]
    ).length;
  
    // const total = placeholderCount; // <-- score is based on number of placeholders!
  
    setScore((prevScore) => prevScore + correct * 10);
    setQuestionsAnswered((prev) => prev + 1);
  
    setTimeout(() => {
      nextQuestionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };
  
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      navigate("/gameover");
    }
  };

  const renderCodeWithBlanks = () => {
    return currentQuestion.code.split("\n").map((line, index) => {
      const placeholders = line.match(/<option: \d+>/g) || [];
      let processedLine = line;
  
      placeholders.forEach((placeholder) => {
        const placeholderNumber = placeholder.match(/\d+/)?.[0] || "";
        const selected = selectedAnswers[placeholderNumber];
        const selectedOption = selected ? selected.option : "";
        const correctOption = currentQuestion.options[Number(placeholderNumber) - 1];
  
        let className = "text-blue-500 border rounded px-1";
        if (isSubmitted) {
          if (selectedOption === correctOption) {
            className = "bg-green-200 text-green-800 border-green-500 rounded px-1";
          } else {
            className = "bg-red-200 text-red-800 border-red-500 rounded px-1";
          }
        }
  
        processedLine = processedLine.replace(
          placeholder,
          `<span class="${className}">${selectedOption || "_____"}</span>`
        );
      });
  
      return (
        <div
          key={index}
          className="font-mono text-sm text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });
  };
  

  const renderResults = () => {
    if (!isSubmitted) return null;

    const total = currentQuestion.options.length;
    const correct = Object.keys(selectedAnswers).filter(
      (key) => selectedAnswers[key].option === currentQuestion.options[Number(key) - 1]
    ).length;
    const incorrect = total - correct;
    const percentage = (correct / total) * 100;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white rounded-xl shadow-md p-6">
        <div className="w-full md:w-1/3 flex justify-center">
          <AnimalFloat model={animalModel} />
        </div>

        <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
          <h3
            className={`text-2xl font-bold ${
              percentage === 100
                ? "text-green-800"
                : percentage >= 50
                ? "text-yellow-800"
                : "text-red-800"
            }`}
          >
            🎉 Results
          </h3>
          <p
            className={`text-lg ${
              percentage === 100
                ? "text-green-800"
                : percentage >= 50
                ? "text-yellow-800"
                : "text-red-800"
            }`}
          >
            <span className="font-bold">Correct:</span> {correct} / {total} ({percentage.toFixed(1)}%)
          </p>
          <p
            className={`text-lg ${
              percentage === 100
                ? "text-green-800"
                : percentage >= 50
                ? "text-yellow-800"
                : "text-red-800"
            }`}
          >
            <span className="font-bold">Incorrect:</span> {incorrect}
          </p>
          <p className="text-gray-600">{currentQuestion.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-700">Fill in the Blank Game</h1>
        <Badge className="bg-gray-200 text-gray-700">Programming</Badge>
      </div>

      <div className="flex justify-center items-center my-4">
        <Badge className="bg-green-100 text-green-800 text-lg">
          Score: {score}
        </Badge>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-gray-700 font-semibold text-lg">Code Snippet</h3>

        <div className="rounded-xl bg-gray-100 p-4 text-gray-800 overflow-auto">
          {renderCodeWithBlanks()}
        </div>

        <div className="flex justify-center items-center my-4">
          <Badge className="bg-blue-100 text-blue-800">
            Question {currentQuestionIndex + 1} / {questions.length}
          </Badge>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-gray-700 font-semibold text-lg">Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {shuffledOptions.map((option, index) => (
            <Button
                key={index}
                className={`${
                usedOptionIndexes.includes(index)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleOptionSelect(option, index)}
                disabled={isSubmitted}
            >
                {option}
            </Button>
            ))}

        </div>
      </Card>

      <Button
        className="w-full bg-blue-500 text-white py-2"
        onClick={handleSubmit}
        disabled={isSubmitted}
      >
        {isSubmitted ? "Submitted" : "Submit"}
      </Button>

      {renderResults()}

      {isSubmitted && (
        <Button
          ref={nextQuestionRef}
          className={`w-full py-2 ${
            currentQuestionIndex < questions.length - 1
              ? "bg-green-500 text-white"
              : "bg-red-300 text-red-800"
          }`}
          onClick={
            currentQuestionIndex < questions.length - 1
              ? handleNextQuestion
              : () => setCompleted(true)
          }
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Exit Now"}
        </Button>
      )}
    </div>
  );
}
