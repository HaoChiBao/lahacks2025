import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import AnimalBounce from "../components/AnimalBounce";


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      {/* Header */}
      <header className="bg-background border-b border-gray-200">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">BrainBug</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative overflow-hidden">
  {/* Animals floating in the background */}
  <AnimalBounce />

  <section className="relative w-full py-12 md:py-24 lg:py-32">
    <div className="px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-800">
            Spot the Code Differences
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Train your debugging skills by spotting differences between incorrect and correct code snippets.
          </p>
        </div>

        {/* Main buttons */}
        <div className="flex gap-6">
          <Link
            to="/game"
            className="rounded-lg bg-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 transition hover:bg-blue-500 hover:text-white"
          >
            Single Player
          </Link>
          <Link
            to="/multiplayer"
            className="rounded-lg bg-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 transition hover:bg-blue-500 hover:text-white"
          >
            Multiplayer
          </Link>
        </div>

        {/* How to Play */}
        <div className="w-full max-w-xs">
          <Link to="/how-to-play">
            <Button
              variant="outline"
              size="lg"
              className="w-full mt-4 bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white border-0"
            >
              How to Play
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>


        {/* Features Section (fixed to match theme) */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f9fafb]">
          <div className="px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-700">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-800">
                  Improve Your Coding Skills
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Our games help you spot bugs faster, strengthen your eye for details, and become a better coder.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Multiple Languages</CardTitle>
                    <CardDescription>Practice spotting bugs in JavaScript, Python, and more.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Multiplayer Mode</CardTitle>
                    <CardDescription>Challenge friends and race to spot differences!</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Leaderboards</CardTitle>
                    <CardDescription>Track your rank and climb to the top globally.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-gray-400 md:text-left">
            © 2024 BrainBug. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
