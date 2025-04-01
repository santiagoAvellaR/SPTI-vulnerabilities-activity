import { useEffect, useRef, useState } from "react";
import {ws, sendMessage} from "~/services/websocket";
import "./IceCream.css";

type IceCreamProps = {
  playerId: string;
  matchId: string;
  position: { x: number; y: number };
};

export default function IceCream({ playerId, matchId, position }: IceCreamProps) {
  const [direction, setDirection] = useState("down");
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

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
  }, [direction, sendMessage]);

  return (
    <div className="IceCream" style={{ left: `${position.x * 40}px`, top: `${position.y * 40}px` }}>
      <img src={`/assets/player-${playerId}.webp`} alt={`Player ${playerId}`} />
    </div>
  );
}
