import React, { useEffect } from "react";
import styles from "./Popup.module.css";

const Popup = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={styles.popup}>
      <span>{message}</span>
    </div>
  );
};

export default Popup;
