import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Board from "./components/board/Board";
import FruitBar from "./components/fruit-bar/FruitBar";
import type { BoardData, Entity, Position } from "./components/board/types/types";
import { useWebSocket } from "~/hooks/useWebSocket";
import "./styles.css";

export default function GameScreen() {
  //const { data } = useWebSocket("/game");
  // Mockdata para el tablero
  const data = {
    "message": "match-found",
    "match": {
      "id": "bc371685",
      "level": 3,
      "map": "desert",
      "host": "5e1b6281-8762-44d0-adbb-5a3981c6f00d",
      "guest": "5e1b6281-8762-44d0-adbb-5a3981c6f00d"
    },
    "fruits": ["banana", "grape", "watermelon", "orange"],
    "board": {
      "size": { "rows": 16, "cols": 16 },
      "entities": [
        { "type": "player", "id": "host", "position": { "x": 9, "y": 1 } },
        { "type": "player", "id": "guest", "position": { "x": 9, "y": 14 } },
  
        { "type": "enemy", "subtype": "troll", "position": { "x": 2, "y": 4 } },
        { "type": "enemy", "subtype": "goblin", "position": { "x": 2, "y": 12 } },
        { "type": "enemy", "subtype": "slime", "position": { "x": 14, "y": 4 } },
        { "type": "enemy", "subtype": "dragon", "position": { "x": 14, "y": 12 } },
  
        { "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 5 } },
        { "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 6 } },
        { "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 7 } },
        { "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 8 } },
  
        { "type": "ice_block", "subtype": "solid", "position": { "x": 5, "y": 5 } },
        { "type": "ice_block", "subtype": "breakable", "position": { "x": 5, "y": 6 } },
        { "type": "ice_block", "subtype": "thin", "position": { "x": 5, "y": 7 } },
        { "type": "ice_block", "subtype": "solid", "position": { "x": 6, "y": 5 } },
        { "type": "ice_block", "subtype": "breakable", "position": { "x": 6, "y": 6 } },
        { "type": "ice_block", "subtype": "thin", "position": { "x": 6, "y": 7 } }
      ]
    }
  };
    // Header States
    const [isRunning, setIsRunning] = useState(true);
    const [scorePlayer1, setScorePlayer1] = useState(0);
    const [scorePlayer2, setScorePlayer2] = useState(0);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);
    const [musicOn, setMusicOn] = useState(true);
    const [soundEffectsOn, setSoundEffectsOn] = useState(true);

    // FruitBar States
    const [fruits, setFruits] = useState([]);
    const [actualFruit, setActualFruit] = useState(data.fruits[0]);

    // Estado del tablero
    const [boardData, setBoardData] = useState<BoardData>({
        size: { rows: 16, cols: 16 },
        entities: []
    });
    const [hostIsAlive, setHostIsAlive] = useState(true);
    const [guestIsAlive, setGuestIsAlive] = useState(true);

    return (
        <div className="game-screen">
            <Header
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                player1Score={scorePlayer1}
                setPlayer1Score={setScorePlayer1}
                player2Score={scorePlayer2}
                setPlayer2Score={setScorePlayer2}
                minutes={minutes}
                setMinutes={setMinutes}
                seconds={seconds}
                setSeconds={setSeconds}
                musicOn={musicOn}
                setMusicOn={setMusicOn}
                soundEffectsOn={soundEffectsOn}
                setSoundEffectsOn={setSoundEffectsOn}
                />
            <Board 
                boardData={data.board} 
                matchId={data.match.id} 
                hostId={data.match.host} 
                guestId={data.match.guest}
                hostIsAlive={hostIsAlive}
                setHostIsAlive={setHostIsAlive}
                guestIsAlive={guestIsAlive}
                setGuestIsAlive={setGuestIsAlive} 
                />
            <FruitBar
                fruits={data.fruits}
                selectedFruit={actualFruit}
                setSelectedFruit={setActualFruit}
                />
        </div>
    );
}
