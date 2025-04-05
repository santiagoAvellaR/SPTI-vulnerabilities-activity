import { useState, useEffect } from "react";
import { ws } from "~/services/websocket";

type TrollProps = {
  id: string;
  subtype: string;
  x: number; 
  y: number;
  orientation: string;
};

export default function Troll({ id, subtype, x, y, orientation }: TrollProps) {
  const [xPosition, setxPosition] = useState(x);
  const [yPosition, setyPosition] = useState(y);

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "element move" && data.id === id) {
          setxPosition(data.xPosition);
          setyPosition(data.yPosition);
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
    <div className="troll" style={{ left: `${x * 40}px`, top: `${y * 40}px` }}>
      <img src={"/assets/enemy-troll.webp"} alt={"Troll Enemy"} />
    </div>
  );
}
