import { useState, useEffect } from "react";
import { ws } from "~/services/websocket";

type EnemyProps = {
  id: string;
  subtype: string;
  position: { x: number; y: number };
};

export default function Enemy({ id, subtype, position }: EnemyProps) {
  const [enemyPosition, setEnemyPosition] = useState(position);

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "element move" && data.id === id) {
          setEnemyPosition({ x: data.xPosition, y: data.yPosition });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    if (ws) {
      ws.addEventListener("message", messageListener);
    }

    return () => {
      if (ws) {
        ws.removeEventListener("message", messageListener);
      }
    };
  }, [id]);

  return (
    <div className="enemy" style={{ left: `${enemyPosition.x * 40}px`, top: `${enemyPosition.y * 40}px` }}>
      <img src={`/assets/enemy-${subtype}.webp`} alt={`Enemy ${subtype}`} />
    </div>
  );
}
