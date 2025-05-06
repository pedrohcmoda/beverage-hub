import React from 'react'
import styles from './CardCategory.module.css'

function CardCategory(props) {
  
  const { category, icon } = props

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <img className={styles.cardImage} src={icon} alt="" />
        <h2 className={styles.cardTitle}>{category}</h2>
      </div>
    </div>
  )
}

export default CardCategory
