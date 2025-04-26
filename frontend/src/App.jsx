import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Game from "./pages/Game";
import Multiplayer from "./pages/Multiplayer";
import Leaderboard from "./pages/Leaderboard";
import HowToPlay from "./pages/HowToPlay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
      </Routes>
    </Router>
  );
}

export default App;
