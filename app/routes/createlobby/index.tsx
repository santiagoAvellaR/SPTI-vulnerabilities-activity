import { createWebSocketConnection } from "~/services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useUser } from "~/userContext";
import IceCreamSelector from "./components/IceCreamSelector";
import GameControls from "./components/GameControls";
import api from "~/services/api";
import "./styles.css";

const iceCreams = [
    { id: 1, name: "Vanilla", image: "/vainilla.png" },
    { id: 2, name: "Chocolate", image: "/chocolate.png" },
    { id: 3, name: "amarillo", image: "/amarillo.png" },
    { id: 4, name: "azulito", image: "/azulito.png" },
    { id: 5, name: "fresa", image: "/fresa.png" },
    { id: 6, name: "verde", image: "/verde.png" }
];


const connectionWebSocket = (userData) => {
    const matchDetails = { level: 3, map: "desert" };
    // Codificamos el objeto JSON para la URL
    const messageParam = encodeURIComponent(JSON.stringify(matchDetails));
    const wsURI = `/ws/matchmaking?userId=${userData?.userId}&message=${messageParam}`;
    try {
        const ws = createWebSocketConnection(wsURI);
        return ws;
    } catch (error) {
        console.error("Error creating WebSocket connection", error);
        return null;
    }
}

export default function Lobby() {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [player1IceCream, setPlayer1IceCream] = useState(null);
    const [player2IceCream, setPlayer2IceCream] = useState(null);
    const [player1Ready, setPlayer1Ready] = useState(false);
    const [player2Ready, setPlayer2Ready] = useState(false);
    const [isSoloPlayer, setIsSoloPlayer] = useState(true);
    const [player1Name, setPlayer1Name] = useState("Player 1");
    const [player2Name, setPlayer2Name] = useState("Waiting for player...");
    const [countdown, setCountdown] = useState(3);

    // Inicializa roomCode con "Loading..."
    const [roomCode, setRoomCode] = useState("Loading...");
    const [isSearching, setIsSearching] = useState(false);
    const [searchTime, setSearchTime] = useState(0);
    const [error, setError] = useState("");

    // Cargar el código de sala cuando el componente se monte
    useEffect(() => {
        const loadRoomCode = async () => {
            try {
                const response = await api.get(`/rest/users/${userData?.userId}/matches`);
                console.log("API response:", response.data);
                console.log("user:", userData?.userId);
                setRoomCode(response.data);
            } catch (error) {
                console.error("Error loading room code:", error);
                setRoomCode("ERROR");
            }
        };

        loadRoomCode();
    }, [userData?.userId]);

    const togglePlayer1Ready = () => setPlayer1Ready(prev => !prev);
    const togglePlayer2Ready = () => setPlayer2Ready(prev => !prev);

    // Simulate matchmaking search timer
    useEffect(() => {
        let searchTimer;
        if (isSearching) {
            searchTimer = setInterval(() => {
                setSearchTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(searchTimer);
    }, [isSearching]);

    // Set default player 2 character in solo mode
    useEffect(() => {
        if (isSoloPlayer && !player2IceCream && iceCreams.length > 0) {
            // Choose a different character than player 1 if possible
            const player1Id = player1IceCream?.id;
            const availableCharacters = player1Id
                ? iceCreams.filter(ice => ice.id !== player1Id)
                : iceCreams;

            setPlayer2IceCream(availableCharacters[0] || iceCreams[0]);
            setPlayer2Ready(true); // Auto-ready player 2 in solo mode
        }
    }, [isSoloPlayer, player1IceCream, player2IceCream]);

    // Define a new condition for game readiness
    const isGameReady = isSoloPlayer
        ? (player1Ready && player1IceCream) // Solo mode only needs player 1 ready
        : (player1Ready && player2Ready && player1IceCream && player2IceCream); // Two players need both ready

    // Countdown timer when players are ready
    useEffect(() => {
        let timer;
        if (isGameReady) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Navigate to game when countdown reaches 0
                        navigate(createGameUrl());
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { clearInterval(timer); setCountdown(3) };
    }, [isGameReady, navigate, player1IceCream, player2IceCream, player1Name, player2Name]);

    // Function to create the game URL with appropriate parameters
    const createGameUrl = () => {
        const p1Id = player1IceCream?.id;
        const p2Id = player2IceCream?.id;

        if (!p1Id) return ""; // Safety check

        return `/game?player1=${p1Id}&player2=${p2Id || 'ai'}&p1name=${encodeURIComponent(player1Name)}&p2name=${encodeURIComponent(player2Name)}&solo=${isSoloPlayer}&room=${roomCode}`;
    };

    const handleStartGame = () => {
        if (isSoloPlayer) {
            // For solo mode, only check if player 1 is ready
            if (player1Ready && player1IceCream) {
                navigate(createGameUrl());
            } else {
                alert("Please select your character and click Ready to start");
            }
        } else {
            // For two-player mode, check both players
            if ((player1Ready && player2Ready) && (player1IceCream && player2IceCream)) {
                navigate(createGameUrl());
            } else {
                alert("Both players must select a character and be ready to start");
            }
        }
    };

    const handleBackButton = () => {
        navigate("/joinscreen");
    };

    const handleFindOpponent = () => {
        if (userData) {
            const ws = connectionWebSocket(userData);
            if (ws) {
                setIsSearching(true);
            } else {
                setError("Failed to create WebSocket connection");
            }
        } else {
            setError("User data not available");
        }
    };

    const cancelMatchmaking = () => {
        setIsSearching(false);
        setSearchTime(0);
    };

    // Format search time as MM:SS
    const formatSearchTime = () => {
        const minutes = Math.floor(searchTime / 60);
        const seconds = searchTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="lobby-screen">
            <h1 className="lobby-title">
                Room Code: <span className="room-code">{roomCode}</span>
            </h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

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
                    <div className="room-info">
                        <div className="room-code-display">
                            <h2 className="room-code-label">Room Code</h2>
                            <div className="room-code-value">{roomCode}</div>
                            <p className="room-code-help">Share this code with another player to join your game.</p>
                        </div>

                        {isSearching ? (
                            <div className="matchmaking-status">
                                <div className="searching-indicator">
                                    <div className="pulse-dot"></div>
                                    <span>Searching for opponent...</span>
                                </div>
                                <div className="search-time">Time: {formatSearchTime()}</div>
                                <button
                                    className="cancel-search-button"
                                    onClick={cancelMatchmaking}
                                >
                                    Cancel Search
                                </button>
                            </div>
                        ) : (
                            <div className="matchmaking-controls">
                                <button
                                    className="find-opponent-button"
                                    onClick={handleFindOpponent}
                                    disabled={!player1Ready || !player1IceCream}
                                >
                                    Find Opponent
                                </button>
                                <p className="matchmaking-help">
                                    {player1Ready && player1IceCream
                                        ? "Click to find an opponent"
                                        : "Select character and mark as Ready to find opponents"}
                                </p>
                            </div>
                        )}
                    </div>

                    {isGameReady && (
                        <div className="countdown-container">
                            <p className="countdown-text">Game starts in</p>
                            <div className="countdown-number">{countdown}</div>
                            <button
                                className="start-now-button"
                                onClick={handleStartGame}
                            >
                                Start Now
                            </button>
                        </div>
                    )}

                    {!isGameReady && !isSearching && (
                        <GameControls
                            onStartGame={handleStartGame}
                            onBack={handleBackButton}
                            disabled={!player1IceCream || !player1Ready}
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
                    isDisabled={true} // Always disabled until a second player joins
                />
            </div>
        </div>
    );
}