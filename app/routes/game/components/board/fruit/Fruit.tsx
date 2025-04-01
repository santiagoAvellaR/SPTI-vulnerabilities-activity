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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "element move" && data.id === id) {
          setFruitPosition({ x: data.xPosition, y: data.yPosition });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    if (ws) {
      ws.addEventListener("message", handleMessage);
    }

    return () => {
      if (ws) {
        ws.removeEventListener("message", handleMessage);
      }
    };
  }, [id]);

  return (
    <div
      className="fruit"
      style={{
        left: `${fruitPosition.x * 35}px`,
        top: `${fruitPosition.y * 35}px`,
        height: "50px",
        width: "50px",
      }}
    >
      <img src={`/public/fruits/${subtype}.webp`} alt={`Fruit ${subtype}`} />
    </div>
  );
}
