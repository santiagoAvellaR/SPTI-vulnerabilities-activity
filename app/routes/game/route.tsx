import Header from "../../components/game/header/Header";
import Board from "../../components/game/board/Board";
import FruitBar from "~/components/game/footer/fruit-bar/FruitBar";
import { useState } from "react";

const GameScreen: React.FC = () => {
  const fruits = ['banana', 'grape', 'apple'];
  const [score, setScore] = useState(0);
  const [actualFruit, setActualFruit] = useState('banana');

  return (
    <div className="game-screen">
      <Header />
      <Board />
      <FruitBar fruits={fruits} actualFruit={actualFruit}/>
    </div>
  );
};

export default GameScreen;