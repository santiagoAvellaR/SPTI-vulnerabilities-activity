import { useState, useEffect } from "react";

interface IceCream {
    id: number;
    name: string;
    image: string;
}

interface IceCreamSelectorProps {
    iceCreams: IceCream[];
    selectedIceCream: IceCream | null;
    onIceCreamSelect: (iceCream: IceCream) => void;
    position: "left" | "right";
    playerName: string;
    isReady: boolean;
    onReadyToggle: () => void;
    playerCustomName: string;
    onPlayerNameChange: (name: string) => void;
}

export default function IceCreamSelector({
    iceCreams,
    selectedIceCream,
    onIceCreamSelect,
    position,
    playerName,
    isReady,
    onReadyToggle,
    playerCustomName,
    onPlayerNameChange
}: IceCreamSelectorProps) {
    // Set default selection when component mounts if nothing is selected
    useEffect(() => {
        if (!selectedIceCream && iceCreams.length > 0) {
            // Choose default ice cream based on position
            const defaultIndex = position === "left" ? 0 : Math.min(1, iceCreams.length - 1);
            onIceCreamSelect(iceCreams[defaultIndex]);
        }
    }, [iceCreams, onIceCreamSelect, position, selectedIceCream]);

    return (
        <div className={`ice-cream-selector ${position}-selector ${isReady ? 'player-ready' : ''}`}>
            <h2 className="player-title">{playerName}</h2>

            <div className="character-selection">
                {iceCreams.map((iceCream) => (
                    <button
                        key={iceCream.id}
                        className={`character-button ${selectedIceCream?.id === iceCream.id ? "selected" : ""}`}
                        onClick={() => onIceCreamSelect(iceCream)}
                        disabled={isReady}
                    >
                        <img
                            src={iceCream.image}
                            alt={iceCream.name}
                            className="character-image"
                        />
                        <span className="character-name">{iceCream.name}</span>
                    </button>
                ))}
            </div>

            {selectedIceCream && (
                <div className="selected-character-display">
                    <h2>Selected: {selectedIceCream.name}</h2>
                    <img
                        src={selectedIceCream.image}
                        alt={selectedIceCream.name}
                        className="selected-character-image"
                    />

                    {/* Player Name Input */}
                    <div className="player-name-input-container">
                        <label htmlFor={`player-${position}-name`} className="player-name-label">
                            Player Name:
                        </label>
                        <input
                            id={`player-${position}-name`}
                            type="text"
                            value={playerCustomName}
                            onChange={(e) => onPlayerNameChange(e.target.value)}
                            placeholder="Enter your name"
                            className="player-name-input"
                            maxLength={15}
                            disabled={isReady}
                        />
                    </div>

                    <button
                        className={`player-ready-button ${isReady ? 'ready' : ''}`}
                        onClick={onReadyToggle}
                    >
                        {isReady ? "Not Ready" : "Ready"}
                    </button>

                    {isReady && <div className="ready-indicator">Ready!</div>}
                </div>
            )}
        </div>
    );
}