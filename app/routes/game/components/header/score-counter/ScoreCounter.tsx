import "./ScoreCounter.css";

type ScoreCounterProps = {
  score: number;
  playerNumber: 1 | 2;
};

export default function ScoreCounter({ score, playerNumber }: ScoreCounterProps) {
  const digitRoute = `/game-screen/header/digits/player${playerNumber}-digit-`;

  const tens = Math.floor(score / 10);
  const units = score % 10;

  return (
    <div className="score-counter">
      <img src={`/game-screen/header/player${playerNumber}-icon.webp`} alt={`Icon player ${playerNumber}`} />
      <img src={`${digitRoute}${tens}.webp`} alt={`Decena ${tens}`} />
      <img src={`${digitRoute}${units}.webp`} alt={`Unidad ${units}`} />
    </div>
  );
}
