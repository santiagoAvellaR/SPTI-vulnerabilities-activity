import { useState, useEffect, lazy, Suspense } from "react";
import LoadingScreen from "~/components/loadingScreen/LoadingScreen";
import type { BoardData, Entity, Position } from "./components/board/types/types";
import { useWebSocket } from "~/hooks/useWebSocket";
import "./styles.css";

const Header = lazy(() => import("./components/header/Header"));
const Board = lazy(() => import("./components/board/Board"));
const FruitBar = lazy(() => import("./components/fruit-bar/FruitBar"));

export default function GameScreen() {
  // Estados de carga
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Preparando el campo de juego...");
  const [assetProgress, setAssetProgress] = useState(0);
  const [componentProgress, setComponentProgress] = useState(0);

  // Estado de datos del juego
  const [gameData, setGameData] = useState<{
    message: string;
    match: {
      id: string;
      level: number;
      map: string;
      host: string;
      guest: string;
    };
    fruits: string[];
    board: {
      size: { rows: number; cols: number };
      entities: Array<{
        type: string;
        id?: string;
        position: { x: number; y: number };
        subtype?: string;
      }>;
    };
  } | null>(null);

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
            // { "id": "host", "type": "player", "position": { "x": 9, "y": 1 } },
            // { "id": "guest", "type": "player", "position": { "x": 9, "y": 14 } },

            //{ "id": "enemy-001", "type": "enemy", "subtype": "troll", "position": { "x": 2, "y": 4 } },
            //{ "id": "enemy-002", "type": "enemy", "subtype": "goblin", "position": { "x": 2, "y": 12 } },
            //{ "id": "enemy-003", "type": "enemy", "subtype": "slime", "position": { "x": 14, "y": 4 } },
            //{ "id": "enemy-004", "type": "enemy", "subtype": "dragon", "position": { "x": 14, "y": 12 } },

            { "id": "fruit-001", "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 5 } },
            { "id": "fruit-002", "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 6 } },
            { "id": "fruit-003", "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 7 } },
            { "id": "fruit-004", "type": "fruit", "subtype": "banana", "position": { "x": 4, "y": 8 } }

            // { "id": "ice-001", "type": "ice_block", "subtype": "solid", "position": { "x": 5, "y": 5 } },
            // { "id": "ice-002", "type": "ice_block", "subtype": "breakable", "position": { "x": 5, "y": 6 } },
            // { "id": "ice-003", "type": "ice_block", "subtype": "thin", "position": { "x": 5, "y": 7 } },
            // { "id": "ice-004", "type": "ice_block", "subtype": "solid", "position": { "x": 6, "y": 5 } },
            // { "id": "ice-005", "type": "ice_block", "subtype": "breakable", "position": { "x": 6, "y": 6 } },
            // { "id": "ice-006", "type": "ice_block", "subtype": "thin", "position": { "x": 6, "y": 7 } }
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
  const [fruits, setFruits] = useState<string[]>([]);
  const [actualFruit, setActualFruit] = useState(data.fruits[0]);

  // Estado del tablero
  const [boardData, setBoardData] = useState<BoardData>({
    size: { rows: 16, cols: 16 },
    entities: []
  });
  const [hostIsAlive, setHostIsAlive] = useState(true);
  const [guestIsAlive, setGuestIsAlive] = useState(true);

  // Función para precargar imágenes con seguimiento de progreso
  const preloadImages = (imageList) => {
    return new Promise((resolve, reject) => {
      const totalImages = imageList.length;

      if (totalImages === 0) {
        setAssetProgress(100);
        resolve(true);
        return;
      }

      let loadedImages = 0;

      imageList.forEach((src) => {
        const img = new Image();

        img.onload = () => {
          loadedImages++;
          // Actualizar el progreso después de cada imagen cargada
          const progress = Math.round((loadedImages / totalImages) * 100);
          setAssetProgress(progress);

          if (loadedImages === totalImages) {
            resolve(true);
          }
        };

        img.onerror = () => {
          loadedImages++;
          // Actualizar el progreso aun cuando hay error
          const progress = Math.round((loadedImages / totalImages) * 100);
          setAssetProgress(progress);

          console.error(`Error cargando imagen: ${src}`);
          if (loadedImages === totalImages) {
            // No rechazamos la promesa para evitar que se interrumpa la carga
            resolve(false);
          }
        };

        img.src = src;
      });
    });
  };

  // Efecto para precargar componentes React
  useEffect(() => {
    const preloadComponents = async () => {
      try {
        // Empezamos en 10% para mostrar progreso inicial
        setComponentProgress(10);

        // Cargamos el Header (más ligero)
        await import("./components/header/Header");
        setComponentProgress(30);

        // Cargamos el Board (componente más pesado)
        // await import("./components/board/Board");
        // setComponentProgress(70);

        // Cargamos el FruitBar
        await import("./components/fruit-bar/FruitBar");
        setComponentProgress(100);

        setComponentsLoaded(true);
        console.log("Componentes precargados correctamente.");
      } catch (error) {
        console.error("Error al precargar componentes:", error);
        setComponentsLoaded(true);
        setComponentProgress(100); // En caso de error, marcamos como completado
      }
    };

    preloadComponents();
  }, []);

  // Efecto para precargar recursos del juego
  useEffect(() => {
    // Mostrar diferentes mensajes durante la carga
    const messages = [
      "Preparando el campo de juego...",
      "Cargando personajes...",
      "Configurando enemigos...",
      "¡Casi listo!"
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 800);

    // Precargar imágenes del juego
    const gamePaths = [
      // Personajes
      "/vainilla.png", "/chocolate.png", "/amarillo.png",
      "/azulito.png", "/fresa.png", "/verde.png",

      // // Enemigos
      // "/enemy-troll.png", "/enemy-goblin.png",
      // "/enemy-slime.png", "/enemy-dragon.png",

      // Frutas
      "/fruits/banana.webp", "/fruits/grape.webp",
      "/fruits/watermelon.webp", "/fruits/orange.webp",

      // // Bloques
      // "/ice-block-solid.png", "/ice-block-breakable.png", "/ice-block-thin.png"
    ];

    // Carga de recursos con seguimiento de progreso
    const loadGameResources = async () => {
      try {
        // Precargar imágenes con seguimiento de progreso
        await preloadImages(gamePaths);

        // Establecer los datos del juego
        setGameData(data);
        setFruits(data.fruits);
        setBoardData(data.board);

        // Verificar si podemos finalizar la carga
        checkLoadingCompletion();
      } catch (error) {
        console.error("Error al cargar recursos del juego:", error);
        // Si hay error, cargar datos básicos de todos modos
        setGameData(data);
        setFruits(data.fruits);
        setBoardData(data.board);

        // Forzar finalización después de un tiempo
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    loadGameResources();

    return () => clearInterval(messageInterval);
  }, []);

  // Efecto para verificar cuándo se han cargado tanto los componentes como los recursos
  useEffect(() => {
    checkLoadingCompletion();
  }, [componentsLoaded, assetProgress]);

  // Función para verificar si se completó la carga
  const checkLoadingCompletion = () => {
    if (componentsLoaded && assetProgress >= 95) {
      // Añadir un pequeño retraso para una transición más suave
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Renderizar pantalla de carga mientras se cargan los recursos
  if (isLoading) {
    return (
      <LoadingScreen
        message={loadingMessage}
        boardData={data}
        componentProgress={componentProgress}
        progress={assetProgress}
      />
    );
  }

  // Solo renderizar el juego cuando la carga esté completa
  return (
    <div className="game-screen">
      <Suspense fallback={<LoadingScreen message="Cargando componentes..." progress={100} />}>
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
      </Suspense>
    </div>
  );
}