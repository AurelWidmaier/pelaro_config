import { motion } from 'framer-motion'
import { getFrameById, getGroupsetById, getWheelsById } from '../config/parts'
import { useCompleteBikeImage } from '../config/bikeImages'
import { LAYER_POSITIONS, type LayerSlot } from '../config/layerPositions'
import styles from './BikeCanvas.module.css'

interface BikeCanvasProps {
  frameId: string | null
  groupsetId?: string | null
  wheelsId?: string | null
  className?: string
}

/**
 * Setzt das Bike-Bild aus einzelnen, freigestellten Layern zusammen:
 * Rahmen (Basis) -> Laufräder -> optionale Anbauteile (z. B. Schaltgruppe).
 * Die Position jedes Layers kommt aus `layerPositions.ts` und ist pro
 * Bike-Typ (Rahmengeometrie) konfigurierbar.
 * Gibt es in cdn/bikes/ ein fertiges Bild für genau diese Kombination,
 * wird stattdessen dieses gezeigt (siehe config/bikeImages.ts).
 */
export function BikeCanvas({ frameId, groupsetId, wheelsId, className }: BikeCanvasProps) {
  const frame = getFrameById(frameId)
  const groupset = getGroupsetById(groupsetId ?? null)
  const wheels = getWheelsById(wheelsId ?? null)
  const completeImage = useCompleteBikeImage(frame?.imageKey, wheels?.imageKey, groupset?.imageKey)

  if (!frame) {
    return (
      <div className={`${styles.canvas} ${styles.empty} ${className ?? ''}`}>
        <span>Noch kein Rahmen ausgewählt</span>
      </div>
    )
  }

  // Fertiges Komplettbike-Foto für genau diese Kombination hat Vorrang vor den Layern.
  if (completeImage) {
    return (
      <div className={`${styles.canvas} ${className ?? ''}`}>
        <motion.img
          key={completeImage}
          src={completeImage}
          alt={frame.name}
          className={styles.base}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <span className={styles.aiNote}>KI-Bild · nur Vorschau · Gewicht geschätzt</span>
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
