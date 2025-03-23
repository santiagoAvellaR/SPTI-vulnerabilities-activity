import { useState, useEffect } from "react";
import ScoreCounter from "./score-counter/ScoreCounter";
import "./Header.css";
import Timer from "./timer/Timer";

interface HeaderProps {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  player1Score: number;
  setPlayer1Score: (score: number) => void;
  player2Score: number;
  setPlayer2Score: (score: number) => void;
  minutes: number;
  setMinutes: (minutes: number) => void;
  seconds: number;
  setSeconds: (seconds: number) => void;
  musicOn: boolean;
  setMusicOn: (musicOn: boolean) => void;
  soundEffectsOn: boolean;
  setSoundEffectsOn: (soundEffectsOn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({isRunning, setIsRunning, player1Score, setPlayer1Score, player2Score, setPlayer2Score, 
  minutes, setMinutes, seconds, setSeconds, musicOn, setMusicOn, soundEffectsOn, setSoundEffectsOn
}) => {

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
          onClick={() => setIsRunning(!isRunning)}
        >
          <img src={isRunning ? "/game-screen/header/settings/pause.webp" : "/game-screen/header/settings/continue.webp"} alt="Pausar/Reanudar" />
        </button>
        <button type="button" aria-label="Musica" onClick={() => setMusicOn(!musicOn)}>
          <img src= {musicOn ? "/game-screen/header/settings/music.webp" : "/game-screen/header/settings/no-music.webp"} alt="musica" />
        </button>
        <button type="button" aria-label="Efectos de sonido" onClick={() => setSoundEffectsOn(!soundEffectsOn)}>
          <img src={soundEffectsOn ? "/game-screen/header/settings/effects.webp" : "/game-screen/header/settings/no-effects.webp"} alt="Efectos de sonido" />
        </button>
      </div>
    </div>
  );
};

export default Header;
