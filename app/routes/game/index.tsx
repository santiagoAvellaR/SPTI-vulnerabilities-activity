import Header from "~/components/game/header/Header";
import Board from "~/components/game/board/Board";
import FruitBar from "~/components/game/footer/fruit-bar/FruitBar";
import "./styles.css";

import { useState } from "react";

const GameScreen: React.FC = () => {
  // Header
  const [isRunning, setIsRunning] = useState(true);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [musicOn, setMusicOn] = useState(true);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);
  // FruitBar
  const fruits = ['bananas', 'grapes', 'watermelon', 'orange'];
  const [actualFruit, setActualFruit] = useState(fruits[0]);


  return (
    <div className="game-screen">
      <Header
      isRunning={isRunning} setIsRunning={setIsRunning} player1Score={scorePlayer1} setPlayer1Score={setScorePlayer1} 
      player2Score={scorePlayer2} setPlayer2Score={setScorePlayer2} minutes={minutes} setMinutes={setMinutes} seconds={seconds}
      setSeconds={setSeconds} musicOn={musicOn} setMusicOn={setMusicOn} soundEffectsOn={soundEffectsOn} setSoundEffectsOn={setSoundEffectsOn}
      />
      <Board />
      <FruitBar 
      fruits={fruits} selectedFruit={actualFruit} 
      />
    </div>
  );
};

export default GameScreen;