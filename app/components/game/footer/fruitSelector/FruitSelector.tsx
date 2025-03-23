import "./FruitSelector.css";

interface FruitProps {
    fruitName: string; // Nombre de la fruta
    actualFruit: string; // Fruta seleccionada actualmente
}

const FruitSelector: React.FC<FruitProps> = ({ fruitName, actualFruit }) => {
  return (
    <div className={`fruit-wrapper ${fruitName === actualFruit ? "selected" : ""}`}>
      {fruitName === actualFruit && (
        <>
          <img src="/game-screen/footer/selector.webp" alt="Selector de fruta" className="fruit-selector" />
          <img src="/game-screen/footer/arrow.webp" alt="Flecha de fruta" className="fruit-arrow" />
        </>
      )}
      <img 
        src={`/fruits/${fruitName}.webp`} 
        alt={`Fruta: ${fruitName}`} 
        className="fruit-image" 
      />
    </div>
  );
};

export default FruitSelector;