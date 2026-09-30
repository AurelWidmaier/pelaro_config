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
      Für dein Budget empfehlen wir {label} für etwa <strong>{formatPrice(min)}</strong> bis{' '}
      <strong>{formatPrice(max)}</strong>. Die passendste Option ist hervorgehoben – links findest du Günstigeres,
      rechts Teureres.
    </p>
  )
}
