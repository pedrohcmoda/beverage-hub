import React, { useEffect, useState } from "react";
import styles from "./Management.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import DrinkModal from "./DrinkModal";
import IngredientModal from "./IngredientModal";
import Pagination from "./Pagination";
import { API_BASE } from "../../apiBase";

function Management() {
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showType, setShowType] = useState("drinks");
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [editDrink, setEditDrink] = useState(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);

  useEffect(() => {
    if (showType === "drinks") {
      fetch(`${API_BASE}/api/drinks`)
        .then((res) => res.json())
        .then((data) => setDrinks(data));
    } else if (showType === "ingredients") {
      fetch(`${API_BASE}/api/ingredients`)
        .then((res) => res.json())
        .then((data) => setIngredients(data));
    }
  }, [showType]);

  const openAddDrink = () => {
    setEditDrink(null);
    setShowDrinkModal(true);
  };
  const openEditDrink = (drink) => {
    setEditDrink(drink);
    setShowDrinkModal(true);
  };
  const closeDrinkModal = () => setShowDrinkModal(false);
  const handleSaveDrink = async (data) => {
    let isFormData = data instanceof FormData;
    let url = editDrink ? `${API_BASE}/api/drinks/${editDrink.id}` : `${API_BASE}/api/drinks`;
    let method = editDrink ? "PUT" : "POST";
    let options = {
      method,
      credentials: "include",
      body: data,
    };
    if (!isFormData) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }
    await fetch(url, options);
    setShowDrinkModal(false);
    setShowType("drinks");
    fetch(`${API_BASE}/api/drinks`)
      .then((res) => res.json())
      .then((data) => setDrinks(data));
  };

  const openAddIngredient = () => {
    setEditIngredient(null);
    setShowIngredientModal(true);
  };
  const openEditIngredient = (ingredient) => {
    setEditIngredient(ingredient);
    setShowIngredientModal(true);
  };
  const closeIngredientModal = () => setShowIngredientModal(false);
  const handleSaveIngredient = async (data) => {
    if (editIngredient) {
      await fetch(`${API_BASE}/api/ingredients/${editIngredient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`${API_BASE}/api/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowIngredientModal(false);
    setShowType("ingredients");
    fetch(`${API_BASE}/api/ingredients`)
      .then((res) => res.json())
      .then((data) => setIngredients(data));
  };

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [showType]);

  const getPaginated = (arr) => {
    const start = (page - 1) * rowsPerPage;
    return arr.slice(start, start + rowsPerPage);
  };
  const totalRows = showType === "drinks" ? drinks.length : ingredients.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementContent}>
        <div className={styles.managementHeader}>
          <h2>Manage {showType === "drinks" ? "Drinks" : "Ingredients"}</h2>
          <div>
            <button className={styles.switchBtn} onClick={() => setShowType("drinks")}>
              Drinks
            </button>
            <button className={styles.switchBtn} onClick={() => setShowType("ingredients")}>
              Ingredients
            </button>
            {showType === "drinks" && (
              <button className={styles.addBtn} onClick={openAddDrink}>
                + Add Drink
              </button>
            )}
            {showType === "ingredients" && (
              <button className={styles.addBtn} onClick={openAddIngredient}>
                + Add Ingredient
              </button>
            )}
          </div>
        </div>
        {showType === "drinks" ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Instructions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(drinks).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    {item.instructions
                      ? item.instructions.length > 45
                        ? item.instructions.slice(0, 45) + "..."
                        : item.instructions
                      : "-"}
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditDrink(item)}>
                      <FaEdit />
                    </button>
                    <button className={styles.actionBtn}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(ingredients).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditIngredient(item)}>
                      <FaEdit />
                    </button>
                    <button className={styles.actionBtn}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          totalRows={totalRows}
        />
      </div>
      <DrinkModal
        open={showDrinkModal}
        onClose={closeDrinkModal}
        onSave={handleSaveDrink}
        initialData={editDrink}
      />
      <IngredientModal
        open={showIngredientModal}
        onClose={closeIngredientModal}
        onSave={handleSaveIngredient}
        initialData={editIngredient}
      />
    </div>
  );
}

export default Management;
