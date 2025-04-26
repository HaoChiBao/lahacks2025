import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Game from "./pages/GameModes/Game.jsx"; // 💬 this is your new Game mode selector
import MultiplayerPage from "./pages/Multiplayer.jsx";
import LeaderboardPage from "./pages/Leaderboard.jsx";
import HowToPlayPage from "./pages/HowToPlay.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
