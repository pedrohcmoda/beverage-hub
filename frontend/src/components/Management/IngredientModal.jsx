import React, { useState, useEffect } from "react";
import styles from "./IngredientModal.module.css";

function IngredientModal({ open, onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{initialData ? "Edit Ingredient" : "Add Ingredient"}</h3>
        {errorMessage && (
          <div className={styles.errorMessage} style={{ color: 'red', marginBottom: 8 }}>
            {errorMessage}
          </div>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMessage("");
            try {
              const result = await onSave({ name });
              if (result && result.error) {
                setErrorMessage(result.error);
              }
            } catch (err) {
              setErrorMessage(err?.message || "Erro ao salvar. Tente novamente.");
            }
          }}
        >
          <label>Ingredient Name*</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
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

export default IngredientModal;
