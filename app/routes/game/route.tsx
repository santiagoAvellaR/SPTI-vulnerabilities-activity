import Header from "../../components/game/header/Header";
import Board from "../../components/game/board/Board";
import FruitBar from "~/components/game/footer/fruit-bar/FruitBar";
import { useState } from "react";

const GameScreen: React.FC = () => {
  const fruits = ['bananas', 'grapes', 'watermelon', 'orange'];
  const [score, setScore] = useState(0);
  const [actualFruit, setActualFruit] = useState(fruits[0]);

  return (
    <div className="game-screen">
      <Header />
      <Board />
      <FruitBar fruits={fruits} selectedFruit={actualFruit}/>
    </div>
  );
};

export default GameScreen;