import React, { useState, useEffect } from "react";
import { API_BASE } from "../../apiBase";
import styles from "./Drink.module.css";

function Drink() {
  const [drink, setDrink] = useState(null);

  useEffect(() => {
    async function fetchDrink() {
      try {
        const response = await fetch(`${API_BASE}/api/drinks/random`);
        const data = await response.json();
        setDrink(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    fetchDrink();
  }, []);

  if (!drink) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <img className={styles.image} src={drink.image} alt={drink.name} />
      <div className={styles.content}>
        <h3 className={styles.title}>{drink.name}</h3>
        <h4 className={styles.type}>{drink.type?.name || drink.type}</h4>
        <p className={styles.description}>{drink.instructions}</p>
        <ul className={styles.ingredients}>
          {drink.ingredients && drink.ingredients.length > 0 ? (
            drink.ingredients.map((item, idx) => (
              <li key={item.ingredient?.id || idx}>
                {item.ingredient?.name || item.name}
                {item.amount ? ` - ${item.amount}` : ""}
              </li>
            ))
          ) : (
            <li>No ingredients listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Drink;
