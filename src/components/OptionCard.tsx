import { motion } from 'framer-motion'
import { formatPrice, formatWeight } from '../utils/format'
import styles from './OptionCard.module.css'

interface OptionCardOption {
  id: string
  name: string
  description: string
  price: number
  image: string
  hint?: string
}

interface OptionCardProps {
  option: OptionCardOption
  selected: boolean
  onSelect: (id: string) => void
  overBudget?: boolean
  /** Kategorie-Kennzeichnung, z. B. "Alu", "Carbon", "2x mechanisch". */
  badge?: string
  /** Gesamtgewicht des Teils in Gramm (inkl. gewählter Unterauswahl). */
  weight?: number
  /** Passt am besten zum Budget – wird hervorgehoben. */
  recommended?: boolean
}

export function OptionCard({ option, selected, onSelect, overBudget, badge, weight, recommended }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.card} ${recommended ? styles.cardRecommended : ''} ${selected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(option.id)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
    >
      <div className={styles.imageWrap}>
        {badge && <span className={styles.badge}>{badge}</span>}
        {recommended && <span className={styles.recommended}>Passt zu deinem Budget</span>}
        <img src={option.image} alt="" className={styles.image} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{option.name}</h3>
          {selected && <span className={styles.check}>✓</span>}
        </div>
        <p className={styles.description}>{option.description}</p>
        {option.hint && <p className={styles.hint}>{option.hint}</p>}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {formatPrice(option.price)}
            {weight !== undefined && <span className={styles.weight}> · {formatWeight(weight)}</span>}
          </span>
          {overBudget && !recommended && <span className={styles.warning}>sprengt dein Budget</span>}
        </div>
      </div>
    </motion.button>
  )
}
