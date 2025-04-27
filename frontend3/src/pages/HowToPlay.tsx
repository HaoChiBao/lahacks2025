import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function HowToPlayPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">How to Play</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 md:py-24 lg:py-32">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-4">
                How to Play Code Difference Spotter
              </h2>
              <p className="text-muted-foreground">
                Code Difference Spotter is a game designed to improve your debugging skills by challenging you to find
                differences between incorrect and correct code snippets.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Game Rules</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>You'll be presented with two code snippets side by side.</li>
                <li>One snippet contains errors, bugs, or inefficiencies, while the other is the correct version.</li>
                <li>Click on the lines or sections where you spot differences.</li>
                <li>The faster you identify all differences, the higher your score.</li>
                <li>You have a limited time for each challenge.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Difficulty Levels</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Beginner:</strong> Simple syntax errors and obvious bugs.
                </li>
                <li>
                  <strong>Intermediate:</strong> Logical errors and inefficient code patterns.
                </li>
                <li>
                  <strong>Advanced:</strong> Subtle bugs, security vulnerabilities, and complex logical issues.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Tips for Success</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Pay attention to variable names, operators, and punctuation.</li>
                <li>Look for missing or extra code lines.</li>
                <li>Check for incorrect indentation or code structure.</li>
                <li>Watch for logical errors in conditions and loops.</li>
                <li>Consider edge cases that might cause bugs.</li>
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <Link to="/game">
                <Button size="lg">Start Playing</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
