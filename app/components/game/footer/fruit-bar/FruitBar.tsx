import { useState, useEffect } from 'react';
import './FruitBar.css';

interface FruitBarProps {
  fruits: string[]; // List of the fruits that appear on the level (ej: ['banana', 'grape', 'apple'])
  actualFruit: string; // Fruta recogida actualmente
}

const FruitBar: React.FC<FruitBarProps> = ({ fruits, actualFruit: collectedFruits }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (collectedFruits === fruits[currentIndex]) {
      const nextIndex = (currentIndex + 1) % fruits.length;
      setCurrentIndex(nextIndex);
    }
  }, [collectedFruits, currentIndex, fruits]);

  return (
    <div className="fruit-bar-container">
      <img src="/game-screen/footer/fruit-bar.webp" alt="Fruit bar background" className="fruit-bar-bg" />
      <div className="fruits-container">
        {fruits.map((fruit, index) => (
          <div key={fruit} className="fruit-wrapper">
            {index === currentIndex && (
              <>
                <img src="/game-screen/footer/square.webp" alt="Selector" className="fruit-selector" />
                <img src="/game-screen/footer/arrow.webp" alt="Arrow" className="fruit-arrow" />
              </>
            )}
            <img src={`/game-screen/footer/fruits/${fruit}.webp`} alt={fruit} className="fruit-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FruitBar;
