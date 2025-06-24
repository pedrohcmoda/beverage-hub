import React, { useState, useEffect } from 'react';
import styles from './Drink.module.css';

function Drink() {
  const [drink, setDrink] = useState(null);

  useEffect(() => {
    async function fetchDrink() {
      try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php'); 
        const data = await response.json();
        setDrink(data.drinks[0]);
      } catch (error) {
        console.error('Error: ', error);
      }
    }
    fetchDrink();
  }, []);

  if (!drink) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={drink.strDrinkThumb}
        alt={drink.strDrink}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{drink.strDrink}</h3>
        <h4 className={styles.type}>{drink.strAlcoholic}</h4>
        <p className={styles.description}>{drink.strInstructions}</p>
        <ul className={styles.ingredients}>
          {Object.keys(drink)
            .filter((key) => key.startsWith('strIngredient') && drink[key])
            .map((key, index) => (
              <li key={key}>
                {drink[key]} - {drink[`strMeasure${index + 1}`] || 'by taste'}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Drink;
