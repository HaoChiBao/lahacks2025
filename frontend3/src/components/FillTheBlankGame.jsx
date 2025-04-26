import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

const sampleQuestions = [
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

export default function FillTheBlankGame() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const nextQuestionRef = useRef(null);

    const currentQuestion = sampleQuestions[currentQuestionIndex];

    useEffect(() => {
        const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
        setShuffledOptions(shuffled);
        setSelectedAnswers({});
        setIsSubmitted(false);
    }, [currentQuestionIndex]);

    const handleOptionSelect = (placeholder, option) => {
        setSelectedAnswers((prev) => {
            const existingPlaceholder = Object.keys(prev).find(
                (key) => prev[key] === option
            );

            if (existingPlaceholder) {
                const { [existingPlaceholder]: _, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [placeholder]: option };
            }
        });
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            nextQuestionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const renderCodeWithBlanks = () => {
        return currentQuestion.code.split("\n").map((line, index) => {
            const placeholders = line.match(/<option: \d+>/g) || [];
            let processedLine = line;

            placeholders.forEach((placeholder) => {
                const placeholderNumber = placeholder.match(/\d+/)[0];
                const selectedOption = selectedAnswers[placeholderNumber] || "";
                const correctOption = currentQuestion.options[placeholderNumber - 1];

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
            (key) =>
                selectedAnswers[key] === currentQuestion.options[key - 1]
        ).length;
        const incorrect = total - correct;
        const percentage = (correct / total) * 100;
        let resultColor = "text-gray-800"; // Default color
        if (percentage === 100) {
            resultColor = "text-green-800";
        } else if (percentage >= 50) {
            resultColor = "text-yellow-800";
        } else {
            resultColor = "text-red-800";
        }

        return (
            <Card className="p-6 space-y-4">
            <h3 className={`font-semibold text-2xl ${resultColor}`}>Results</h3>
            <div className="space-y-4">
                <p className={`text-lg ${resultColor}`}>
                <span className="font-bold">Correct:</span> {correct} / {total} ({percentage.toFixed(1)}%)
                </p>
                <p className={`text-lg ${resultColor}`}>
                <span className="font-bold">Incorrect:</span> {incorrect}
                </p>
            </div>
            <p className="text-gray-600 text-base bg-gray-100 p-4 rounded-lg">
                {currentQuestion.description}
            </p>
            </Card>
        );
    };

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-700">Fill in the Blank Game</h1>
                <Badge className="bg-gray-200 text-gray-700">Programming</Badge>
            </div>

            <Card className="p-6 space-y-4">
                <h3 className="text-gray-700 font-semibold text-lg">Code Snippet</h3>
                <div className="rounded-xl bg-gray-100 p-4 text-gray-800 overflow-auto">
                    {renderCodeWithBlanks()}
                </div>
            </Card>

            <Card className="p-6 space-y-4">
                <h3 className="text-gray-700 font-semibold text-lg">Options</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shuffledOptions.map((option, index) => (
                        <Button
                            key={index}
                            className={`${
                                Object.values(selectedAnswers).includes(option)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() =>
                                handleOptionSelect(
                                    Object.keys(selectedAnswers).length + 1,
                                    option
                                )
                            }
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

            {isSubmitted && currentQuestionIndex < sampleQuestions.length - 1 && (
                <Button
                    ref={nextQuestionRef}
                    className="w-full bg-green-500 text-white py-2"
                    onClick={handleNextQuestion}
                >
                    Next Question
                </Button>
            )}
        </div>
    );
}