import { motion } from 'framer-motion'
import type { BikeTypeInfo } from '../config/parts'
import styles from './BikeTypeCard.module.css'

interface BikeTypeCardProps {
  bikeType: BikeTypeInfo
  selected: boolean
  onSelect: (id: BikeTypeInfo['id']) => void
}

export function BikeTypeCard({ bikeType, selected, onSelect }: BikeTypeCardProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(bikeType.id)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
    >
      <div className={styles.imageWrap}>
        <img src={bikeType.image} alt="" className={styles.image} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{bikeType.name}</h3>
          {selected && <span className={styles.check}>✓</span>}
        </div>
        <p className={styles.description}>{bikeType.description}</p>
        <p className={styles.hint}>{bikeType.hint}</p>
      </div>
    </motion.button>
  )
}
