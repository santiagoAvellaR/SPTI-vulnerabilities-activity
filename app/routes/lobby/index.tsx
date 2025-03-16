import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import "./styles.css";
import IceCreamSelector from "./components/IceCreamSelector";
import GameControls from "./components/GameControls";

const iceCreams = [
    { id: 1, name: "Vanilla", image: "/vainilla.jpg" },
    { id: 2, name: "Chocolate", image: "/chocolate.jpg" },
    { id: 3, name: "amarillo", image: "/amarillo.jpg" },
    { id: 4, name: "azulito", image: "/azulito.jpg" },
    { id: 5, name: "fresa", image: "/fresa.jpg" },
    { id: 6, name: "verde", image: "/verde.jpg" }
];

export default function Lobby() {
    const navigate = useNavigate();
    const [player1IceCream, setPlayer1IceCream] = useState(null);
    const [player2IceCream, setPlayer2IceCream] = useState(null);
    const [player1Ready, setPlayer1Ready] = useState(false);
    const [player2Ready, setPlayer2Ready] = useState(false);
    const [player1Name, setPlayer1Name] = useState("Player 1");
    const [player2Name, setPlayer2Name] = useState("Player 2");
    const [countdown, setCountdown] = useState(3);

    const togglePlayer1Ready = () => setPlayer1Ready(prev => !prev);
    const togglePlayer2Ready = () => setPlayer2Ready(prev => !prev);

    const allPlayersReady = player1Ready && player2Ready;

    // Countdown timer when all players are ready
    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (allPlayersReady) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Navigate to game when countdown reaches 0
                        navigate(`/game?player1=${player1IceCream.id}&player2=${player2IceCream.id}&p1name=${encodeURIComponent(player1Name)}&p2name=${encodeURIComponent(player2Name)}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [allPlayersReady, navigate, player1IceCream, player2IceCream, player1Name, player2Name]);

    const handleStartGame = () => {
        if ((player1Ready && player2Ready) && (player1IceCream && player2IceCream)) {
            navigate(`/game?player1=${player1IceCream.id}&player2=${player2IceCream.id}&p1name=${encodeURIComponent(player1Name)}&p2name=${encodeURIComponent(player2Name)}`);
        } else {
            alert("Both players must select a character and be ready to start");
        }
    };

    const handleBackButton = () => {
        navigate("/joinscreen");
    };

    return (
        <div className="lobby-screen">
            <h1 className="lobby-title">Select Your Characters</h1>

            <div className="selectors-container">
                <IceCreamSelector
                    iceCreams={iceCreams}
                    selectedIceCream={player1IceCream}
                    onIceCreamSelect={setPlayer1IceCream}
                    position="left"
                    playerName="Player 1"
                    isReady={player1Ready}
                    onReadyToggle={togglePlayer1Ready}
                    playerCustomName={player1Name}
                    onPlayerNameChange={setPlayer1Name}
                />

                {/* Middle section */}
                <div className="middle-section">
                    {allPlayersReady && (
                        <div className="countdown-container">
                            <p className="countdown-text">Game starts in</p>
                            <div className="countdown-number">{countdown}</div>
                            <div className="versus-display">
                                <span className="versus-player">{player1Name}</span>
                                <span className="versus-vs">VS</span>
                                <span className="versus-player">{player2Name}</span>
                            </div>
                            <button
                                className="start-now-button"
                                onClick={handleStartGame}
                            >
                                Start Now
                            </button>
                        </div>
                    )}
                    {!allPlayersReady && (
                        <GameControls
                            onStartGame={handleStartGame}
                            onBack={handleBackButton}
                            disabled={!player1IceCream || !player2IceCream}
                        />
                    )}
                </div>

                <IceCreamSelector
                    iceCreams={iceCreams}
                    selectedIceCream={player2IceCream}
                    onIceCreamSelect={setPlayer2IceCream}
                    position="right"
                    playerName="Player 2"
                    isReady={player2Ready}
                    onReadyToggle={togglePlayer2Ready}
                    playerCustomName={player2Name}
                    onPlayerNameChange={setPlayer2Name}
                />
            </div>
        </div>
    );
}