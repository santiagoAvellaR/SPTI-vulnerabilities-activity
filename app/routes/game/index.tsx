import { useState, useEffect, lazy, Suspense } from "react";
import LoadingScreen from "~/components/loadingScreen/LoadingScreen";
import type { BoardCell} from "./components/board/types/types";
import "./styles.css";
import { useUser } from "~/userContext";
import { createWebSocketConnection, sendMessage, ws } from "~/services/websocket";

const Header = lazy(() => import("./components/header/Header"));
const Board = lazy(() => import("./components/board/Board"));
const FruitBar = lazy(() => import("./components/fruit-bar/FruitBar"));

export default function GameScreen() {
  // Informacion del jugador
  const { userData, secondaryUserData, setSecondaryUserData } = useUser();

  useEffect(() => {
    // Conectar al WebSocket al cargar la pantalla del juego
    console.log("Conectando al WebSocket para recibir info del mapa...", ws);
    createWebSocketConnection(`/ws/game/${userData?.userId}/${userData?.matchId}`);
    console.log("Conectado al WebSocket para recibir info del mapa:", ws);

    if (ws) {
      ws.onmessage = (event) => {
        try {
          const messageRecieved = JSON.parse(event.data);
          console.log("Esperando info de mapa... Mensaje recibido del WebSocket:", messageRecieved);

          // Verificar si el mensaje contiene datos del 
          if (messageRecieved.match && messageRecieved.message === "match-found") {
            console.log("Datos del juego recibidos:", messageRecieved.match);
            setGameData(messageRecieved);
            setActualFruit(messageRecieved.match.board.fruitType)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  }, [userData?.userId, userData?.matchId]);
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
      board : {
        host: string | null;
        guest: string | null;
        fruitType: string;
        fruitsType: string[];
        enemies: number;
        enemiesCoordinates: number[][];
        fruitsCoordinates: number[][];
        fruits: number;
        playersStartCoordinates: number[][];
        board: BoardCell[];
      }
    };
    
} | null>(null);

  // Mockdata para el tablero
  // setGameData ({
  //   "message": "match-found",
  //   "match": {
  //     "id": "fc93742b",
  //     "level": 1,
  //     "map": "match-1",
  //     "host": "88b26ba7-ae82-4765-a080-157429683d92",
  //     "guest": "d1ba4175-97d6-4b76-b065-c6af7e3255fb",
  //     "board": {
  //       "host": null,
  //       "guest": null,
  //       "fruitType": "banana",
  //       "fruitsType": [
  //         "banana",
  //         "grape"
  //       ],
  //       "enemies": 4,
  //       "enemiesCoordinates": [
  //         [2, 4],
  //         [2, 12],
  //         [14, 4],
  //         [14, 12]
  //       ],
  //       "fruitsCoordinates": [
  //         [4, 5],
  //         [4, 6],
  //         [4, 7],
  //         [4, 8],
  //         [4, 9],
  //         [4, 10],
  //         [4, 11],
  //         [11, 5],
  //         [11, 6],
  //         [11, 7],
  //         [11, 8],
  //         [11, 9],
  //         [11, 10],
  //         [11, 11]
  //       ],
  //       "fruits": 14,
  //       "playersStartCoordinates": [
  //         [9, 1],
  //         [9, 14]
  //       ],
  //       "board": [
  //         {
  //           "x": 2,
  //           "y": 4,
  //           "item": null,
  //           "character": {
  //             "type": "troll",
  //             "orientation": "down",
  //             "id": "4b375c1c-8986-4a67-837e-926300bbac2d"
  //           }
  //         },
  //         {
  //           "x": 2,
  //           "y": 12,
  //           "item": null,
  //           "character": {
  //             "type": "troll",
  //             "orientation": "down",
  //             "id": "b8b5f880-7fa6-4220-9b70-b1a245f57827"
  //           }
  //         },
  //         {
  //           "x": 4,
  //           "y": 5,
  //           "item": {
  //             "type": "fruit",
  //             "id": "e004d80a-b167-4ae9-b38e-a1573fc65090"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 6,
  //           "item": {
  //             "type": "fruit",
  //             "id": "7cfe0de1-c709-42ed-a7d7-fa2673825d44"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 7,
  //           "item": {
  //             "type": "fruit",
  //             "id": "eb112536-8a3b-4d3a-8528-1d723d7d42e7"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 8,
  //           "item": {
  //             "type": "fruit",
  //             "id": "34e2d577-bfcb-4b1b-a4c0-f1c958848675"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 9,
  //           "item": {
  //             "type": "fruit",
  //             "id": "54119a06-6641-40f1-9f4b-5a1363e90266"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 10,
  //           "item": {
  //             "type": "fruit",
  //             "id": "c9cc5627-5d01-4839-a895-0f05e1f3763a"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 4,
  //           "y": 11,
  //           "item": {
  //             "type": "fruit",
  //             "id": "0f5f476e-f669-4fba-8376-4597d6cf4c2b"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 5,
  //           "item": {
  //             "type": "fruit",
  //             "id": "1711073b-d527-437a-b633-c1405ceb0adf"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 6,
  //           "item": {
  //             "type": "fruit",
  //             "id": "c528a7f2-f680-4a4e-94ed-9638505f8918"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 7,
  //           "item": {
  //             "type": "fruit",
  //             "id": "13cc9945-d413-443a-bb60-3565e383a080"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 8,
  //           "item": {
  //             "type": "fruit",
  //             "id": "720157b4-2ae0-457b-ae7a-0a8fbe4fb5e5"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 9,
  //           "item": {
  //             "type": "fruit",
  //             "id": "dafb770f-c69a-4cac-8dc9-0e1e0e0435c8"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 10,
  //           "item": {
  //             "type": "fruit",
  //             "id": "d81b7db0-436f-4534-aef3-9fcad67655cf"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 11,
  //           "y": 11,
  //           "item": {
  //             "type": "fruit",
  //             "id": "f77b5cbb-1bea-4038-8247-96ea0b53969c"
  //           },
  //           "character": null
  //         },
  //         {
  //           "x": 14,
  //           "y": 4,
  //           "item": null,
  //           "character": {
  //             "type": "troll",
  //             "orientation": "down",
  //             "id": "ae64e9ca-9074-4362-90be-282b85ba97ac"
  //           }
  //         },
  //         {
  //           "x": 14,
  //           "y": 12,
  //           "item": null,
  //           "character": {
  //             "type": "troll",
  //             "orientation": "down",
  //             "id": "e53d4570-c3ab-4a82-b4f3-55aafaedfcee"
  //           }
  //         },
  //         {
  //           "x": 15,
  //           "y": 15,
  //           "item": null,
  //           "character": {
  //             "type": "troll",
  //             "orientation": "down",
  //             "id": "e53d4570-c3ab-4a82-b4f3-55aafaedfcee"
  //           }
  //         }
  //       ]
  //     }
  //   }
  // });
  // Header States
  const [isRunning, setIsRunning] = useState(true);
  const [fruitsCounter, setFruitsCounter] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const [musicOn, setMusicOn] = useState(true);
  const [soundEffectsOn, setSoundEffectsOn] = useState(true);

  // FruitBar States
  const [fruits, setFruits] = useState<string[]>([]);
  const [actualFruit, setActualFruit] = useState();

  // Estado del tablero
  const [boardData, setBoardData] = useState<BoardCell[]>([]);
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
        setGameData(gameData);
        setFruits(gameData?.match.board.fruitsType || []);
        setBoardData(gameData?.match.board.board || []);

        // Verificar si podemos finalizar la carga
        checkLoadingCompletion();
      } catch (error) {
        console.error("Error al cargar recursos del juego:", error);
        // Si hay error, cargar datos básicos de todos modos
        setGameData(gameData);
        setFruits(gameData?.match.board.fruitsType || []);
        setBoardData(gameData?.match.board.board  || []);

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
  if (isLoading || !gameData) {
    return (
      <LoadingScreen
        message={loadingMessage}
        boardData={gameData?.match.board.board || []}
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
          fruitsCounter={fruitsCounter}
          minutes={minutes}
          seconds={seconds}
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          soundEffectsOn={soundEffectsOn}
          setSoundEffectsOn={setSoundEffectsOn}
        />
        <Board
          boardData={gameData.match.board.board}
          matchId={gameData.match.id}
          hostId={gameData.match.host}
          guestId={gameData.match.guest}
          hostIsAlive={hostIsAlive}
          setHostIsAlive={setHostIsAlive}
          guestIsAlive={guestIsAlive}
          setGuestIsAlive={setGuestIsAlive}
          actualFruit={actualFruit}
          setActualFruit={setActualFruit}
          setFruitsCounter={setFruitsCounter}
        />
        <FruitBar
          fruits={gameData.match.board.fruitsType}
          selectedFruit={actualFruit}
          setSelectedFruit={setActualFruit}
        />
      </Suspense>
    </div>
  );
}