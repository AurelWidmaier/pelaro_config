import { useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { getFrameById, getGroupsetById, getWheelsById } from '../config/parts'
import { useCompleteBikeImages } from '../config/bikeImages'
import { LAYER_POSITIONS, type LayerSlot } from '../config/layerPositions'
import { Lightbox } from './Lightbox'
import styles from './BikeCanvas.module.css'

interface BikeCanvasProps {
  frameId: string | null
  groupsetId?: string | null
  wheelsId?: string | null
  className?: string
  /**
   * Innenabstand des umgebenden Rahmens in px. Das Foto (JPG) ragt um diesen
   * Wert hinaus und füllt so die ganze Bildfläche; die Rundung kommt vom Rahmen.
   */
  bleed?: number
}

/** Mindestweg in px, ab dem ein Wischen als Bildwechsel zählt. */
const SWIPE_THRESHOLD = 50

/**
 * Setzt das Bike-Bild aus einzelnen, freigestellten Layern zusammen:
 * Rahmen (Basis) -> Laufräder -> optionale Anbauteile (z. B. Schaltgruppe).
 * Die Position jedes Layers kommt aus `layerPositions.ts` und ist pro
 * Bike-Typ (Rahmengeometrie) konfigurierbar.
 * Gibt es in cdn/bikes/ fertige Bilder für genau diese Kombination, werden
 * stattdessen diese gezeigt: erst das freigestellte PNG, per Klick oder Wischen
 * das Foto aus cdn/bikes/jpg/ (siehe config/bikeImages.ts).
 */
export function BikeCanvas({ frameId, groupsetId, wheelsId, className, bleed = 0 }: BikeCanvasProps) {
  const frame = getFrameById(frameId)
  const groupset = getGroupsetById(groupsetId ?? null)
  const wheels = getWheelsById(wheelsId ?? null)
  const { cutout, photo } = useCompleteBikeImages(frame?.imageKey, wheels?.imageKey, groupset?.imageKey)
  const [slideState, setSlideState] = useState<{ key: string; index: number }>({ key: '', index: 0 })
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null)

  if (!frame) {
    return (
      <div className={`${styles.canvas} ${styles.empty} ${className ?? ''}`}>
        <span>Noch kein Rahmen ausgewählt</span>
      </div>
    )
  }

  // Fertige Komplettbike-Bilder für genau diese Kombination haben Vorrang vor den Layern.
  const slides = [
    ...(cutout ? [{ src: cutout, kind: 'cutout' as const }] : []),
    ...(photo ? [{ src: photo, kind: 'photo' as const }] : []),
  ]
  if (slides.length > 0) {
    const slidesKey = slides.map((s) => s.src).join('|')
    // Neue Auswahl -> wieder beim ersten Bild anfangen
    const index = slideState.key === slidesKey ? Math.min(slideState.index, slides.length - 1) : 0
    const slide = slides[index]
    const hasGallery = slides.length > 1
    const go = (next: number) => setSlideState({ key: slidesKey, index: (next + slides.length) % slides.length })
    const onDragEnd = (_: unknown, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) go(index + 1)
      else if (info.offset.x > SWIPE_THRESHOLD) go(index - 1)
    }

    return (
      <div
        className={`${styles.canvas} ${bleed ? styles.canvasBleed : ''} ${className ?? ''}`}
        style={{ '--bleed': `${bleed}px` } as CSSProperties}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={frame.name}
            draggable={false}
            className={`${slide.kind === 'photo' ? styles.photo : styles.base} ${hasGallery ? styles.clickable : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            {...(hasGallery
              ? {
                  drag: 'x' as const,
                  dragConstraints: { left: 0, right: 0 },
                  dragElastic: 0.4,
                  onDragEnd,
                  onTap: () => go(index + 1),
                }
              : {})}
          />
        </AnimatePresence>
        <span className={styles.aiNote}>KI-Bild · nur Vorschau · Gewicht geschätzt</span>
        <button
          type="button"
          className={styles.fullscreenButton}
          onClick={() => setFullscreenIndex(index)}
          aria-label="Bild im Vollbild anzeigen"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
        <Lightbox
          images={slides.map((s) => ({ src: s.src, alt: frame.name, cutout: s.kind === 'cutout' }))}
          index={fullscreenIndex}
          onIndexChange={(next) => {
            setFullscreenIndex(next)
            if (next !== null) go(next)
          }}
          title={`${frame.name} · KI-Vorschau`}
        />
        {hasGallery && (
          <div className={styles.dots} role="tablist" aria-label="Bilder">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={s.kind === 'photo' ? 'Foto' : 'Freigestellt'}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const layerConfig = LAYER_POSITIONS[frame.bikeType]
  // Echte Rahmenfotos haben eine eigene Geometrie – Platzhalter-Layer würden danebenliegen.
  const showLayers = !frame.photo

  return (
    <div className={`${styles.canvas} ${className ?? ''}`}>
      <img src={frame.image} alt={frame.name} className={styles.base} />

      {showLayers && wheels && !wheels.photo && (
        <>
          <img
            src={wheels.image}
            alt=""
            className={styles.layer}
            style={slotStyle(layerConfig.wheelRear)}
          />
          <img
            src={wheels.image}
            alt=""
            className={styles.layer}
            style={slotStyle(layerConfig.wheelFront)}
          />
        </>
      )}

      {showLayers && groupset && !groupset.photo && (
        <motion.img
          src={groupset.image}
          alt=""
          className={styles.layer}
          style={slotStyle(layerConfig.groupset)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  )
}

function slotStyle(slot: LayerSlot) {
  return {
    left: `${slot.xPercent}%`,
    top: `${slot.yPercent}%`,
    width: `${slot.widthPercent * slot.scale}%`,
    zIndex: slot.zIndex,
  }
}
