import React from 'react'
import styles from './CardCategory.module.css'

function CardCategory(props) {
  
  const { category, icon, onClick } = props

  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <div className={styles.card}>
        <img className={styles.cardImage} src={icon} alt={category} />
        <h2 className={styles.cardTitle}>{category}</h2>
      </div>
    </div>
  )
}

export default CardCategory
