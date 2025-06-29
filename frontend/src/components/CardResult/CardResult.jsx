import React from "react";
import { API_BASE } from "../../apiBase";
import styles from "./CardResult.module.css";

function CardResult({ drink, onClick }) {
  const imageUrl = drink.image?.startsWith("/uploads/") ? `${API_BASE}${drink.image}` : drink.image;

  return (
    <div
      className={styles.cardContainer}
      onClick={onClick}
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={drink.name} className={styles.drinkImage} />
      </div>
      <div className={styles.drinkName}>{drink.name}</div>
    </div>
  );
}

export default CardResult;
