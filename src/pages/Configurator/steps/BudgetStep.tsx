import { useConfigurator } from '../../../context/ConfiguratorContext'
import { BUDGET_RANGE } from '../../../config/parts'
import { formatPrice } from '../../../utils/format'
import { StepShell } from '../StepShell'
import styles from './BudgetStep.module.css'

export function BudgetStep() {
  const { budget, setBudget, goNext, goBack } = useConfigurator()

  return (
    <StepShell
      eyebrow="Schritt 2 von 5"
      title="Wie viel möchtest du ausgeben?"
      intro="Keine Sorge, das ist nur eine Orientierung – du kannst dich später trotzdem für teurere oder günstigere Teile entscheiden."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Weiter
          </button>
        </>
      }
    >
      <div className={styles.card}>
        <div className={styles.amount}>{formatPrice(budget)}</div>

        <input
          type="range"
          min={BUDGET_RANGE.min}
          max={BUDGET_RANGE.max}
          step={BUDGET_RANGE.step}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className={styles.slider}
          aria-label="Budget in Euro"
        />

        <div className={styles.rangeLabels}>
          <span>{formatPrice(BUDGET_RANGE.min)}</span>
          <span>{formatPrice(BUDGET_RANGE.max)}</span>
        </div>

        <label className={styles.numberField}>
          Genauer Betrag
          <input
            type="number"
            min={BUDGET_RANGE.min}
            max={BUDGET_RANGE.max}
            step={BUDGET_RANGE.step}
            value={budget}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (!Number.isNaN(value)) setBudget(value)
            }}
          />
        </label>
      </div>
    </StepShell>
  )
}
