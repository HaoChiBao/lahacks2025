import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import Game from "./pages/GameModes/Game.js"; // 💬 this is your new Game mode selector
import MultiplayerPage from "./pages/Multiplayer.js";
// import LeaderboardPage from "./pages/Leaderboard.js";
import HowToPlayPage from "./pages/HowToPlay.jsx";
import GameOverPage from "./pages/GameOver.js";
import MultiplayerGameOver from "./pages/Multiplayer/multiplayerGameOver.js"; // ⭐ Added this
import WaitingRoomPage from "./pages/Multiplayer/WaitingRoom.js"
// import RoomSpotDifference from "./pages/Multiplayer/RoomSpotDifference"; // ⭐ added Room game page separately
import GlobalLeaderboard from "./pages/GlobalLeaderboard.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/globalleaderboard" element={<GlobalLeaderboard />} />

        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        
        <Route path="/gameover" element={<GameOverPage />} /> {/* ⭐ Added this */}
        <Route path="/multiplayer/gameover" element={<MultiplayerGameOver />} /> {/* ⭐ Added this */}

        <Route path="/multiplayer/room/:code" element={<WaitingRoomPage />} /> {/* ✅ this line */}
        {/* <Route path="/multiplayer/room/:code/spot" element={<RoomSpotDifference />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
