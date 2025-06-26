import React, { useState } from "react";
import styles from "./Filter.module.css";

function Filter({ onFilterChange }) {
  const [categories, setCategories] = useState({
    cocktail: false,
    ordinaryDrink: false,
    shake: false,
    other: false,
    cocoa: false,
    shot: false,
    coffeeTea: false,
    homemadeLiqueur: false,
    beer: false,
    softDrink: false,
  });

  const [types, setTypes] = useState({
    alcoholic: false,
    nonAlcoholic: false,
    optionalAlcohol: false,
  });

  const handleCategoryChange = (category) => {
    const updatedCategories = {
      ...categories,
      [category]: !categories[category],
    };
    setCategories(updatedCategories);
    onFilterChange({ categories: updatedCategories, types });
  };

  const handleTypeChange = (type) => {
    const updatedTypes = {
      ...types,
      [type]: !types[type],
    };
    setTypes(updatedTypes);
    onFilterChange({ categories, types: updatedTypes });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSection}>
        <h3>Categories</h3>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={categories.cocktail}
              onChange={() => handleCategoryChange("cocktail")}
            />
            Cocktail
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.ordinaryDrink}
              onChange={() => handleCategoryChange("ordinaryDrink")}
            />
            Ordinary Drink
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.shake}
              onChange={() => handleCategoryChange("shake")}
            />
            Shake
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.other}
              onChange={() => handleCategoryChange("other")}
            />
            Other / Unknown
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.cocoa}
              onChange={() => handleCategoryChange("cocoa")}
            />
            Cocoa
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.shot}
              onChange={() => handleCategoryChange("shot")}
            />
            Shot
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.coffeeTea}
              onChange={() => handleCategoryChange("coffeeTea")}
            />
            Coffee / Tea
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.homemadeLiqueur}
              onChange={() => handleCategoryChange("homemadeLiqueur")}
            />
            Homemade Liqueur
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.beer}
              onChange={() => handleCategoryChange("beer")}
            />
            Beer
          </label>
          <label>
            <input
              type="checkbox"
              checked={categories.softDrink}
              onChange={() => handleCategoryChange("softDrink")}
            />
            Soft Drink
          </label>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Type</h3>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={types.alcoholic}
              onChange={() => handleTypeChange("alcoholic")}
            />
            Alcoholic
          </label>
          <label>
            <input
              type="checkbox"
              checked={types.nonAlcoholic}
              onChange={() => handleTypeChange("nonAlcoholic")}
            />
            Non Alcoholic
          </label>
          <label>
            <input
              type="checkbox"
              checked={types.optionalAlcohol}
              onChange={() => handleTypeChange("optionalAlcohol")}
            />
            Optional Alcohol
          </label>
        </div>
      </div>
    </div>
  );
}

export default Filter;
