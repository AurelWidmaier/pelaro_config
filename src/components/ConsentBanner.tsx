import { useState } from 'react'
import { getConsent, setConsent, type Consent } from '../lib/analytics'
import styles from './ConsentBanner.module.css'

/** Fragt einmalig nach der Einwilligung für die anonyme Besucher-ID. */
export function ConsentBanner() {
  const [decided, setDecided] = useState(() => getConsent() !== null)
  if (decided) return null

  const choose = (value: Consent) => {
    setConsent(value)
    setDecided(true)
  }

  return (
    <div className={styles.banner} role="dialog" aria-label="Einwilligung Statistik">
      <p className={styles.text}>
        Wir zählen Besuche, um die Seite zu verbessern. Mit deiner Zustimmung speichern wir dafür eine
        zufällige Besucher-ID in deinem Browser – ohne Namen, ohne Werbung, ohne Weitergabe an Dritte.
      </p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-ghost" onClick={() => choose('denied')}>
          Ablehnen
        </button>
        <button type="button" className="btn btn-primary" onClick={() => choose('granted')}>
          Einverstanden
        </button>
      </div>
    </div>
  )
}
