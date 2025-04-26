import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="bg-background border-b border-gray-800">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Code Difference Spotter</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Spot the Code Differences
                </h2>
                <p className="max-w-[700px] text-gray-400 md:text-xl">
                  Train your debugging skills by spotting differences between incorrect and correct code snippets.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link to="/game">
                    <Button size="lg" className="w-full">
                      Single Player
                    </Button>
                  </Link>
                  <Link to="/multiplayer">
                    <Button size="lg" className="w-full" variant="secondary">
                      Multiplayer
                    </Button>
                  </Link>
                </div>
                <Link to="/how-to-play">
                  <Button variant="outline" size="lg" className="w-full">
                    How to Play
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-700 px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Improve Your Coding Skills</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Our game helps you become a better programmer by training your eye to spot common coding errors.
                </p>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Multiple Languages</CardTitle>
                    <CardDescription>Practice with JavaScript, Python, and more</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Multiplayer Mode</CardTitle>
                    <CardDescription>Compete with friends using room codes</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Leaderboards</CardTitle>
                    <CardDescription>Track your progress and compete globally</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-gray-400 md:text-left">
            © 2024 Code Difference Spotter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
