import { useEffect, useState } from "react";
import { ws } from "~/services/websocket";
import "./Fruit.css";

type FruitProps = {
  id: string;
  subtype: string;
  x: number; 
  y: number;
};

export default function Fruit({ id, subtype, x, y }: FruitProps) {
  const [xPosition, setxPosition] = useState(x);
  const [yPosition, setyPosition] = useState(y);

  return (
    <div
      className="fruit"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        height: "50px",
        width: "50px",
      }}
    >
      <img src={`/fruits/${subtype}.webp`} alt={`Fruit ${subtype}`} />
    </div>
  );
}
