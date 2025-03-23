import Fruit from "../fruit/Fruit";
import "./FruitBar.css";

interface FruitBarProps {
  fruits: string[]; // Array con los nombres de las frutas
  selectedFruit: string; // Fruta seleccionada actualmente
}

const FruitBar: React.FC<FruitBarProps> = ({ 
  fruits, 
  selectedFruit 
}) => {
  return (
    <div className="fruit-bar">
      <div className="fruit-bar-background">
        <div className="fruit-items-container">
          {fruits.map((fruit) => (
            <div 
              key={fruit} 
              className="fruit-item"
            >
              <Fruit 
                fruitName={fruit} 
                actualFruit={selectedFruit} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FruitBar;