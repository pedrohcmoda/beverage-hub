import React from "react";
import styles from "./CardResult.module.css";

function CardResult({ drink }) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={drink.strDrinkThumb} 
          alt={drink.strDrink} 
          className={styles.drinkImage}
        />
      </div>
      <div className={styles.drinkName}>
        {drink.strDrink}
      </div>
    </div>
  );
}

export default CardResult;