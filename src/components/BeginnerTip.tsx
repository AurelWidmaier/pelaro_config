import type { ReactNode } from 'react'
import styles from './BeginnerTip.module.css'

/** Hinweis für Einsteiger: „Nimm das, wenn …“. */
export function BeginnerTip({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className={`${styles.tip} ${compact ? styles.compact : ''}`}>
      <span className={styles.label}>Einsteiger-Tipp</span>
      <div className={styles.text}>{children}</div>
    </div>
  )
}
