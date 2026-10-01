import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ASSET_BASE } from '../config/assets'
import styles from './Hero3DPlaceholder.module.css'

/** Freigestelltes Komplettbike für den Hero (cdn/bikes/). */
const HERO_BIKE = `${ASSET_BASE}/bikes/bxtGravel135_slr_er7.png`

/**
 * Platzhalter für den späteren 3D-Bike-Hero (z. B. via Three.js /
 * React Three Fiber). Aktuell wird das 2D-Bild BXT Gravel 135 + SLR + ER7
 * gezeigt und per Scroll-Position sowie Mausbewegung leicht gekippt,
 * damit sich das Gefühl der finalen 3D-Ansicht schon testen lässt.
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

  // Zeigerposition relativ zur Bühne, -0.5 … 0.5
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 })
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 })

  const scrollRotateY = useTransform(progress, [0, 1], [-8, 18])
  const rotateY = useTransform(() => scrollRotateY.get() + tiltY.get())
  const translateY = useTransform(progress, [0, 1], [0, 60])
  const scale = useTransform(progress, [0, 1], [1, 0.88])

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div ref={ref} className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <motion.div className={styles.rig} style={{ rotateX: tiltX, rotateY, y: translateY, scale }}>
        <img
          src={HERO_BIKE}
          alt="Gravelbike BXT Gravel 135 mit Elitewheels SLR Gravel und LTWOO ER7"
          className={styles.bike}
          width={1200}
          height={896}
          draggable={false}
        />
      </motion.div>
      <div className={styles.groundShadow} />
    </div>
  )
}
