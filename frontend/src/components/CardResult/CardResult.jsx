import React from "react";
import styles from "./CardResult.module.css";

function CardResult({ drink, onClick }) {
  return (
    <div
      className={styles.cardContainer}
      onClick={onClick}
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.imageContainer}>
        <img src={drink.image} alt={drink.name} className={styles.drinkImage} />
      </div>
      <div className={styles.drinkName}>{drink.name}</div>
    </div>
  );
}

export default CardResult;
