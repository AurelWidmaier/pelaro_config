import type { CatalogFrame } from './parts'

/**
 * Größenrechner. Nutzt die Größentabelle des Herstellers (frame.sizeChart),
 * sonst Richtwerte für Rennrad/Gravel:
 * - Körpergröße: typische Mitte je Rahmengröße (cm Körpergröße)
 * - Schrittlänge: Rahmengröße ≈ Schrittlänge × 0,665 (Sitzrohr Mitte Tretlager bis Oberkante)
 */
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

const INSEAM_FACTOR = 0.665

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

/** Nächstgelegene Größe (nach Abstand) plus zweitbeste, wenn sie fast gleich gut passt. */
function nearest(sizes: string[], distance: (size: string) => number, tolerance: number) {
  const ranked = [...sizes].sort((a, b) => distance(a) - distance(b))
  const [best, second] = ranked
  const close = second !== undefined && distance(second) - distance(best) < tolerance
  return { best, alternative: close ? second : undefined }
}

/** „54“ bzw. „54 oder 56“ – kleinere Größe zuerst. */
function sizeList({ best, alternative }: { best: string; alternative?: string }) {
  if (!alternative) return best
  const [a, b] = [best, alternative].sort((x, y) => Number(x) - Number(y))
  return `${a} oder ${b}`
}

function smaller(a: string, b?: string) {
  return b === undefined ? a : Number(a) <= Number(b) ? a : b
}

export function recommendFrameSize(frame: CatalogFrame | undefined, rider: RiderMeasures): SizeAdvice | undefined {
  const sizes = getFrameSizes(frame)
  if (!frame || sizes.length === 0 || (!rider.height && !rider.inseam)) return undefined

  const reasons: string[] = []
  const chart = frame.sizeChart?.filter((row) => sizes.includes(row.size)) ?? []

  // 1) Schrittlänge – am aussagekräftigsten
  let byInseam: { best: string; alternative?: string } | undefined
  if (rider.inseam) {
    const target = rider.inseam * INSEAM_FACTOR
    byInseam = nearest(sizes, (s) => Math.abs(Number(s) - target), 1)
    reasons.push(`Deine Schrittlänge von ${rider.inseam} cm ergibt rechnerisch etwa ${Math.round(target)} cm Rahmengröße.`)
  }

  // 2) Körpergröße – Herstellertabelle oder Richtwert
  let byHeight: { best: string; alternative?: string } | undefined
  let fromManufacturer = false
  if (rider.height) {
    const height = rider.height
    if (chart.length > 0) {
      fromManufacturer = true
      const fits = chart.filter(
        (row) => (row.minHeight ?? -Infinity) <= height && height <= (row.maxHeight ?? Infinity),
      )
      if (fits.length > 0) {
        byHeight = { best: fits[0].size, alternative: fits[1]?.size }
      } else {
        const gap = (row: (typeof chart)[number]) =>
          height < (row.minHeight ?? -Infinity) ? (row.minHeight ?? 0) - height : height - (row.maxHeight ?? Infinity)
        byHeight = { best: [...chart].sort((a, b) => gap(a) - gap(b))[0].size }
        reasons.push(
          `Deine Körpergröße liegt außerhalb der Größentabelle des Herstellers – ${byHeight.best} ist die nächstpassende Größe. Frag im Zweifel beim Händler nach.`,
        )
      }
      reasons.push(`Laut Größentabelle des Herstellers passt bei ${height} cm Körpergröße Größe ${sizeList(byHeight)}.`)
    } else {
      byHeight = nearest(sizes, (s) => Math.abs(typicalHeight(Number(s)) - height), 2)
      reasons.push(`Bei ${height} cm Körpergröße passt als Richtwert Größe ${sizeList(byHeight)}.`)
    }
  }

  // Kombinieren: Schrittlänge hat Vorrang, Körpergröße als Gegencheck
  const main = byInseam ?? byHeight!
  let sizeId = main.best
  let alternativeId = main.alternative
  if (byInseam && byHeight && byHeight.best !== byInseam.best) {
    alternativeId = byHeight.best
    reasons.push('Schrittlänge und Körpergröße zeigen auf unterschiedliche Größen – wir empfehlen die Größe nach Schrittlänge.')
  }
  // Bei zwei gleich passenden Größen die kleinere empfehlen – sie ist leichter anzupassen.
  if (alternativeId && Number(alternativeId) < Number(sizeId) && !byInseam) {
    ;[sizeId, alternativeId] = [smaller(sizeId, alternativeId), sizeId]
  }

  if (!fromManufacturer && !byInseam) {
    reasons.push('Für diesen Rahmen gibt es keine Größentabelle des Herstellers – die Schrittlänge macht die Empfehlung genauer.')
  }
  return { sizeId, alternativeId: alternativeId !== sizeId ? alternativeId : undefined, fromManufacturer, reasons }
}
