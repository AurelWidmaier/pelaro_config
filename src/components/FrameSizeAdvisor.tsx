import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CatalogFrame } from '../config/parts'
import { RIDER_LIMITS, recommendFrameSize, type RiderMeasures } from '../config/frameSize'
import styles from './FrameSizeAdvisor.module.css'

interface FrameSizeAdvisorProps {
  frame: CatalogFrame
  currentSize?: string
  rider: RiderMeasures
  onRiderChange: (rider: RiderMeasures) => void
  onApply: (sizeId: string) => void
}

function parseMeasure(value: string, limits: { min: number; max: number }): number | undefined {
  const n = Number(value.replace(',', '.'))
  return Number.isFinite(n) && n >= limits.min && n <= limits.max ? Math.round(n) : undefined
}

/** „Welche Rahmengröße passt?“ – optional, lässt sich überspringen. */
export function FrameSizeAdvisor({ frame, currentSize, rider, onRiderChange, onApply }: FrameSizeAdvisorProps) {
  const [open, setOpen] = useState(true)
  const [height, setHeight] = useState(rider.height ? String(rider.height) : '')
  const [inseam, setInseam] = useState(rider.inseam ? String(rider.inseam) : '')
  const [showHowTo, setShowHowTo] = useState(false)

  const advice = recommendFrameSize(frame, rider)
  const heightInvalid = height !== '' && parseMeasure(height, RIDER_LIMITS.height) === undefined
  const inseamInvalid = inseam !== '' && parseMeasure(inseam, RIDER_LIMITS.inseam) === undefined

  const update = (nextHeight: string, nextInseam: string) =>
    onRiderChange({
      height: parseMeasure(nextHeight, RIDER_LIMITS.height),
      inseam: parseMeasure(nextInseam, RIDER_LIMITS.inseam),
    })

  if (!open) {
    return (
      <button type="button" className={styles.reopen} onClick={() => setOpen(true)}>
        Rahmengröße berechnen
      </button>
    )
  }

  return (
    <motion.section
      className={styles.panel}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-labelledby="size-advisor-title"
    >
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Größenrechner</span>
          <h3 id="size-advisor-title" className={styles.title}>
            Welche Rahmengröße passt zu dir?
          </h3>
          <p className={styles.intro}>
            Gib deine Körpergröße ein – mit Schrittlänge wird die Empfehlung genauer. Du kannst das auch überspringen und
            die Größe selbst wählen.
          </p>
        </div>
        <button type="button" className={styles.skip} onClick={() => setOpen(false)}>
          Überspringen
        </button>
      </header>

      <div className={styles.fields}>
        <label className={styles.field}>
          Körpergröße
          <span className={styles.inputWrap}>
            <input
              inputMode="numeric"
              placeholder="z. B. 178"
              value={height}
              aria-invalid={heightInvalid}
              onChange={(e) => {
                setHeight(e.target.value)
                update(e.target.value, inseam)
              }}
            />
            <span className={styles.unit}>cm</span>
          </span>
          {heightInvalid && (
            <span className={styles.error}>
              Bitte zwischen {RIDER_LIMITS.height.min} und {RIDER_LIMITS.height.max} cm.
            </span>
          )}
        </label>
        <label className={styles.field}>
          Schrittlänge <span className={styles.optional}>(optional)</span>
          <span className={styles.inputWrap}>
            <input
              inputMode="numeric"
              placeholder="z. B. 84"
              value={inseam}
              aria-invalid={inseamInvalid}
              onChange={(e) => {
                setInseam(e.target.value)
                update(height, e.target.value)
              }}
            />
            <span className={styles.unit}>cm</span>
          </span>
          {inseamInvalid && (
            <span className={styles.error}>
              Bitte zwischen {RIDER_LIMITS.inseam.min} und {RIDER_LIMITS.inseam.max} cm.
            </span>
          )}
        </label>
      </div>

      <button type="button" className={styles.howToToggle} onClick={() => setShowHowTo((v) => !v)}>
        {showHowTo ? 'Anleitung ausblenden' : 'So misst du deine Schrittlänge'}
      </button>
      {showHowTo && (
        <ol className={styles.howTo}>
          <li>Schuhe aus, mit dem Rücken gerade an eine Wand stellen, Füße etwa 15 cm auseinander.</li>
          <li>Ein Buch hochkant zwischen die Beine klemmen und fest nach oben ziehen – wie ein Sattel.</li>
          <li>Den Abstand von der Buch-Oberkante bis zum Boden messen. Das ist deine Schrittlänge.</li>
        </ol>
      )}

      {advice && (
        <div className={styles.result} aria-live="polite">
          <div className={styles.resultMain}>
            <span className={styles.resultLabel}>Unsere Empfehlung</span>
            <span className={styles.resultSize}>{advice.sizeId} cm</span>
            {advice.alternativeId && (
              <span className={styles.resultAlt}>
                oder {advice.alternativeId} cm –{' '}
                {Number(advice.alternativeId) < Number(advice.sizeId)
                  ? 'kleiner fährt sich sportlicher und wendiger'
                  : 'größer sitzt du gestreckter und etwas komfortabler'}
              </span>
            )}
          </div>
          <ul className={styles.reasons}>
            {advice.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            {currentSize === advice.sizeId ? (
              <span className={styles.applied}>✓ Größe {advice.sizeId} ist ausgewählt</span>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => onApply(advice.sizeId)}>
                Größe {advice.sizeId} übernehmen
              </button>
            )}
          </div>
          <p className={styles.disclaimer}>
            Richtwert ohne Gewähr – bei Unsicherheit lohnt sich eine Probefahrt oder ein Bikefitting.
          </p>
        </div>
      )}
    </motion.section>
  )
}
