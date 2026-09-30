import { motion } from 'framer-motion'
import {
  getConfiguredPrice,
  getConfiguredWeight,
  getSelectedVariantOptions,
  type PartSpec,
  type VariantGroup,
  type VariantSelection,
} from '../config/parts'
import { formatPrice, formatWeight } from '../utils/format'
import { VARIANT_HINTS } from '../config/hints'
import styles from './PartDetails.module.css'

interface PartDetailsPart {
  name: string
  brand?: string
  price: number
  weight?: number
  specs?: PartSpec[]
  variants?: VariantGroup[]
}

interface PartDetailsProps {
  part: PartDetailsPart
  selection: VariantSelection
  onChange: (groupId: string, optionId: string) => void
  /** Von anderen Teilen festgelegte Unterauswahlen – nur die passende Option ist wählbar. */
  locked?: VariantSelection
}

/**
 * Detail-Panel unter der Auswahl-Grid: technische Daten des gewählten Teils
 * plus Unterauswahlen (Größe, Oberfläche, Felgenhöhe, …). Specs einer
 * gewählten Option (z. B. Gewicht je Felgenhöhe) werden mit angezeigt.
 */
export function PartDetails({ part, selection, onChange, locked = {} }: PartDetailsProps) {
  const selected = getSelectedVariantOptions(part, selection)
  const optionSpecs = selected.flatMap(({ option }) => option.specs ?? [])
  const weight = getConfiguredWeight(part, selection)
  const specs = [
    ...(weight !== undefined ? [{ label: 'Gesamtgewicht', value: formatWeight(weight) }] : []),
    ...(part.specs ?? []),
    ...optionSpecs,
  ]

  if (selected.length === 0 && specs.length === 0) return null

  return (
    <motion.section
      className={styles.panel}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <header className={styles.header}>
        <div>
          {part.brand && <span className={styles.eyebrow}>{part.brand}</span>}
          <h3 className={styles.title}>{part.name} konfigurieren</h3>
        </div>
        <span className={styles.price}>
          {formatPrice(getConfiguredPrice(part, selection))}
          {weight !== undefined && <span className={styles.weight}>{formatWeight(weight)}</span>}
        </span>
      </header>

      {selected.map(({ group, option: activeOption }) => (
        <fieldset key={group.id} className={styles.group}>
          <legend className={styles.groupLabel}>
            {group.label}
            {locked[group.id] && <span className={styles.lockedHint}> · passend zu deiner Auswahl</span>}
          </legend>
          {VARIANT_HINTS[group.id] && <p className={styles.variantHint}>{VARIANT_HINTS[group.id]}</p>}
          <div className={styles.pills}>
            {group.options.map((option) => {
              const active = option.id === activeOption.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.pill} ${active ? styles.pillActive : ''}`}
                  aria-pressed={active}
                  disabled={Boolean(locked[group.id]) && !active}
                  onClick={() => onChange(group.id, option.id)}
                >
                  {option.label}
                  {option.priceDelta ? ` (+${formatPrice(option.priceDelta)})` : ''}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      {specs.length > 0 && (
        <dl className={styles.specs}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.specRow}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </motion.section>
  )
}
