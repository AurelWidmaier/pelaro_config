/**
 * Größen- und Geometrietabellen der Hersteller (Quelle: cdn/size_tables/*.png,
 * Stand 10/2026). Körpergröße und Schrittlänge in cm, Stack und Reach in mm.
 * Produkte aus der Datenbank können eine eigene `sizeChart` mitbringen – diese
 * Liste ergänzt nur den Standardkatalog.
 */
export interface SizeChartRow {
  /** Options-ID der Variante „size“ */
  size: string
  minHeight?: number
  maxHeight?: number
  minInseam?: number
  maxInseam?: number
  stack?: number
  reach?: number
}

export interface SizeChart {
  rows: SizeChartRow[]
  /**
   * manufacturer = Körpergrößen laut Hersteller,
   * derived = über Stack/Reach von einem vergleichbaren Rahmen abgeleitet.
   */
  source: 'manufacturer' | 'derived'
  /** Bei `derived`: Name des Vergleichsrahmens */
  reference?: string
}

const BXT_PRO_145: SizeChartRow[] = [
  { size: '47', minHeight: 156, maxHeight: 161, minInseam: 71, maxInseam: 75, stack: 508.4, reach: 372 },
  { size: '50', minHeight: 161, maxHeight: 166, minInseam: 74, maxInseam: 77, stack: 519, reach: 378 },
  { size: '52', minHeight: 166, maxHeight: 172, minInseam: 76, maxInseam: 79, stack: 530.8, reach: 383.8 },
  { size: '54', minHeight: 172, maxHeight: 177, minInseam: 78, maxInseam: 82, stack: 541, reach: 384.8 },
  { size: '56', minHeight: 177, maxHeight: 182, minInseam: 81, maxInseam: 85, stack: 561.8, reach: 390.5 },
  { size: '58', minHeight: 182, maxHeight: 188, minInseam: 84, maxInseam: 87, stack: 582, reach: 396.1 },
]

const BXT_GRAVEL_135: SizeChartRow[] = [
  { size: '49', minHeight: 155, maxHeight: 164, stack: 519, reach: 374.1 },
  { size: '52', minHeight: 165, maxHeight: 172, stack: 544.4, reach: 378.4 },
  { size: '54', minHeight: 173, maxHeight: 180, stack: 565.3, reach: 387.1 },
  { size: '56', minHeight: 181, maxHeight: 187, stack: 589.9, reach: 398.2 },
  { size: '58', minHeight: 188, maxHeight: 196, stack: 609.7, reach: 406.1 },
]

/** Spcycle nennt nur die Geometrie, keine Körpergrößen. */
const SPCYCLE_R088_GEOMETRY: SizeChartRow[] = [
  { size: '44', stack: 500, reach: 366 },
  { size: '49', stack: 514, reach: 375 },
  { size: '52', stack: 527, reach: 380 },
  { size: '54', stack: 545, reach: 384 },
  { size: '56', stack: 565, reach: 395 },
  { size: '58', stack: 591, reach: 402 },
]

/**
 * BXT Triathlon-219: nur Geometrie. Stack = Maß K, Reach = Maß L der
 * Herstellerzeichnung.
 */
const BXT_TT_219_GEOMETRY: SizeChartRow[] = [
  { size: 'xs', stack: 488.1, reach: 395 },
  { size: 's', stack: 498.5, reach: 405 },
  { size: 'm', stack: 518.5, reach: 421 },
  { size: 'l', stack: 540.4, reach: 442 },
]

/**
 * Leitet Körpergrößen über Stack + Reach von einem Rahmen mit Herstellertabelle
 * ab (gleiche Radgattung): gleiche Sitzposition ⇒ gleiche Körpergröße.
 */
function deriveHeights(geometry: SizeChartRow[], reference: SizeChartRow[]): SizeChartRow[] {
  const ref = reference.map((r) => ({ fit: r.stack! + r.reach!, mid: (r.minHeight! + r.maxHeight!) / 2 }))
  const heightAt = (fit: number) => {
    let i = 1
    while (i < ref.length - 1 && fit > ref[i].fit) i++
    const [a, b] = [ref[i - 1], ref[i]]
    return a.mid + ((fit - a.fit) / (b.fit - a.fit)) * (b.mid - a.mid)
  }
  const mids = geometry.map((g) => heightAt(g.stack! + g.reach!))
  return geometry.map((g, i) => {
    // Grenzen in der Mitte zwischen den Nachbargrößen
    const lower = i > 0 ? (mids[i - 1] + mids[i]) / 2 : mids[i] - (mids[i + 1] - mids[i]) / 2
    const upper = i < mids.length - 1 ? (mids[i] + mids[i + 1]) / 2 : mids[i] + (mids[i] - mids[i - 1]) / 2
    return { ...g, minHeight: Math.round(lower), maxHeight: Math.round(upper) }
  })
}

export const DEFAULT_SIZE_CHARTS: Record<string, SizeChart> = {
  'frame-bxt-pro-145': { rows: BXT_PRO_145, source: 'manufacturer' },
  'frame-bxt-gravel-135': { rows: BXT_GRAVEL_135, source: 'manufacturer' },
  'frame-spcycle-r088': {
    rows: deriveHeights(SPCYCLE_R088_GEOMETRY, BXT_PRO_145),
    source: 'derived',
    reference: 'BXT Pro-145',
  },
  // Zeitfahrrahmen: tieferer Stack, längerer Reach – die Summe entspricht etwa
  // der gleichen Körpergröße auf dem Rennrad.
  'frame-bxt-tt-219': {
    rows: deriveHeights(BXT_TT_219_GEOMETRY, BXT_PRO_145),
    source: 'derived',
    reference: 'BXT Pro-145',
  },
}
