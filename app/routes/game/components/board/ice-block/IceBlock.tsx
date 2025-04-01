import { useEffect, useState } from "react";
import { ws } from "~/services/websocket";
import "./IceBlock.css";

type IceBlockProps = {
  id: string;
  subtype: string;
  position: { x: number; y: number };
};

export default function IceBlock({ id, subtype, position }: IceBlockProps) {
  const [blockPosition, setBlockPosition] = useState(position);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "element move" && data.id === id) {
          setBlockPosition({ x: data.xPosition, y: data.yPosition });
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
        left: `${blockPosition.x * 40}px`,
        top: `${blockPosition.y * 40}px`,
      }}
    >
      <img src={`/assets/iceblock-${subtype}.webp`} alt={`Ice Block ${subtype}`} />
    </div>
  );
}
