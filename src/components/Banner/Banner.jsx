import React from 'react'
import styles from './Banner.module.css'

function Banner() {
  return (
    <div className={styles.container}>
      <img src="/src/assets/drinks.jpg" alt="Drinks" />
      <p className={styles.text}>Your next favorite drink awaits!</p>
    </div>
  )
}

export default Banner
