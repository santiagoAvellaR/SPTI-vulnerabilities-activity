
type ScoreCounterProps = {
  score: number;
  playerNumber: 1 | 2; // Definimos los colores posibles
};

const ScoreCounter: React.FC<ScoreCounterProps> = ({ score, playerNumber }) => {
    const digitRoute = `/game-screen/header/digits/player${playerNumber}-digit-`;

  // Extraemos las decenas y unidades del puntaje
  const tens = Math.floor(score / 10);
  const units = score % 10;

  return (
    <div className="score-counter">
      <img src={`${digitRoute}${tens}.webp`} alt={`Decena ${tens}`} />
      <img src={`${digitRoute}${units}.webp`} alt={`Unidad ${units}`} />
    </div>
  );
};

export default ScoreCounter;
