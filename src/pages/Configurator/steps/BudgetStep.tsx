import { useConfigurator } from '../../../context/ConfiguratorContext'
import { clampBudget, getBudgetRange } from '../../../config/budget'
import { BeginnerTip } from '../../../components/BeginnerTip'
import { formatPrice } from '../../../utils/format'
import { StepShell } from '../StepShell'
import styles from './BudgetStep.module.css'

export function BudgetStep() {
  const { bikeType, budget, setBudget, goNext, goBack } = useConfigurator()
  const range = getBudgetRange(bikeType)
  const value = clampBudget(budget, range)

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
        <div className={styles.amount}>{formatPrice(value)}</div>

        <input
          type="range"
          min={range.min}
          max={range.max}
          step={range.step}
          value={value}
          onChange={(e) => setBudget(Number(e.target.value))}
          className={styles.slider}
          aria-label="Budget in Euro"
        />

        <div className={styles.rangeLabels}>
          <span>
            {formatPrice(range.min)}
            <small>günstigstes Bike</small>
          </span>
          <span className={styles.right}>
            {formatPrice(range.max)}
            <small>teuerstes Bike</small>
          </span>
        </div>
        <p className={styles.rangeNote}>
          Die Spanne reicht vom günstigsten bis zum teuersten Bike, das du aus unseren Teilen zusammenstellen kannst –
          ohne Versand.
        </p>
      </div>

      <BeginnerTip>
        Nimm eher <strong>den unteren Bereich</strong>, wenn du einsteigst oder erst mal schauen willst, ob dir der Sport
        liegt – auch dort bekommst du ein solides Carbon-Bike. Nimm <strong>den oberen Bereich</strong>, wenn dir
        geringes Gewicht, elektronisches Schalten und schnelle Laufräder wichtig sind.
      </BeginnerTip>
    </StepShell>
  )
}
