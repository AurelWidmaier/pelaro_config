import { motion } from 'framer-motion'
import { formatPrice } from '../utils/format'
import styles from './OptionCard.module.css'

interface OptionCardOption {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface OptionCardProps {
  option: OptionCardOption
  selected: boolean
  onSelect: (id: string) => void
  overBudget?: boolean
  /** Kategorie-Kennzeichnung, z. B. "Alu", "Carbon", "2x mechanisch". */
  badge?: string
}

export function OptionCard({ option, selected, onSelect, overBudget, badge }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(option.id)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
    >
      <div className={styles.imageWrap}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <img src={option.image} alt="" className={styles.image} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{option.name}</h3>
          {selected && <span className={styles.check}>✓</span>}
        </div>
        <p className={styles.description}>{option.description}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(option.price)}</span>
          {overBudget && <span className={styles.warning}>sprengt dein Budget</span>}
        </div>
      </div>
    </motion.button>
  )
}
