import { formatPrice, formatWeight } from '../utils/format'
import styles from './BudgetBar.module.css'

interface BudgetBarProps {
  budget: number
  spent: number
  /** Gesamtgewicht der bisher gewählten Teile in Gramm. */
  weight: number
  /** Mindestens ein gewähltes Teil hat keine Gewichtsangabe. */
  weightIncomplete?: boolean
}

export function BudgetBar({ budget, spent, weight, weightIncomplete }: BudgetBarProps) {
  const percent = Math.min(100, (spent / budget) * 100)
  const over = spent > budget

  return (
    <div className={styles.wrap}>
      <div className={styles.totals}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Gesamtpreis</span>
          <strong className={over ? styles.over : undefined}>{formatPrice(spent)}</strong>
        </div>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Gesamtgewicht</span>
          <strong title={weightIncomplete ? 'Nicht alle gewählten Teile haben eine Gewichtsangabe' : undefined}>
            {weight > 0 ? `${weightIncomplete ? 'mind. ' : ''}${formatWeight(weight)}` : '—'}
          </strong>
        </div>
      </div>
      <div className={styles.row}>
        <span>Budget: {formatPrice(budget)}</span>
        <span className={over ? styles.over : undefined}>
          {over ? `${formatPrice(spent - budget)} drüber` : `${formatPrice(budget - spent)} übrig`}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${over ? styles.fillOver : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {over && (
        <p className={styles.overNote}>
          Du liegst {formatPrice(spent - budget)} über deinem Budget – du kannst trotzdem
          weitermachen und später etwas austauschen.
        </p>
      )}
    </div>
  )
}
