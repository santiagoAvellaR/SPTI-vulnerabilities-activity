import { useEffect, useRef, useState } from "react";
import { ws, sendMessage } from "~/services/websocket";
import "./IceCream.css";

type IceCreamProps = {
  playerId: string;
  matchId: string;
  x: number; 
  y: number;
  orientation: string;
};

export default function IceCream({ playerId, matchId, x, y }: IceCreamProps) {
  const [direction, setDirection] = useState("down");
  const [xPosition, setxPosition] = useState(x);
  const [yPosition, setyPosition] = useState(y);  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Escuchar mensajes del WebSocket
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message === "element move" && data.id === playerId) {
          setxPosition(data.xPosition);
          setyPosition(data.yPosition);        }
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
  }, [playerId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return; // Evita múltiples activaciones inmediatas

      let newDirection: string | null = null;
      switch (event.key) {
        case "ArrowUp":
          newDirection = "up";
          break;
        case "ArrowDown":
          newDirection = "down";
          break;
        case "ArrowLeft":
          newDirection = "left";
          break;
        case "ArrowRight":
          newDirection = "right";
          break;
        default:
          return;
      }

      // Si la dirección cambió, actualizarla
      if (newDirection !== direction) {
        sendMessage({ type: "player_set_direction", direction: newDirection });
        setDirection(newDirection);
      }

      // Esperar 500ms para enviar el primer mensaje
      holdTimeout.current = setTimeout(() => {
        sendMessage({ type: "player_move", direction: newDirection });

        // Después del primer mensaje, iniciar el envío repetitivo cada 200ms
        moveInterval.current = setInterval(() => {
          sendMessage({ type: "player_move", direction: newDirection });
        }, 200);
      }, 500);
    };

    const handleKeyUp = () => {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
        moveInterval.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [direction]);

  return (
    <div className="IceCream" style={{ left: `${x * 40}px`, top: `${y * 40}px` }}>
      <img src={`/assets/player-${playerId}.webp`} alt={`Player ${playerId}`} />
    </div>
  );
}
