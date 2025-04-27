import dotenv from "dotenv";

import { GameModes, Difficulty, Language } from "../types/socket";

dotenv.config();
// const MODEL = "gemini-2.5-pro-exp-03-25";
const MODEL = "gemini-2.0-flash	";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface GeneratedQuestion {
  code: string;
  options: string[];
  description: string;
}

const generateFillInTheBlank = async (
  language: string,
  difficulty: Difficulty,
  amount: number
): Promise<GeneratedQuestion[]> => {
  const prompt = `
You are creating content for a "Duolingo for coding" app that helps learners master programming through fill-in-the-blank exercises.

Generate ONLY a **valid JSON array** of exactly ${amount} coding questions in ${language} at ${difficulty} difficulty level.

Each question must follow this precise structure:
{
  "code": "<multiline code with labeled option placeholders>",
  "options": ["option1", "option2", "..."],
  "description": "Concise, informative explanation (25-40 words)"
}

FORMATTING REQUIREMENTS:
- Return ONLY the raw JSON array without ANY introductory text, explanations, or code blocks
- Ensure the JSON is perfectly valid and can be parsed directly
- Make sure code is properly indented and readable
- Include line breaks in multiline code sections

CODE REQUIREMENTS:
- Create realistic, practical code examples that demonstrate actual programming patterns
- Ensure all code would be valid and functional when correct options are inserted
- Include descriptive variable/function names that hint at their purpose
- Maintain consistent coding style within each example

PLACEHOLDER REQUIREMENTS:
- Format all placeholders EXACTLY as <option: x> where x is the sequential number (1, 2, 3, etc.)
- Ensure placeholders appear in numerical order (1, 2, 3...) throughout the code
- Place placeholders at syntactically critical points that test understanding
- Never use any other format besides <option: x> for placeholders

OPTION REQUIREMENTS:
- Provide options in the exact order they appear in the code
- Keep ALL options SHORT (1-3 words or symbols when possible, maximum 5 words)
- Include exactly one correct option for each placeholder
- For distractors, use plausible alternatives that represent common mistakes
- Ensure no duplicate or empty options
- Make options challenging but fair based on the difficulty level

DESCRIPTION REQUIREMENTS:
- Write a clear, concise paragraph (25-40 words) explaining what the code accomplishes
- Focus on the purpose and functionality rather than how it works
- Include key technical terms relevant to the concept being tested
- Make descriptions informative enough to guide learners without giving away answers

DIFFICULTY-SPECIFIC REQUIREMENTS:
${difficulty === "Beginner" ? `
- Include exactly 3-4 placeholders
- Focus on: variables, data types, basic operators, simple functions, conditionals, loops, array basics
- Keep code snippets short (5-12 lines)
- Test fundamental syntax and programming concepts
- Use simple, straightforward logic without nested structures
` : difficulty === "Intermediate" ? `
- Include exactly 4-6 placeholders
- Focus on: array/object methods, error handling, classes, modules, callbacks, promises, DOM manipulation
- Code snippets should be 8-20 lines
- Test application of concepts in practical scenarios
- Include at least one question involving debugging common errors
` : `
- Include exactly 6-8 placeholders
- Focus on: async/await, closures, recursion, higher-order functions, design patterns, optimization
- Code snippets can be longer (15-30 lines)
- Test deep understanding of advanced language features
- Include complex problem-solving scenarios and edge cases
- Create questions that require understanding multiple interacting concepts
`}

LANGUAGE-SPECIFIC CONSIDERATIONS:
${language === "JavaScript" ? `
- Include modern ES6+ syntax and features
- Test understanding of JavaScript's unique behaviors (hoisting, prototypes, etc.)
- Include at least one question on asynchronous programming appropriate to difficulty level
` : language === "Python" ? `
- Follow PEP 8 style guidelines
- Include Pythonic idioms and patterns
- Focus on Python's unique features like list comprehensions, generators, decorators
` : language === "Java" ? `
- Include proper class structures and type declarations
- Test understanding of OOP principles
- Include appropriate exception handling
` : `
- Follow standard best practices for ${language}
- Include language-specific idioms and patterns
`}

QUESTION TYPES TO INCLUDE:
- Function/method implementation
- Algorithm logic
- Data structure manipulation
- Control flow
- Error handling
- Language-specific features

EXAMPLE FORMAT:
[
  {
    "code": "function <option: 1>(array) {\n  return array.<option: 2>((item) => item * 2);\n}",
    "options": ["doubleAll", "map", "filter", "forEach"],
    "description": "Creates a function that doubles each element in an array using the appropriate array method."
  }
]

Generate diverse, educational examples that cover different aspects of ${language} programming at ${difficulty} level.
`.trim();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate questions: ${response.statusText}`);
  }

  const data = await response.json();
  let text: string = data.candidates[0].content.parts[0].text;

  // 🧹 Clean out any ```json ``` or ``` blocks
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/```[\w]*\n?/, ""); // remove opening ```json (or just ```)
    text = text.replace(/```$/, "");         // remove closing ```
  }

  try {
    const parsed: GeneratedQuestion[] = JSON.parse(text);
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse generated questions JSON: ${error}`);
  }
};

export { generateFillInTheBlank, GeneratedQuestion };
