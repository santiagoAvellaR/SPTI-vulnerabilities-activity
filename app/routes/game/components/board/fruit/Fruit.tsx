import "./Fruit.css";

type FruitProps = {
  subtype: string;
  position: { x: number; y: number };
};

export default function Fruit({ subtype, position }: FruitProps) {
    return (
    <div className="fruit" style={{ left: `${position.x * 35}px`, top: `${position.y * 35}px`, height: "50px", width: "50px" }}>
        <img src={`/public/fruits/${subtype}.webp`} alt={`Fruit ${subtype}`} />
    </div>
    );
}
