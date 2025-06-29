import React, { useState, useEffect } from "react";
import { API_BASE } from "../../apiBase";
import styles from "./DrinkModal.module.css";
import Pagination from "./Pagination";

function DrinkModal({ open, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.length
      ? initialData.ingredients.map((di) => ({
          ingredientId: di.ingredient?.id || di.ingredientId,
          name: di.ingredient?.name || "",
          amount: di.amount || "",
        }))
      : []
  );
  const [ingredientPage, setIngredientPage] = useState(1);
  const [ingredientsPerPage, setIngredientsPerPage] = useState(5);
  const [image, setImage] = useState(initialData?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [alcoholType, setAlcoholType] = useState(initialData?.alcoholType || "ALCOOLICO");
  const [allCategories, setAllCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(
    initialData?.category?.id || initialData?.categoryId || ""
  );

  useEffect(() => {
    fetch(`${API_BASE}/api/ingredients`)
      .then((res) => res.json())
      .then((data) => setAllIngredients(data));
    fetch(`${API_BASE}/api/categories`)
      .then((res) => res.json())
      .then((data) => setAllCategories(data));
  }, [open]);

  useEffect(() => {
    setName(initialData?.name || "");
    setInstructions(initialData?.instructions || "");
    setImage(initialData?.image || "");
    setImageFile(null);
    setAlcoholType(initialData?.alcoholType || "ALCOOLICO");
    setCategoryId(initialData?.category?.id || initialData?.categoryId || "");
    setIngredients(
      initialData?.ingredients?.length
        ? initialData.ingredients.map((di) => ({
            ingredientId: di.ingredient?.id || di.ingredientId,
            name: di.ingredient?.name || "",
            amount: di.amount || "",
          }))
        : []
    );
  }, [initialData, open]);

  useEffect(() => {
    setIngredientPage(1);
  }, [open, ingredients.length]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientId: "", name: "", amount: "" }]);
  };
  const handleRemoveIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };
  const handleIngredientChange = (idx, field, value) => {
    setIngredients(ingredients.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing)));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const totalIngredientPages = Math.ceil(ingredients.length / ingredientsPerPage) || 1;
  const paginatedIngredients = ingredients.slice(
    (ingredientPage - 1) * ingredientsPerPage,
    ingredientPage * ingredientsPerPage
  );

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{initialData ? "Edit Drink" : "Add Drink"}</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("name", name);
            formData.append("instructions", instructions);
            ingredients.forEach((ing, idx) => {
              formData.append(`ingredients[${idx}][ingredientId]`, ing.ingredientId);
              formData.append(`ingredients[${idx}][amount]`, ing.amount);
            });
            if (imageFile) {
              formData.append("image", imageFile);
            }
            formData.append("alcoholType", alcoholType);
            formData.append("categoryId", categoryId);
            await onSave(formData);
          }}
          encType="multipart/form-data"
        >
          <label>Drink Name*</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Instructions</label>
          <input value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <img
              src={image.startsWith("/uploads/") ? `${API_BASE}${image}` : image}
              alt="preview"
              style={{
                display: "block",
                maxWidth: 120,
                maxHeight: 120,
                margin: "8px 0 8px 0",
                borderRadius: 8,
              }}
            />
          )}
          <label>Alcohol Type*</label>
          <select value={alcoholType} onChange={(e) => setAlcoholType(e.target.value)} required>
            <option value="ALCOOLICO">Alcoholic</option>
            <option value="NAO_ALCOOLICO">Non-alcoholic</option>
          </select>
          <label>Category*</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label>Ingredients</label>
          {paginatedIngredients.map((ing, idx) => {
            const realIdx = (ingredientPage - 1) * ingredientsPerPage + idx;
            return (
              <div key={realIdx} className={styles.ingredientRow}>
                <select
                  value={ing.ingredientId}
                  onChange={(e) => handleIngredientChange(realIdx, "ingredientId", e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {allIngredients.map((ingr) => (
                    <option key={ingr.id} value={ingr.id}>
                      {ingr.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(realIdx, "amount", e.target.value)}
                  style={{ width: 100, marginLeft: 8 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(realIdx)}
                  className={styles.removeBtn}
                >
                  -
                </button>
              </div>
            );
          })}
          <button type="button" onClick={handleAddIngredient} className={styles.addBtn}>
            + Add Ingredient
          </button>
          <Pagination
            page={ingredientPage}
            totalPages={totalIngredientPages}
            rowsPerPage={ingredientsPerPage}
            setRowsPerPage={setIngredientsPerPage}
            setPage={setIngredientPage}
            totalRows={ingredients.length}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.confirm}>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DrinkModal;
