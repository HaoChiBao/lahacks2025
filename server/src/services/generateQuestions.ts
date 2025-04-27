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
You are helping me build a "Duolingo for coding" app.

Please generate ONLY a **valid JSON array** of exactly **${amount}** coding questions. 

Each element must be an object structured like this:
{
  code: "<multiline code with <option: 1> placeholders>",
  options: [ "option1", "option2", ... ],
  description: "Short explanation of what the code is supposed to do"
}

DO NOT add any introductory text, explanations, titles, or markdown formatting like \`\`\`json.
ONLY return a pure JSON array, nothing else.

RULES:
- Code in: **${language}**.
- Difficulty: **${difficulty}**.
- Placeholders must be <option: 1>, <option: 2>, etc.
- Options must match placeholders exactly.
- No empty or duplicate options.
- Clean, realistic, valid code.

DIFFICULTY-SPECIFIC RULES:
${difficulty === "Beginner" ? `
- 3 placeholders.
- Topics: basic variables, simple functions, loops, arrays.
` : difficulty === "Intermediate" ? `
- 4–6 placeholders.
- Topics: array/list methods, object manipulation, classes, error handling.
` : `
- 6–8 placeholders.
- Topics: async/await, recursion, higher-order functions, advanced language patterns.
`}
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
