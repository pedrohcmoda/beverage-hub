import React, { useEffect, useState } from "react";
import styles from "./Management.module.css";
import { FaUserCircle, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import CategoryModal from "./CategoryModal";
import DrinkModal from "./DrinkModal";
import IngredientModal from "./IngredientModal";
import Pagination from "./Pagination";

function Management() {
  const [user, setUser] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showType, setShowType] = useState("drinks");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [editDrink, setEditDrink] = useState(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (showType === "drinks") {
      fetch("http://localhost:3001/api/drinks")
        .then((res) => res.json())
        .then((data) => setDrinks(data));
    } else if (showType === "ingredients") {
      fetch("http://localhost:3001/api/ingredients")
        .then((res) => res.json())
        .then((data) => setIngredients(data));
    } else if (showType === "categories") {
      fetch("http://localhost:3001/api/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data));
    }
  }, [showType]);

  useEffect(() => {
  if (showDrinkModal) {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }
}, [showDrinkModal]);

  const handleLogout = async () => {
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  const handleSearchChange = (value) => setSearch(value);

  const filteredDrinks = drinks.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddCategory = () => {
    setEditCategory(null);
    setShowCategoryModal(true);
  };
  const openEditCategory = (cat) => {
    setEditCategory(cat);
    setShowCategoryModal(true);
  };
  const closeCategoryModal = () => setShowCategoryModal(false);
  const handleSaveCategory = async (data) => {
    if (editCategory) {
      await fetch(`http://localhost:3001/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowCategoryModal(false);
    setShowType("categories");
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

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
    if (editDrink) {
      await fetch(`http://localhost:3001/api/drinks/${editDrink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("http://localhost:3001/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(data);
    }
    setShowDrinkModal(false);
    setShowType("drinks");
    fetch("http://localhost:3001/api/drinks")
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
      await fetch(`http://localhost:3001/api/ingredients/${editIngredient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("http://localhost:3001/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowIngredientModal(false);
    setShowType("ingredients");
    fetch("http://localhost:3001/api/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredients(data));
  };

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { setPage(1); }, [showType, search]);

  const getPaginated = (arr) => {
    const start = (page - 1) * rowsPerPage;
    return arr.slice(start, start + rowsPerPage);
  };
  const totalRows = showType === "drinks" ? filteredDrinks.length : showType === "ingredients" ? filteredIngredients.length : filteredCategories.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

  return (
    <div className={styles.managementContainer}>
      <div className={styles.managementContent}>
        <div className={styles.managementHeader}>
          <h2>Gerenciar {showType === "drinks" ? "Bebidas" : showType === "ingredients" ? "Ingredientes" : "Categorias"}</h2>
          <div>
            <button className={styles.switchBtn} onClick={() => setShowType("drinks")}>Bebidas</button>
            <button className={styles.switchBtn} onClick={() => setShowType("ingredients")}>Ingredientes</button>
            <button className={styles.switchBtn} onClick={() => setShowType("categories")}>Categorias</button>
            {showType === "categories" && (
              <button className={styles.addBtn} onClick={openAddCategory}>+ Cadastrar Categoria</button>
            )}
            {showType === "drinks" && (
              <button className={styles.addBtn} onClick={openAddDrink}>+ Cadastrar Bebida</button>
            )}
            {showType === "ingredients" && (
              <button className={styles.addBtn} onClick={openAddIngredient}>+ Cadastrar Ingrediente</button>
            )}
          </div>
        </div>
        {showType === "categories" ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(filteredCategories).map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditCategory(cat)}><FaEdit /></button>
                    <button className={styles.actionBtn}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : showType === "drinks" ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Instrução</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(filteredDrinks).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{
                    typeof item.category === "string"
                      ? item.category
                      : item.category && item.category.name
                        ? item.category.name
                        : Array.isArray(item.category)
                          ? item.category.map(c => c.name || c).join(', ')
                          : "-"
                  }</td>
                  <td>
                    {item.instructions
                      ? item.instructions.length > 45
                        ? item.instructions.slice(0, 45) + "..."
                        : item.instructions
                      : "-"}
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditDrink(item)}><FaEdit /></button>
                    <button className={styles.actionBtn}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(filteredIngredients).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => openEditIngredient(item)}><FaEdit /></button>
                    <button className={styles.actionBtn}><FaTrash /></button>
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
      <CategoryModal
        open={showCategoryModal}
        onClose={closeCategoryModal}
        onSave={handleSaveCategory}
        initialData={editCategory}
      />
      <DrinkModal
        open={showDrinkModal}
        onClose={closeDrinkModal}
        onSave={handleSaveDrink}
        initialData={editDrink}
        categories={categories}
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
