import { Link } from 'react-router-dom'
import { useConfigurator } from '../../../context/ConfiguratorContext'
import {
  getBikeTypeInfo,
  getConfiguredPrice,
  getConfiguredWeight,
  getFrameById,
  getGroupsetById,
  getSelectedVariantOptions,
  getWheelsById,
  type VariantSelection,
} from '../../../config/parts'
import { formatPrice, formatWeight } from '../../../utils/format'
import { BikeCanvas } from '../../../components/BikeCanvas'
import { StepShell } from '../StepShell'
import styles from './ResultStep.module.css'

export function ResultStep() {
  const {
    bikeType,
    budget,
    totalPrice,
    totalWeight,
    weightIncomplete,
    frameId,
    frameVariants,
    groupsetId,
    groupsetVariants,
    wheelsId,
    wheelsVariants,
    goBack,
    reset,
  } = useConfigurator()

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
              { label: 'Bike-Typ', option: bikeTypeInfo, url: undefined, price: undefined, weight: undefined, variants: '' },
              {
                label: 'Rahmen',
                option: frame,
                url: frame?.url,
                price: frame ? getConfiguredPrice(frame, frameVariants) : undefined,
                weight: getConfiguredWeight(frame, frameVariants),
                variants: describeVariants(frame, frameVariants),
              },
              {
                label: 'Schaltgruppe',
                option: groupset,
                url: groupset?.url,
                price: groupset ? getConfiguredPrice(groupset, groupsetVariants) : undefined,
                weight: getConfiguredWeight(groupset, groupsetVariants),
                variants: describeVariants(groupset, groupsetVariants),
              },
              {
                label: 'Laufräder',
                option: wheels,
                url: wheels?.url,
                price: wheels ? getConfiguredPrice(wheels, wheelsVariants) : undefined,
                weight: getConfiguredWeight(wheels, wheelsVariants),
                variants: describeVariants(wheels, wheelsVariants),
              },
            ].map(({ label, option, url, price, weight, variants }) => {
              const content = (
                <>
                  <div>
                    <span className={styles.rowLabel}>{label}</span>
                    <span className={styles.rowName}>
                      {option?.name ?? '—'}
                      {url && (
                        <span className={styles.rowLinkIcon} aria-hidden="true">
                          ↗
                        </span>
                      )}
                    </span>
                    {variants && <span className={styles.rowVariants}>{variants}</span>}
                  </div>
                  <span className={styles.rowPrice}>
                    {price !== undefined ? formatPrice(price) : ''}
                    {weight !== undefined && <span className={styles.rowWeight}>{formatWeight(weight)}</span>}
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`${styles.row} ${styles.rowLink}`}
                      title={`${option?.name} beim Händler ansehen`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={styles.row}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className={styles.totalRow}>
            <span>Gesamtpreis</span>
            <span className={overBudget ? styles.totalOver : styles.totalPrice}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span>Gesamtgewicht</span>
            <span className={styles.totalPrice}>
              {totalWeight > 0 ? `${weightIncomplete ? 'mind. ' : ''}${formatWeight(totalWeight)}` : '—'}
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

/** Kurzbeschreibung der Unterauswahl, z. B. "Rahmengröße 54 cm · Matt". */
function describeVariants(
  part: Parameters<typeof getSelectedVariantOptions>[0],
  selection: VariantSelection,
): string {
  return getSelectedVariantOptions(part, selection)
    .map(({ group, option }) => `${group.label} ${option.label}`)
    .join(' · ')
}
