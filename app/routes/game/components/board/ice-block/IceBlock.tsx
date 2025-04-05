import { useEffect, useState } from "react";
import { ws } from "~/services/websocket";
import "./IceBlock.css";

type IceBlockProps = {
  id: string;
  x: number; 
  y: number;
};

export default function IceBlock({ id, x, y }: IceBlockProps) {
  const [xPosition, setxPosition] = useState(x);
  const [yPosition, setyPosition] = useState(y);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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
      className="ice-block"
      style={{
        left: `${x * 40}px`,
        top: `${y * 40}px`,
      }}
    >
      <img src={"/assets/iceblock-.webp"} alt={"Ice Block"} />
    </div>
  );
}
