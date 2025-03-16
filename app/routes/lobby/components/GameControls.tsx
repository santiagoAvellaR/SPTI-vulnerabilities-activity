interface GameControlsProps {
  onStartGame: () => void;
  onBack: () => void;
  disabled: boolean;
}

export default function GameControls({ onStartGame, onBack, disabled }: GameControlsProps) {
  return (
    <div className="lobby-controls">
      <button
        className="start-button"
        onClick={onStartGame}
        disabled={disabled}
      >
        Start Game
      </button>
      <button
        className="back-button"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}