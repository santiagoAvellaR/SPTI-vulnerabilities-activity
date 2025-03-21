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

  return (
    <div className="header">
      {/* Scores */}
      <div className="players-information-container">
        {/* Player 1 */}
        <img src="/game-screen/header/player1-icon.webp" alt="Icon player 1" />
        <ScoreCounter score={player1Score} playerNumber={1} />

        {/* Player 2 */}
        <img src="/game-screen/header/player2-icon.webp" alt="Icon player 2" />
        <ScoreCounter score={player2Score} playerNumber={2} />
      </div>

      {/* Time */}
      <Timer isRunning={isRunning} setIsRunning={setIsRunning} minutes={minutes} seconds={seconds} />

      {/* Settings buttons */}
      <div className="settings-buttons-container">
        <button type="button" aria-label="Reiniciar">
          <img src="/images/restart.png" alt="Reiniciar" />
        </button>
        <button
          type="button"
          aria-label={isRunning ? "Reanudar" : "Pausar"}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          <img src={isRunning ? "/images/play.png" : "/images/pause.png"} alt="Pausar/Reanudar" />
        </button>
        <button type="button" aria-label="Musica">
          <img src="/images/sound.png" alt="musica" />
        </button>
        <button type="button" aria-label="Efectos de sonido">
          <img src="/images/sound.png" alt="Efectos de sonido" />
        </button>
      </div>
    </div>
  );
};

export default Header;
