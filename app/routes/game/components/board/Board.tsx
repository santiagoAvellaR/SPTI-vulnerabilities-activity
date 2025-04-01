import IceCream from "./ice-cream/IceCream";
import Enemy from "./enemy/Enemy";
import Fruit from "./fruit/Fruit";
import IceBlock from "./ice-block/IceBlock";
import "./Board.css";
import type { BoardData } from "./types/types";
import { useWebSocket } from "~/hooks/useWebSocket";

type BoardProps = {
    boardData: BoardData;
    matchId: string;
    hostId: string;
    guestId: string;
    hostIsAlive: boolean;
    setHostIsAlive: (isAlive: boolean) => void;
    guestIsAlive: boolean;
    setGuestIsAlive: (isAlive: boolean) => void;
};

export default function Board({ boardData, matchId, hostId, guestId, hostIsAlive, setHostIsAlive, guestIsAlive, setGuestIsAlive }: BoardProps) {
  return (
    <div className="board">
      {boardData.entities.map((entity) => {
        switch (entity.type) {
          case "player":
            return entity.id ? (
              <IceCream 
                key={entity.id} 
                playerId={entity.id === "host" ? hostId : guestId} 
                matchId={matchId} 
                position={entity.position} 
              />
            ) : null;
          case "enemy":
            return entity.id ? (
              <Enemy 
                id={entity.id}
                key={entity.id} 
                subtype={entity.subtype ?? "troll"} 
                position={entity.position} 
              />
            ) : null;
          case "fruit":
            return entity.id ? (
              <Fruit 
                id={entity.id}
                key={entity.id} 
                subtype={entity.subtype ?? "apple"} 
                position={entity.position} 
              />
            ) : null;
          case "ice_block":
            return entity.id ? (
              <IceBlock
                id={entity.id} 
                key={entity.id} 
                subtype={entity.subtype ?? "thin"} 
                position={entity.position} 
              />
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
