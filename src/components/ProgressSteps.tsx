import { STEP_ORDER, type StepId } from '../context/ConfiguratorContext'
import styles from './ProgressSteps.module.css'

const LABELS: Record<StepId, string> = {
  biketype: 'Bike-Typ',
  budget: 'Budget',
  frame: 'Rahmen',
  groupset: 'Schaltung',
  wheels: 'Laufräder',
  result: 'Ergebnis',
}

export function ProgressSteps({ current }: { current: StepId }) {
  const currentIndex = STEP_ORDER.indexOf(current)

  return (
    <ol className={styles.list} aria-label="Fortschritt">
      {STEP_ORDER.map((step, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'upcoming'
        return (
          <li key={step} className={styles.item} data-state={state}>
            <span className={styles.dot}>{state === 'done' ? '✓' : i + 1}</span>
            <span className={styles.label}>{LABELS[step]}</span>
          </li>
        )
      })}
    </ol>
  )
}
