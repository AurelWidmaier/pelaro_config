import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toolImage, type Tool, type ToolList } from '../config/tools'
import { exportToolsPdf } from '../utils/exportToolsPdf'
import styles from './ToolChecklist.module.css'

interface ToolChecklistProps {
  list: ToolList
  bikeName: string
}

function ToolItem({ tool, reason }: { tool: Tool; reason?: string }) {
  return (
    <li className={styles.item}>
      <img className={styles.thumb} src={toolImage(tool)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
      <div className={styles.itemBody}>
        <span className={styles.itemName}>
          {tool.name}
          {!tool.essential && <span className={styles.optional}>empfohlen</span>}
        </span>
        <span className={styles.itemDesc}>{reason ? `${reason} ${tool.description}` : tool.description}</span>
      </div>
      {tool.url ? (
        <a className={styles.itemLink} href={tool.url} target="_blank" rel="noreferrer">
          Ansehen ↗
        </a>
      ) : (
        <span className={styles.itemSoon}>Link folgt</span>
      )}
    </li>
  )
}

/** Ausklappbare Werkzeugliste mit PDF-Download für die Ergebnisansicht. */
export function ToolChecklist({ list, bikeName }: ToolChecklistProps) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const count = list.specific.length + list.general.length

  async function download() {
    setExporting(true)
    try {
      await exportToolsPdf({ bikeName, list })
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className={styles.panel}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="tool-checklist"
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          <span className={styles.eyebrow}>Für den Aufbau</span>
          <span className={styles.title}>Werkzeugliste ({count} Teile)</span>
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="tool-checklist"
            className={styles.content}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.inner}>
              {list.specific.length > 0 && (
                <>
                  <h4 className={styles.groupTitle}>Speziell für dein Bike</h4>
                  <ul className={styles.list}>
                    {list.specific.map(({ tool, reason }) => (
                      <ToolItem key={tool.id} tool={tool} reason={reason} />
                    ))}
                  </ul>
                </>
              )}
              <h4 className={styles.groupTitle}>Allgemeines Werkzeug</h4>
              <ul className={styles.list}>
                {list.general.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </ul>
              <div className={styles.actions}>
                <button type="button" className="btn btn-primary" onClick={download} disabled={exporting}>
                  {exporting ? 'PDF wird erstellt …' : 'Werkzeugliste als PDF'}
                </button>
                <Link to="/shop?kategorie=werkzeug" className="btn btn-ghost">
                  Zum Werkzeug-Shop
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
