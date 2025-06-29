import React from "react";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
  message,
  show,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <span className={styles.message}>{message}</span>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
