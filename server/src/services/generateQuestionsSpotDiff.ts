import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface GeneratedSnippet {
  incorrectCode: string;
  correctCode: string;
  explanation: string;
  language: string;
  differences: number[]; // line numbers where code differs
}

const generateCodeSnippets = async (
  language: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  amount: number
): Promise<GeneratedSnippet[]> => {
  const prompt = `
You are helping create a "Spot the Difference" coding game.

Generate a **pure JSON array** of **${amount}** code puzzles.

Each puzzle object must be structured like this:
{
  incorrectCode: "<multi-line code with subtle mistakes>",
  correctCode: "<multi-line corrected version>",
  explanation: "Short explanation of the main mistakes corrected",
  language: "${language}",
  differences: [list of line numbers where the code differs]
}

DO NOT include any extra text, titles, \`\`\` markers, or explanations. ONLY a JSON array.

RULES:
- Write code in **${language}**.
- Difficulty: **${difficulty}**.

- Incorrect code must be realistic: typos, wrong syntax, missing semicolons, off-by-one errors, bad naming, etc.
- Correct code must fully fix the mistakes.
- Line numbers in "differences" start at 1.
- No placeholders or unfinished code — fully runnable code snippets.

DIFFICULTY-SPECIFIC RULES:
${difficulty === "Beginner" ? `
- Simple mistakes like missing brackets, wrong operators, wrong loop bounds, or small typos.
- Code examples 5–10 lines long.
` : difficulty === "Intermediate" ? `
- More logical errors: wrong variable use, incorrect function calls, bad class structure, missing error handling.
- Code examples 10–20 lines long.
` : `
- Complex errors: async/await misuse, recursion mistakes, bad state management, race conditions.
- Code examples 20–30 lines long.
`}
  `.trim();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate code snippets: ${response.statusText}`);
  }

  const data = await response.json();
  let text: string = data.candidates[0]?.content?.parts[0]?.text || "";

  // 🧹 Clean up if wrapped in triple backticks
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/```[\w]*\n?/, ""); 
    text = text.replace(/```$/, "");
  }

  try {
    const parsed: GeneratedSnippet[] = JSON.parse(text);
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse generated code snippets JSON: ${error}`);
  }
};

export { generateCodeSnippets, GeneratedSnippet };
