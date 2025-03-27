import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./IceCreamCharacter.css"; // Asegúrate de definir los estilos

const SPRITE_WIDTH = 30; // Tamaño del frame
const SPRITE_HEIGHT = 37;
const FRAME_SPEED = 0.15; // Velocidad de cambio de frames
const FRAMES = {
    idle: { row: 1, frames: 6 },
    walkDown: { row: 2, frames: 8 },
    walkUp: { row: 3, frames: 8 },
    walkRight: { row: 5, frames: 8 },
    walkLeft: { row: 6, frames: 8 },
    meltFront: { row: 8, frames: 9 },
    meltSide: { row: 12, frames: 13 },
    celebrate: { row: 13, frames: 9 }
};

const IceCreamCharacter: React.FC = () => {
    const [direction, setDirection] = useState<keyof typeof FRAMES>("idle");
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowDown":
                    setDirection("walkDown");
                    setIsMoving(true);
                    break;
                case "ArrowUp":
                    setDirection("walkUp");
                    setIsMoving(true);
                    break;
                case "ArrowRight":
                    setDirection("walkRight");
                    setIsMoving(true);
                    break;
                case "ArrowLeft":
                    setDirection("walkLeft");
                    setIsMoving(true);
                    break;
                case "m": // Tecla M para derretirse
                    setDirection(direction === "walkDown" ? "meltFront" : "meltSide");
                    setIsMoving(false);
                    break;
                case "g": // Tecla G para celebrar
                    setDirection("celebrate");
                    setIsMoving(false);
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) {
                setIsMoving(false);
                setDirection("idle");
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
        <motion.div
            className="sprite"
            animate={{ backgroundPositionX: Array(FRAMES[direction].frames).fill(0).map((_, i) => `-${i * SPRITE_WIDTH}px`) }}
            transition={{ repeat: isMoving ? Number.POSITIVE_INFINITY : 0, duration: FRAME_SPEED * FRAMES[direction].frames }}
            style={{ backgroundPositionY: `-${FRAMES[direction].row * SPRITE_HEIGHT + 60}px` }}
        />
    );
};

export default IceCreamCharacter;
