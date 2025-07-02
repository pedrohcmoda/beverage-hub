import React, { useState, useEffect } from "react";
import styles from "./DrinkModal.module.css";
import { useContext } from "react";
import { DrinkContext } from "../../context/DrinkProvider";
import { API_BASE } from "../../apiBase";

const DrinkModal = ({ onClose }) => {
  const { selectedDrink } = useContext(DrinkContext);
  const [drinkDetails, setDrinkDetails] = useState(null);

  useEffect(() => {
    const fetchDrinkDetails = async () => {
      if (selectedDrink?.id) {
        try {
          const response = await fetch(`${API_BASE}/api/drinks/${selectedDrink.id}`, {credentials: "include"});
          const data = await response.json();
          setDrinkDetails(data);
        } catch (error) {
          setDrinkDetails(null);
        }
      }
    };

    fetchDrinkDetails();
  }, [selectedDrink]);

  if (!drinkDetails) return null;

  const ingredients = drinkDetails.ingredients
    ? drinkDetails.ingredients.map((ing) =>
        ing.amount ? `${ing.amount} ${ing.ingredient.name}` : ing.ingredient.name
      )
    : [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <img
          src={
            drinkDetails.image?.startsWith("/uploads/")
              ? `${API_BASE}${drinkDetails.image}`
              : drinkDetails.image
          }
          alt={drinkDetails.name}
          className={styles.modalImage}
        />
        <h2>{drinkDetails.name}</h2>
        <p>{drinkDetails.instructions}</p>
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
