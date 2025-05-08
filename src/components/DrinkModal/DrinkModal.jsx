import React, { useState, useEffect } from "react";
import styles from "./DrinkModal.module.css";

const DrinkModal = ({ drink, onClose }) => {
  const [drinkDetails, setDrinkDetails] = useState(null);

  useEffect(() => {
    const fetchDrinkDetails = async () => {
      if (drink?.idDrink) {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`
        );
        const data = await response.json();
        if (data.drinks) {
          setDrinkDetails(data.drinks[0]);
        }
      }
    };

    fetchDrinkDetails();
  }, [drink]);

  if (!drinkDetails) return null;

  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drinkDetails[`strIngredient${i}`]
      ? (drinkDetails[`strMeasure${i}`]
          ? drinkDetails[`strMeasure${i}`] + " "
          : "") + drinkDetails[`strIngredient${i}`]
      : "";
    if (ingredient) ingredients.push(ingredient);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <img
          src={drinkDetails.strDrinkThumb}
          alt={drinkDetails.strDrink}
          className={styles.modalImage}
        />
        <h2>{drinkDetails.strDrink}</h2>
        <p>{drinkDetails.strInstructions}</p>
        <ul>
          {ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DrinkModal;
