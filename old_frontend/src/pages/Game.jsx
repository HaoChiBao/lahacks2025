import React, { useState } from "react"; // ADD THIS
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";


export default function Game() {
  const [selectedLine, setSelectedLine] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Example correct line (index 2)
  const correctLine = 2;

  const codeLines = [
    "function add(a, b) {",
    "  return a - b;", // ❌ bug: should be +
    "}",
  ];

  const correctCodeLines = [
    "function add(a, b) {",
    "  return a + b;", // ✅ correct
    "}",
  ];

  const handleLineClick = (index) => {
    setSelectedLine(index);
    setIsCorrect(index === correctLine);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Find the Bug</h1>

      <div className="flex gap-10">
        <div>
          <h2 className="text-lg mb-2">Incorrect Code</h2>
          <div className="bg-gray-900 p-4 rounded-lg">
            {codeLines.map((line, index) => (
              <pre 
                key={index}
                onClick={() => handleLineClick(index)}
                className={`cursor-pointer px-2 py-1 rounded-md ${
                  selectedLine === index ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                {line}
              </pre>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-2">Correct Code</h2>
          <div className="bg-gray-900 p-4 rounded-lg">
            {correctCodeLines.map((line, index) => (
              <pre key={index} className="px-2 py-1">
                {line}
              </pre>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isCorrect === true && (
          <div className="text-green-400 font-semibold">
            🎉 Correct! Good job!
            <p className="text-gray-400 text-sm mt-2">
              Explanation: The `add` function should use `+` instead of `-`.
            </p>
          </div>
        )}
        {isCorrect === false && (
          <div className="text-red-400 font-semibold">
            ❌ Try again! Look carefully.
          </div>
        )}
      </div>

      <Button className="mt-10" onClick={() => window.location.reload()}>
        Next Puzzle
      </Button>
    </div>
  );
}
