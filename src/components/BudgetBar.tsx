import { formatPrice } from '../utils/format'
import styles from './BudgetBar.module.css'

export function BudgetBar({ budget, spent }: { budget: number; spent: number }) {
  const percent = Math.min(100, (spent / budget) * 100)
  const over = spent > budget

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span>
          Bisher: <strong>{formatPrice(spent)}</strong>
        </span>
        <span className={over ? styles.over : undefined}>
          Budget: {formatPrice(budget)}
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
