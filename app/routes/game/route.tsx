import Header from "../../components/game/header/Header";
import Board from "../../components/game/board/Board";
//import Footer from "../../components/game/footer/Footer";

const GameScreen: React.FC = () => {
  return (
    <div className="game-screen">
      <Header />
      <Board />
    </div>
  );
};

export default GameScreen;