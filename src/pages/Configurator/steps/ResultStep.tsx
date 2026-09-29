import { Link } from 'react-router-dom'
import { useConfigurator } from '../../../context/ConfiguratorContext'
import { getBikeTypeInfo, getFrameById, getGroupsetById, getWheelsById } from '../../../config/parts'
import { formatPrice } from '../../../utils/format'
import { BikeCanvas } from '../../../components/BikeCanvas'
import { StepShell } from '../StepShell'
import styles from './ResultStep.module.css'

export function ResultStep() {
  const { bikeType, budget, totalPrice, frameId, groupsetId, wheelsId, goBack, reset } =
    useConfigurator()

  const bikeTypeInfo = getBikeTypeInfo(bikeType)
  const frame = getFrameById(frameId)
  const groupset = getGroupsetById(groupsetId)
  const wheels = getWheelsById(wheelsId)
  const overBudget = totalPrice > budget

  return (
    <StepShell
      eyebrow="Dein Ergebnis"
      title="So sieht dein Bike aus"
      intro="Zusammengesetzt aus deinen ausgewählten Teilen. Du kannst noch etwas ändern oder von vorn beginnen."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Neu starten
          </button>
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.visual}>
          <BikeCanvas frameId={frameId} groupsetId={groupsetId} wheelsId={wheelsId} />
        </div>

        <div className={styles.summary}>
          <ul className={styles.list}>
            {[
              { label: 'Bike-Typ', option: bikeTypeInfo, price: undefined },
              { label: 'Rahmen', option: frame, price: frame?.price },
              { label: 'Schaltgruppe', option: groupset, price: groupset?.price },
              { label: 'Laufräder', option: wheels, price: wheels?.price },
            ].map(({ label, option, price }) => (
              <li key={label} className={styles.row}>
                <div>
                  <span className={styles.rowLabel}>{label}</span>
                  <span className={styles.rowName}>{option?.name ?? '—'}</span>
                </div>
                <span className={styles.rowPrice}>
                  {price !== undefined ? formatPrice(price) : ''}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span>Gesamtpreis</span>
            <span className={overBudget ? styles.totalOver : styles.totalPrice}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className={styles.budgetNote}>
            {overBudget
              ? `${formatPrice(totalPrice - budget)} über deinem Budget von ${formatPrice(budget)}`
              : `${formatPrice(budget - totalPrice)} unter deinem Budget von ${formatPrice(budget)}`}
          </div>

          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, width: 'fit-content' }}>
            Zur Startseite
          </Link>
        </div>
      </div>
    </StepShell>
  )
}
