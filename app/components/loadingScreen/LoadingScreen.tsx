import { useState, useEffect } from "react";
import "./styles.css";

type LoadingScreenProps = {
    message?: string;
    progress?: number;
    onComplete?: () => void;
    boardData?: any;
    componentProgress?: number; // Progreso de carga de los componentes (0-100)
};

export default function LoadingScreen({
    message = "Cargando juego...",
    progress = 0,
    onComplete,
    boardData,
    componentProgress = 0
}: LoadingScreenProps) {
    const [assetProgress, setAssetProgress] = useState(0);
    const [totalProgress, setTotalProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(message);
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    // Calcular progreso total combinando progreso de assets y componentes
    useEffect(() => {
        // Ponderamos 60% para assets y 40% para componentes
        const combined = (assetProgress * 0.6) + (componentProgress * 0.4);
        setTotalProgress(Math.round(combined));

        // Actualizar mensaje basado en el progreso
        if (totalProgress < 25) {
            setCurrentMessage("Preparando el campo de juego...");
        } else if (totalProgress < 50) {
            setCurrentMessage("Cargando personajes y enemigos...");
        } else if (totalProgress < 75) {
            setCurrentMessage("Organizando frutas y bloques...");
        } else if (totalProgress < 95) {
            setCurrentMessage("Inicializando controles...");
        } else {
            setCurrentMessage("¡Todo listo! Preparando para comenzar...");
        }
    }, [assetProgress, componentProgress]);

    // Precargar las imágenes basadas en datos del tablero
    useEffect(() => {
        // Si no hay datos del tablero, no podemos precargar imágenes específicas
        if (!boardData) return;

        const assetsThatNeedLoading = [
            // Jugadores
            "/vainilla.png",
            "/chocolate.png",
            "/amarillo.png",
            "/azulito.png",
            "/fresa.png",
            "/verde.png",

            // // Enemigos
            // "/enemy-troll.png",
            // "/enemy-goblin.png",
            // "/enemy-slime.png",
            // "/enemy-dragon.png",

            // // Frutas
            // "/fruit-banana.png",
            // "/fruit-grape.png",
            // "/fruit-watermelon.png",
            // "/fruit-orange.png",

            // // Bloques
            // "/block-solid.png",
            // "/block-breakable.png",
            // "/block-thin.png",

            // // UI
            // "/ui-clock.png",
            // "/ui-score.png",
            // "/ui-music-on.png",
            // "/ui-music-off.png",
            // "/ui-sound-on.png",
            // "/ui-sound-off.png"
        ];

        // Personalizar la lista de imágenes según los datos del tablero
        // if (boardData && boardData.board && boardData.board.entities) {
        //     // Mapear entidades del tablero a posibles imágenes específicas
        //     boardData.board.entities.forEach(entity => {
        //         if (entity.type === "fruit" && entity.subtype) {

        //         }
        //     });
        // }

        let loadedCount = 0;
        const totalAssets = assetsThatNeedLoading.length;

        // Función para actualizar el progreso
        const updateProgress = () => {
            loadedCount++;
            const newProgress = Math.min(Math.floor((loadedCount / totalAssets) * 100), 100);
            setAssetProgress(newProgress);

            if (loadedCount === totalAssets) {
                setAssetsLoaded(true);

                // Solo completamos si el componente no especificó su propio callback
                if (onComplete && totalProgress >= 95) {
                    setTimeout(() => onComplete(), 500);
                }
            }
        };

        // Precargar imágenes
        assetsThatNeedLoading.forEach(src => {
            const img = new Image();
            img.onload = updateProgress;
            img.onerror = updateProgress; // Contar también los errores para no bloquear la carga
            img.src = src;
        });

        // Si no hay imágenes para cargar o fallan todas, asegurar que el juego empiece
        const failsafe = setTimeout(() => {
            if (!assetsLoaded && onComplete) {
                console.log("Failsafe activado: algunas imágenes no se cargaron correctamente");
                setAssetsLoaded(true);
                onComplete();
            }
        }, 8000); // 8 segundos máximo de espera

        return () => clearTimeout(failsafe);
    }, [boardData, onComplete]);

    // Efecto para aplicar el progreso externo
    useEffect(() => {
        if (progress > 0) {
            setAssetProgress(progress);
        }
    }, [progress]);

    // Renderizar el componente de carga
    return (
        <div className="loading-screen">
            <div className="loading-container">
                <h1 className="loading-title">Ice Cream Battle</h1>

                <div className="loading-animation">
                    <div className="ice-cream-loader"></div>
                </div>

                <p className="loading-message">{currentMessage}</p>

                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${totalProgress}%` }}
                    ></div>
                </div>

                <p className="loading-percentage">{totalProgress}%</p>
            </div>
        </div>
    );
}