import type { CatalogFrame } from './parts'
import { DEFAULT_SIZE_CHARTS, type SizeChart, type SizeChartRow } from './sizeCharts'

/**
 * Größenrechner. Nutzt die Größentabelle des Herstellers (frame.sizeChart bzw.
 * sizeCharts.ts), sonst Richtwerte für Rennrad/Gravel.
 *
 * Körpergröße und Schrittlänge werden jeweils auf eine stufenlose Position
 * zwischen den Rahmengrößen abgebildet und gemittelt. So fließt der Oberkörper
 * mit ein: Lange Beine bei gleicher Körpergröße heißen kürzerer Oberkörper –
 * also eher die kleinere Größe (kürzerer Reach).
 */

/** Typische Körpergröße je Rahmengröße, wenn der Hersteller nichts angibt. */
const HEIGHT_BY_SIZE: [number, number][] = [
  [44, 153],
  [47, 159],
  [49, 164],
  [50, 166],
  [52, 169.5],
  [54, 174.5],
  [56, 180],
  [58, 186],
  [60, 192],
]

/**
 * Schrittlänge ÷ Körpergröße bei durchschnittlichem Körperbau
 * (Mittelwert der BXT-Tabelle mit beiden Maßen).
 */
const LEG_RATIO = 0.46

/** Anteil des Oberkörpers an der Empfehlung, wenn beide Maße vorliegen. */
const TORSO_WEIGHT = 0.4

export const RIDER_LIMITS = {
  height: { min: 140, max: 210 },
  inseam: { min: 60, max: 100 },
}

export interface RiderMeasures {
  /** Körpergröße in cm */
  height?: number
  /** Schrittlänge in cm */
  inseam?: number
}

export interface SizeAdvice {
  /** Options-ID der Variante „size“ */
  sizeId: string
  /** Nachbargröße, wenn die Maße genau dazwischen liegen */
  alternativeId?: string
  /** true = aus der Größentabelle des Herstellers */
  fromManufacturer: boolean
  reasons: string[]
}

type Range = [number, number]

/** Typische Körpergröße für eine Rahmengröße (linear interpoliert). */
function typicalHeight(sizeCm: number): number {
  const table = HEIGHT_BY_SIZE
  if (sizeCm <= table[0][0]) return table[0][1] - (table[0][0] - sizeCm) * 2
  for (let i = 1; i < table.length; i++) {
    const [s1, h1] = table[i - 1]
    const [s2, h2] = table[i]
    if (sizeCm <= s2) return h1 + ((sizeCm - s1) / (s2 - s1)) * (h2 - h1)
  }
  const [sl, hl] = table[table.length - 1]
  return hl + (sizeCm - sl) * 3
}

export function getFrameSizes(frame: CatalogFrame | undefined): string[] {
  return frame?.variants?.find((g) => g.id === 'size')?.options.map((o) => o.id) ?? []
}

/** Größentabelle des Rahmens: eigene aus der Datenbank, sonst die mitgelieferte. */
function getSizeChart(frame: CatalogFrame): SizeChart | undefined {
  if (frame.sizeChart?.length) return { rows: frame.sizeChart, source: 'manufacturer' }
  return DEFAULT_SIZE_CHARTS[frame.id]
}

/**
 * Stufenlose Position eines Maßes zwischen den Größen: 0 = Mitte der ersten
 * Größe, 1 = Mitte der zweiten … Außerhalb wird mit der Spannbreite der
 * Randgröße weitergerechnet (Rand der Spanne = ±0,5).
 */
function position(value: number, ranges: Range[]): number {
  const mids = ranges.map(([a, b]) => (a + b) / 2)
  const last = ranges.length - 1
  if (value <= mids[0]) return (value - mids[0]) / Math.max(ranges[0][1] - ranges[0][0], 1)
  if (value >= mids[last]) return last + (value - mids[last]) / Math.max(ranges[last][1] - ranges[last][0], 1)
  let i = 1
  while (value > mids[i]) i++
  return i - 1 + (value - mids[i - 1]) / (mids[i] - mids[i - 1])
}

const outside = (value: number, ranges: Range[]) => value < ranges[0][0] - 3 || value > ranges[ranges.length - 1][1] + 3

const span = ([a, b]: Range) => `${a}–${b} cm`

const mm = (value: number) => `${Math.round(value)} mm`

