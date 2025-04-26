import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-6">
      <header className="w-full flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Code Difference Spotter</h1>
        <Link to="/leaderboard" className="text-white hover:underline">
          Leaderboard
        </Link>
      </header>

      <main className="flex flex-col items-center mt-20 gap-6 text-center">
        <h2 className="text-4xl font-extrabold">Spot the Code Differences</h2>
        <p className="text-gray-400 text-lg max-w-xl">
          Train your debugging skills by spotting differences between incorrect and correct code snippets.
        </p>
        <div className="flex gap-4">
          <Link to="/game">
            <Button className="text-lg px-6 py-3">Single Player</Button>
          </Link>
          <Link to="/multiplayer">
            <Button variant="secondary" className="text-lg px-6 py-3">Multiplayer</Button>
          </Link>
        </div>
        <Link to="/how-to-play">
          <Button variant="ghost" className="mt-4 text-white">
            How to Play
          </Button>
        </Link>
      </main>

      <section className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4">
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
      </section>
    </div>
  );
}
