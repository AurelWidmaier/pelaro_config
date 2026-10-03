import type { BikeType } from './parts'

/**
 * Positionierung der Anbauteil-Layer über dem Rahmenbild.
 *
 * Geschnitten wird pro Bike-Typ (nicht pro einzelnem Rahmen-SKU): alle
 * Rahmen-Modelle eines Bike-Typs (z. B. alle Gravel-Rahmen, egal ob Alu
 * oder Carbon) teilen sich dieselbe Silhouette/Nabenposition – nur Farbe
 * und Preis unterscheiden sich. Kommt später ein neues Rahmen-Bild für
 * einen bestehenden Bike-Typ dazu, muss hier nichts geändert werden.
 * Kommt ein neuer Bike-Typ dazu, hier einen neuen Eintrag ergänzen.
 *
 * Alle Werte sind Prozentwerte relativ zur Bike-Canvas (Seitenverhältnis
 * 5:3, siehe BikeCanvas.tsx), damit die Positionierung bei jeder
 * Bildschirmgröße stabil bleibt.
 */

export interface LayerSlot {
  /** Horizontale Position des Layer-Zentrums, in % der Canvas-Breite. */
  xPercent: number
  /** Vertikale Position des Layer-Zentrums, in % der Canvas-Höhe. */
  yPercent: number
  /** Breite des Layers, in % der Canvas-Breite (bei scale = 1). */
  widthPercent: number
  /** Zusätzlicher Skalierungsfaktor zum Feintuning einzelner Teile. */
  scale: number
  /** Stapelreihenfolge – höhere Werte liegen weiter oben. */
  zIndex: number
}

export type FrameSlotId = 'wheelFront' | 'wheelRear' | 'groupset'

export type FrameLayerConfig = Record<FrameSlotId, LayerSlot>

export const LAYER_POSITIONS: Record<BikeType, FrameLayerConfig> = {
  rennrad: {
    wheelRear: { xPercent: 22.5, yPercent: 71.7, widthPercent: 33, scale: 1, zIndex: 2 },
    wheelFront: { xPercent: 77.5, yPercent: 71.7, widthPercent: 33, scale: 1, zIndex: 2 },
    groupset: { xPercent: 44, yPercent: 71.7, widthPercent: 9, scale: 1, zIndex: 3 },
  },
  timetrial: {
    wheelRear: { xPercent: 22.5, yPercent: 71.7, widthPercent: 33, scale: 1, zIndex: 2 },
    wheelFront: { xPercent: 77.5, yPercent: 71.7, widthPercent: 33, scale: 1, zIndex: 2 },
    groupset: { xPercent: 44, yPercent: 71.7, widthPercent: 9, scale: 1, zIndex: 3 },
  },
  gravel: {
    wheelRear: { xPercent: 21, yPercent: 73, widthPercent: 35, scale: 1, zIndex: 2 },
    wheelFront: { xPercent: 79, yPercent: 73, widthPercent: 35, scale: 1, zIndex: 2 },
    groupset: { xPercent: 43, yPercent: 73, widthPercent: 9, scale: 1, zIndex: 3 },
  },
  'hardtail-mtb': {
    wheelRear: { xPercent: 20, yPercent: 74.2, widthPercent: 38, scale: 1, zIndex: 2 },
    wheelFront: { xPercent: 80, yPercent: 74.2, widthPercent: 38, scale: 1, zIndex: 2 },
    groupset: { xPercent: 42, yPercent: 74.2, widthPercent: 9, scale: 1, zIndex: 3 },
  },
}