export function recommendFrameSize(frame: CatalogFrame | undefined, rider: RiderMeasures): SizeAdvice | undefined {
  const sizes = getFrameSizes(frame)
  if (!frame || sizes.length === 0 || (!rider.height && !rider.inseam)) return undefined

  const chart = getSizeChart(frame)
  const chartRows = new Map(chart?.rows.map((row) => [row.size, row]))
  // Größen in cm aufsteigend sortieren; Buchstabengrößen (XS–L) bleiben in Katalogreihenfolge.
  const ordered = sizes.every((s) => !Number.isNaN(Number(s))) ? [...sizes].sort((a, b) => Number(a) - Number(b)) : sizes
  const rows: SizeChartRow[] = ordered.map((size) => chartRows.get(size) ?? { size })
  const hasChart = rows.every((r) => r.minHeight && r.maxHeight)
  const fromManufacturer = hasChart && chart?.source === 'manufacturer'

  // Körpergrößen-Spannen: Tabelle oder Richtwert ±2,5 cm
  const heightRanges: Range[] = rows.map((r) => {
    if (hasChart) return [r.minHeight!, r.maxHeight!]
    const mid = typicalHeight(Number(r.size))
    return [mid - 2.5, mid + 2.5]
  })
  const inseamRanges: Range[] | undefined = rows.every((r) => r.minInseam && r.maxInseam)
    ? rows.map((r) => [r.minInseam!, r.maxInseam!])
    : undefined

  const reasons: string[] = []
  let pos: number
  let outOfRange = false

  if (rider.height) {
    pos = position(rider.height, heightRanges)
    outOfRange = outside(rider.height, heightRanges)
    if (rider.inseam) {
      // Oberkörper (Körpergröße − Schrittlänge) bestimmt den passenden Reach:
      // in eine Körpergröße mit durchschnittlichem Körperbau umrechnen und einfließen lassen.
      const torsoHeight = (rider.height - rider.inseam) / (1 - LEG_RATIO)
      pos = (1 - TORSO_WEIGHT) * pos + TORSO_WEIGHT * position(torsoHeight, heightRanges)
    }
  } else {
    // Nur Schrittlänge: Herstellertabelle oder in eine Körpergröße umrechnen
    const inseam = rider.inseam!
    const equivalentHeight = inseam / LEG_RATIO
    pos = inseamRanges ? position(inseam, inseamRanges) : position(equivalentHeight, heightRanges)
    outOfRange = inseamRanges ? outside(inseam, inseamRanges) : outside(equivalentHeight, heightRanges)
  }

  pos = Math.min(Math.max(pos, 0), ordered.length - 1)
  const lowerIndex = Math.floor(pos)
  const fraction = pos - lowerIndex
  let index = Math.round(pos)
  let alternativeIndex: number | undefined
  // Genau zwischen zwei Größen: beide nennen
  if (fraction > 0.35 && fraction < 0.65 && lowerIndex + 1 < ordered.length) {
    // Ohne Schrittlänge die kleinere – sie lässt sich mit Spacern und Sattelstütze leichter anpassen.
    if (!rider.inseam) index = lowerIndex
    alternativeIndex = index === lowerIndex ? lowerIndex + 1 : lowerIndex
  }
  const sizeId = ordered[index]
  const row = rows[index]

  // Begründung
  if (fromManufacturer) {
    const ranges = [`${span(heightRanges[index])} Körpergröße`]
    if (inseamRanges) ranges.push(`${span(inseamRanges[index])} Schrittlänge`)
    reasons.push(`Laut Größentabelle des Herstellers ist Größe ${sizeId} für ${ranges.join(' und ')} gedacht.`)
  } else if (hasChart && chart?.source === 'derived') {
    reasons.push(
      `Der Hersteller nennt keine Körpergrößen. Wir haben Stack und Reach mit dem ${chart.reference} verglichen – danach passt Größe ${sizeId} bei etwa ${span(heightRanges[index])} Körpergröße.`,
    )
  } else {
    reasons.push(`Als Richtwert passt Größe ${sizeId} bei etwa ${span(heightRanges[index].map(Math.round) as Range)} Körpergröße.`)
  }

  if (rider.height && rider.inseam) {
    const ratio = rider.inseam / rider.height
    if (ratio > LEG_RATIO + 0.015) {
      reasons.push('Du hast im Verhältnis lange Beine und einen eher kurzen Oberkörper – deshalb tendieren wir zur kleineren Größe mit kürzerem Reach.')
    } else if (ratio < LEG_RATIO - 0.015) {
      reasons.push('Du hast im Verhältnis einen eher langen Oberkörper – deshalb tendieren wir zur größeren Größe mit längerem Reach.')
    }
    if (ratio > LEG_RATIO + 0.05 || ratio < LEG_RATIO - 0.05) {
      reasons.push('Körpergröße und Schrittlänge passen ungewöhnlich schlecht zusammen – miss die Schrittlänge am besten noch einmal nach.')
    } else if (inseamRanges && rider.inseam > inseamRanges[index][1] + 2) {
      reasons.push('Achte beim Hochstellen des Sattels auf die Mindesteinstecktiefe der Sattelstütze.')
    }
  }

  if (outOfRange) {
    reasons.push(`Deine Maße liegen außerhalb der Größentabelle – ${sizeId} ist die nächstpassende Größe. Frag im Zweifel beim Händler nach.`)
  }

  if (row.stack && row.reach) {
    reasons.push(`Größe ${sizeId} hat ${mm(row.stack)} Stack und ${mm(row.reach)} Reach – praktisch zum Vergleich mit deinem jetzigen Rad.`)
  }

  if (!fromManufacturer && chart?.source !== 'derived' && !rider.inseam) {
    reasons.push('Für diesen Rahmen gibt es keine Größentabelle des Herstellers – die Schrittlänge macht die Empfehlung genauer.')
  } else if (!rider.inseam) {
    reasons.push('Mit deiner Schrittlänge können wir auch deinen Körperbau berücksichtigen.')
  }

  return {
    sizeId,
    alternativeId: alternativeIndex !== undefined ? ordered[alternativeIndex] : undefined,
    fromManufacturer,
    reasons,
  }
}
