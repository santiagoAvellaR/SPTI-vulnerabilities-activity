import { useState, useEffect } from "react";
import ScoreCounter from "./score-counter/ScoreCounter";
import "./Header.css";
import Timer from "./timer/Timer";

const Header: React.FC = () => {

  const [isRunning, setIsRunning] = useState(true);
  const [player1Score, setPlayer1Score] = useState(20);
  const [player2Score, setPlayer2Score] = useState(75);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [musicOn, setMusicOn] = useState(true);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);

  return (
    <div className="header">
      {/* Scores */}
      <ScoreCounter score={player1Score} playerNumber={1} />
      <ScoreCounter score={player2Score} playerNumber={2} />

      {/* Time */}
      <Timer isRunning={isRunning} setIsRunning={setIsRunning} minutes={minutes} seconds={seconds} />

      {/* Settings buttons */}
      <div className="settings-buttons-container">
        <button type="button" aria-label="Reiniciar">
          <img src="/game-screen/header/settings/retry.webp" alt="Reiniciar" />
        </button>
        <button
          type="button"
          aria-label={isRunning ? "Pausar" : "Renaudar"}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          <img src={isRunning ? "/game-screen/header/settings/pause.webp" : "/game-screen/header/settings/continue.webp"} alt="Pausar/Reanudar" />
        </button>
        <button type="button" aria-label="Musica" onClick={() => setMusicOn((prev) => !prev)}>
          <img src= {musicOn ? "/game-screen/header/settings/music.webp" : "/game-screen/header/settings/no-music.webp"} alt="musica" />
        </button>
        <button type="button" aria-label="Efectos de sonido" onClick={() => setSoundEffectsOn((prev) => !prev)}>
          <img src={soundEffectsOn ? "/game-screen/header/settings/effects.webp" : "/game-screen/header/settings/no-effects.webp"} alt="Efectos de sonido" />
        </button>
      </div>
    </div>
  );
};

export default Header;
