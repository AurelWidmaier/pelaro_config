import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import styles from './Lightbox.module.css'

export interface LightboxImage {
  src: string
  alt: string
  /** Freigestellte Bilder (PNG) bekommen den hellen Bildhintergrund der Website. */
  cutout?: boolean
}

interface LightboxProps {
  images: LightboxImage[]
  /** Index des offenen Bildes, `null` = geschlossen. */
  index: number | null
  onIndexChange: (index: number | null) => void
  /** Kleine Überschrift über dem Bild, z. B. der Rahmenname. */
  title?: string
}

const SWIPE_THRESHOLD = 60

/**
 * Vollbild-Ansicht für Bilder: Pfeile, Tastatur (←/→/Esc), Wischen,
 * Klick auf den Hintergrund schließt. Wird per Portal in <body> gerendert.
 */
export function Lightbox({ images, index, onIndexChange, title }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null && images.length > 0
  const count = images.length

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndexChange((index + delta + count) % count)
    },
    [index, count, onIndexChange],
  )
  const close = useCallback(() => onIndexChange(null), [onIndexChange])

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open, close, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1)
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1)
  }

  const current = open ? index : 0
  const image = open ? images[current] : null

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Bildansicht'}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.topBar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.caption}>
              {title && <span className={styles.title}>{title}</span>}
              {count > 1 && (
                <span className={styles.counter}>
                  {current + 1} / {count}
                </span>
              )}
            </div>
            <button ref={closeRef} type="button" className={styles.iconButton} onClick={close} aria-label="Schließen">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className={styles.stage}>
            {count > 1 && (
              <button
                type="button"
                className={`${styles.iconButton} ${styles.arrow} ${styles.arrowLeft}`}
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="Vorheriges Bild"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            )}

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.figure
                key={image.src}
                className={`${styles.frame} ${image.cutout ? styles.frameCutout : ''}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={onDragEnd}
              >
                <img src={image.src} alt={image.alt} className={styles.image} draggable={false} />
              </motion.figure>
            </AnimatePresence>

            {count > 1 && (
              <button
                type="button"
                className={`${styles.iconButton} ${styles.arrow} ${styles.arrowRight}`}
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="Nächstes Bild"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {count > 1 && (
            <div className={styles.thumbs} onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  className={`${styles.thumb} ${i === current ? styles.thumbActive : ''} ${img.cutout ? styles.thumbCutout : ''}`}
                  onClick={() => onIndexChange(i)}
                  aria-label={`Bild ${i + 1}`}
                  aria-current={i === current}
                >
                  <img src={img.src} alt="" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
