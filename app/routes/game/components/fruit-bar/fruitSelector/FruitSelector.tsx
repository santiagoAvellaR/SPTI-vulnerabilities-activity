import "./FruitSelector.css";

interface FruitProps {
  fruitName: string;
  actualFruit: string;
}

export default function FruitSelector({ fruitName, actualFruit }: FruitProps) {
  const isSelected = fruitName === actualFruit;

  return (
    <div className={`fruit-wrapper ${isSelected ? "selected" : ""}`}>
      {isSelected && (
        <>
          <img
            src="/game-screen/footer/selector.webp"
            alt="Selector de fruta"
            className="fruit-selector"
          />
          <img
            src="/game-screen/footer/arrow.webp"
            alt="Flecha de fruta"
            className="fruit-arrow"
          />
        </>
      )}
      <img
        src={`/fruits/${fruitName}.webp`}
        alt={`Fruta: ${fruitName}`}
        className="fruit-image"
      />
    </div>
  );
}
