import { formatPrice } from '../utils/format'
import styles from './PriceBracketNote.module.css'

export function PriceBracketNote({
  label,
  min,
  max,
}: {
  label: string
  min: number
  max: number
}) {
  return (
    <p className={styles.note}>
      Passend zu deinem Budget schlagen wir {label} in etwa zwischen{' '}
      <strong>{formatPrice(min)}</strong> und <strong>{formatPrice(max)}</strong> vor.
    </p>
  )
}
