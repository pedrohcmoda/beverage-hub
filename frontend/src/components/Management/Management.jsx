import React, { useEffect, useState } from "react";
import styles from "./Management.module.css";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import DrinkModal from "./DrinkModal";
import IngredientModal from "./IngredientModal";
import Pagination from "./Pagination";
import { API_BASE } from "../../apiBase";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Popup from "../Popup/Popup";

function Management() {
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showType, setShowType] = useState("drinks");
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [editDrink, setEditDrink] = useState(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (showType === "drinks") {
      fetch(`${API_BASE}/api/drinks`, {credentials: "include"})
        .then((res) => res.json())
        .then((data) => setDrinks(data));
    } else if (showType === "ingredients") {
      fetch(`${API_BASE}/api/ingredients`, {credentials: "include"})
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
    await fetch(url, options, {credentials: "include"});
    setShowDrinkModal(false);
    setShowType("drinks");
    fetch(`${API_BASE}/api/drinks`, {credentials: "include"})
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`${API_BASE}/api/ingredients`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowIngredientModal(false);
    setShowType("ingredients");
    fetch(`${API_BASE}/api/ingredients`, {credentials: "include"})
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    let url, type, setList;
    if (deleteTarget.type === "drink") {
      url = `${API_BASE}/api/drinks/${deleteTarget.item.id}`;
      type = "drink";
      setList = setDrinks;
    } else if (deleteTarget.type === "ingredient") {
      url = `${API_BASE}/api/ingredients/${deleteTarget.item.id}`;
      type = "ingredient";
      setList = setIngredients;
    }
    try {
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const data = await res.json();
        setPopup({ show: true, message: data.error || `Não foi possível deletar este ${type}.` });
      } else {
        setList((prev) => prev.filter((i) => i.id !== deleteTarget.item.id));
      }
    } catch (err) {
      setPopup({ show: true, message: `Erro ao deletar o ${type}.` });
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <div className={styles.managementContainer}>
      <div className={styles.header}>
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaUserCircle size={32} color="#efcb58" style={{ verticalAlign: "middle" }} />
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#4caf50",
              border: "none",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "1rem",
              marginLeft: 8,
              textDecoration: "none",
              borderRadius: 4,
              padding: "4px 12px",
            }}
          >
            Back
          </button>
        </div>
        <Link
          to="/"
          className={styles.logo}
          style={{
            fontFamily: "Alex Brush, cursive",
            fontSize: "2.5rem",
            color: "#fff",
            fontWeight: 400,
            margin: 0,
            whiteSpace: "nowrap",
            textDecoration: "none",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          BeverageHub
        </Link>
      </div>
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
                  <td className={styles.actionsRight}>
                    <button className={styles.actionBtn} onClick={() => openEditDrink(item)}>
                      <FaEdit />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => {
                        setDeleteTarget({ type: "drink", item });
                        setShowDeleteModal(true);
                      }}
                    >
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
                  <td className={styles.actionsRight}>
                    <button className={styles.actionBtn} onClick={() => openEditIngredient(item)}>
                      <FaEdit />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => {
                        setDeleteTarget({ type: "ingredient", item });
                        setShowDeleteModal(true);
                      }}
                    >
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
      <ConfirmModal
        message={`Are you sure you want to delete this ${deleteTarget?.type}?`}
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <Popup
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ show: false, message: "" })}
      />
    </div>
  );
}

export default Management;
