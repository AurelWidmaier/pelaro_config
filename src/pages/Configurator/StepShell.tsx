import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import styles from './StepShell.module.css'

interface StepShellProps {
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
  footer?: ReactNode
}

/** Gemeinsames Layout + Ein-/Ausblende-Animation für jeden Konfigurator-Schritt. */
export function StepShell({ eyebrow, title, intro, children, footer }: StepShellProps) {
  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h1 className={styles.title}>{title}</h1>
      {intro && <p className={styles.intro}>{intro}</p>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </motion.div>
  )
}
