import IceCreamCharacter from "../ice-cream-character/IceCreamCharacter";
import "./Board.css";

const Board: React.FC = () => {
  return (
    <div>
      <h1>¡Bienvenido al juego!</h1>
      <div className="ice-cream-container">
        <IceCreamCharacter />
      </div>
    </div>
  );
};

export default Board;
