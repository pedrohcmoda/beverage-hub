import React, { useState, useEffect } from "react";
import styles from "./DrinkModal.module.css";
import Pagination from "./Pagination";

function DrinkModal({ open, onClose, onSave, initialData, categories }) {
  const [name, setName] = useState(initialData?.name || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.length
      ? initialData.ingredients.map(di => ({
          ingredientId: di.ingredient?.id || di.ingredientId,
          name: di.ingredient?.name || "",
          amount: di.amount || ""
        }))
      : []
  );
  const [ingredientPage, setIngredientPage] = useState(1);
  const [ingredientsPerPage, setIngredientsPerPage] = useState(5);

  useEffect(() => {
    fetch("http://localhost:3001/api/ingredients")
      .then(res => res.json())
      .then(data => setAllIngredients(data));
  }, [open]);

  useEffect(() => {
    setName(initialData?.name || "");
    setInstructions(initialData?.instructions || "");
    setCategoryId(initialData?.categoryId || "");
    setIngredients(
      initialData?.ingredients?.length
        ? initialData.ingredients.map(di => ({
            ingredientId: di.ingredient?.id || di.ingredientId,
            name: di.ingredient?.name || "",
            amount: di.amount || ""
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
  const handleRemoveIngredient = idx => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };
  const handleIngredientChange = (idx, field, value) => {
    setIngredients(ingredients.map((ing, i) =>
      i === idx ? { ...ing, [field]: value } : ing
    ));
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
        <h3>{initialData ? "Editar Bebida" : "Cadastrar Bebida"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              name,
              instructions,
              categoryId: categoryId,
              ingredients: ingredients.map(ing => ({
                ingredientId: Number(ing.ingredientId),
                amount: ing.amount
              }))
            });
          }}
        >
          <label>Nome da Bebida*</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <label>Instrução</label>
          <input value={instructions} onChange={e => setInstructions(e.target.value)} />
          <label>Categoria*</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Selecione</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <label>Ingredientes</label>
          {paginatedIngredients.map((ing, idx) => {
            const realIdx = (ingredientPage - 1) * ingredientsPerPage + idx;
            return (
              <div key={realIdx} className={styles.ingredientRow}>
                <select
                  value={ing.ingredientId}
                  onChange={e => handleIngredientChange(realIdx, "ingredientId", e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {allIngredients.map(ingr => (
                    <option key={ingr.id} value={ingr.id}>{ingr.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Quantidade"
                  value={ing.amount}
                  onChange={e => handleIngredientChange(realIdx, "amount", e.target.value)}
                  style={{ width: 100, marginLeft: 8 }}
                  required
                />
                <button type="button" onClick={() => handleRemoveIngredient(realIdx)} className={styles.removeBtn}>-</button>
              </div>
            );
          })}
          <Pagination
            page={ingredientPage}
            totalPages={totalIngredientPages}
            rowsPerPage={ingredientsPerPage}
            setRowsPerPage={setIngredientsPerPage}
            setPage={setIngredientPage}
            totalRows={ingredients.length}
          />
          <button type="button" onClick={handleAddIngredient} className={styles.addBtn}>+ Adicionar Ingrediente</button>
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.confirm}>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DrinkModal;
