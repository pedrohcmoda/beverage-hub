import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h3 className={styles.footerTitle}>BeverageHub</h3>
      </div>
    </footer>
  );
}

export default Footer;