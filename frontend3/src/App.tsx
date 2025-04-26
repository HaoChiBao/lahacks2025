import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Game from "./pages/GameModes/Game.jsx"; // 💬 this is your new Game mode selector
import MultiplayerPage from "./pages/Multiplayer.jsx";
import LeaderboardPage from "./pages/Leaderboard.jsx";
import HowToPlayPage from "./pages/HowToPlay.jsx";
import GameOverPage from "./pages/GameOver.jsx";
import WaitingRoomPage from "./pages/Multiplayer/WaitingRoom.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        
        <Route path="/gameover" element={<GameOverPage />} /> {/* ⭐ Added this */}
        <Route path="/multiplayer/room/:code" element={<WaitingRoomPage />} /> {/* ✅ this line */}
        
      </Routes>
    </Router>
  );
}

export default App;
