import { useEffect, useState } from "react";
import { ws } from "~/services/websocket";
import "./Fruit.css";

type FruitProps = {
  id: string;
  subtype: string;
  position: { x: number; y: number };
};

export default function Fruit({ id, subtype, position }: FruitProps) {
  const [fruitPosition, setFruitPosition] = useState(position);

  return (
    <div
      className="fruit"
      style={{
        left: `${fruitPosition.x}px`,
        top: `${fruitPosition.y}px`,
        height: "50px",
        width: "50px",
      }}
    >
      <img src={`/fruits/${subtype}.webp`} alt={`Fruit ${subtype}`} />
    </div>
  );
}
