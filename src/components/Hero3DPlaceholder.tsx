import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BikeCanvas } from './BikeCanvas'
import styles from './Hero3DPlaceholder.module.css'

/**
 * Platzhalter für den späteren 3D-Bike-Hero (z. B. via Three.js /
 * React Three Fiber). Aktuell wird das 2D-Layer-Composite aus
 * BikeCanvas gezeigt und per Scroll-Position leicht rotiert/verschoben,
 * damit sich das Gefühl der finalen Scroll-Animation schon testen lässt.
 *
 * Beim Austausch gegen ein echtes 3D-Modell: `.stage` durch ein
 * <Canvas>-Element ersetzen und `progress` (0–1, aus useScroll) als
 * Input für Kamera-/Objekt-Rotation weiterverwenden.
 */
export function Hero3DPlaceholder() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const rotateY = useTransform(progress, [0, 1], [-8, 18])
  const translateY = useTransform(progress, [0, 1], [0, 60])
  const scale = useTransform(progress, [0, 1], [1, 0.88])

  return (
    <div ref={ref} className={styles.stage}>
      <motion.div
        className={styles.rig}
        style={{ rotateY, y: translateY, scale }}
      >
        <BikeCanvas
          frameId="frame-race-gravel-carbon"
          wheelsId="wheels-race-gravel-carbon"
          groupsetId="groupset-2x-performance"
          className={styles.bike}
        />
      </motion.div>
      <div className={styles.groundShadow} />
      <span className={styles.badge}>3D-Vorschau folgt</span>
    </div>
  )
}
