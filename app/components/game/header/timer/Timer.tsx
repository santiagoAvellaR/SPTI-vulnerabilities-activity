import { useState, useEffect } from "react";
import "./Timer.css";

type TimerProps = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  minutes: number;
  seconds: number;
};

const Timer: React.FC<TimerProps> = ({ isRunning, setIsRunning, minutes, seconds }) => {
  const frames = [
    "/game-screen/header/clock/clock-0.webp",
    "/game-screen/header/clock/clock-1.webp",
    "/game-screen/header/clock/clock-2.webp",
    "/game-screen/header/clock/clock-3.webp",
    "/game-screen/header/clock/clock-4.webp",
    "/game-screen/header/clock/clock-5.webp",
    "/game-screen/header/clock/clock-6.webp",
    "/game-screen/header/clock/clock-7.webp",
  ];

  const digitsRoute = "/game-screen/header/digits/digit-";
  const [clockFrame, setClockFrame] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(minutes);
  const [currentSeconds, setCurrentSeconds] = useState(seconds);

  // Animación del reloj
  useEffect(() => {
    if (!isRunning) return;
    const frameInterval = setInterval(() => {
      setClockFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, 100);
    return () => clearInterval(frameInterval);
  }, [isRunning]);

  // Actualización del tiempo
  useEffect(() => {
    if (!isRunning) return;

    const timeInterval = setInterval(() => {
      setCurrentSeconds((prevSeconds) => {
        let newMinutes = currentMinutes;
        let newSeconds = prevSeconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;
        }

        if (newMinutes < 0) {
          newMinutes = 0;
          newSeconds = 0;
          setIsRunning(false); // Detener cuando llega a 0
          clearInterval(timeInterval);
        }

        setCurrentMinutes(newMinutes);
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isRunning, currentMinutes, setIsRunning]);

  // Obtener dígitos individuales
  const tensMinutes = Math.floor(currentMinutes / 10);
  const onesMinutes = currentMinutes % 10;
  const tensSeconds = Math.floor(currentSeconds / 10);
  const onesSeconds = currentSeconds % 10;

  return (
    <div className="time-container">
      {/* Reloj Animado */}
      <img src={frames[clockFrame]} alt="Reloj animado" className="clock-animation" />
      {/* Tiempo con imágenes */}
      <img className="clock-digits" src={`${digitsRoute}${tensMinutes}.webp`} alt={`Minutos decena: ${tensMinutes}`} />
      <img className="clock-digits" src={`${digitsRoute}${onesMinutes}.webp`} alt={`Minutos unidad: ${onesMinutes}`} />
      <img className="clock-digits" src="/game-screen/header/digits/colon.webp" alt="Dos puntos" />
      <img className="clock-digits" src={`${digitsRoute}${tensSeconds}.webp`} alt={`Segundos decena: ${tensSeconds}`} />
      <img className="clock-digits" src={`${digitsRoute}${onesSeconds}.webp`} alt={`Segundos unidad: ${onesSeconds}`} />
    </div>
  );
};

export default Timer;