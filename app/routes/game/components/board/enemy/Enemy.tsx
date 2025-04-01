import "./Enemy.css";

type EnemyProps = {
  subtype: string;
  position: { x: number; y: number };
};

export default function Enemy({ subtype, position }: EnemyProps) {
  return (
    <div className="enemy" style={{ left: `${position.x * 40}px`, top: `${position.y * 40}px` }}>
      <img src={`/assets/enemy-${subtype}.webp`} alt={`Enemy ${subtype}`} />
    </div>
  );
}
