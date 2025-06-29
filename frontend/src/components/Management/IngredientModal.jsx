import React, { useState, useEffect } from "react";
import styles from "./IngredientModal.module.css";

function IngredientModal({ open, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{initialData ? "Editar Ingrediente" : "Cadastrar Ingrediente"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({ name });
          }}
        >
          <label>Nome do Ingrediente*</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.confirm}>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngredientModal;
