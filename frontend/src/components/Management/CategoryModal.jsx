import React, { useState, useEffect } from "react";
import styles from "./CategoryModal.module.css";

function CategoryModal({ open, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{initialData ? "Editar Categoria" : "Cadastrar Categoria"}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({ name, description });
          }}
        >
          <label>Nome da Categoria*</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <label>Descrição</label>
          <input value={description} onChange={e => setDescription(e.target.value)} />
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.confirm}>Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
