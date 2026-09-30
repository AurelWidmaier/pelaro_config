import {
  getDefaultVariants,
  getWheelsLocks,
  suggestFrames,
  suggestGroupsets,
  suggestWheels,
  type BikeType,
  type VariantGroup,
  type VariantSelection,
} from './parts'
import { getStandardParts } from './standardParts'

/** Auf diese Schritte wird die Budget-Spanne gerundet und der Regler bewegt. */
export const BUDGET_STEP = 50

export interface BudgetRange {
  min: number
  max: number
  step: number
}

interface PricedPart {
  price: number
  variants?: VariantGroup[]
  priceTable?: { when: VariantSelection; price: number }[]
}

/** Günstigster und teuerster Preis eines Teils über alle Unterauswahlen. */
function partPriceRange(part: PricedPart): [number, number] {
  const bases = part.priceTable?.length ? part.priceTable.map((row) => row.price) : [part.price]
  let min = Math.min(...bases)
  let max = Math.max(...bases)
  for (const group of part.variants ?? []) {
    const deltas = group.options.map((o) => o.priceDelta ?? 0)
    min += Math.min(...deltas)
    max += Math.max(...deltas)
  }
  return [min, max]
}

/**
 * Budget-Spanne für einen Bike-Typ: vom günstigsten bis zum teuersten Bike,
 * das sich aus dem aktuellen Katalog zusammenstellen lässt (inkl.
 * Standardteilen), auf BUDGET_STEP gerundet.
 */
export function getBudgetRange(bikeType: BikeType | null): BudgetRange {
  const fallback = { min: 300, max: 2000, step: BUDGET_STEP }
  if (!bikeType) return fallback

  // Gleiche Auswahl wie in den Schritten (Platzhalter nur ohne echte Produkte).
  const frames = suggestFrames(bikeType, 0).options
  const groupsets = suggestGroupsets(bikeType, 0).options
  const wheelsets = suggestWheels(bikeType, 0).options
  if (frames.length === 0 || groupsets.length === 0 || wheelsets.length === 0) return fallback

  let min = Infinity
  let max = -Infinity
  for (const frame of frames) {
    for (const groupset of groupsets) {
      for (const wheels of wheelsets) {
        const wheelsVariants = { ...getDefaultVariants(wheels), ...getWheelsLocks(wheels, groupset) }
        const standard = getStandardParts(bikeType, { frame, groupset, wheels, wheelsVariants })
          .reduce((sum, p) => sum + p.price, 0)
        const [fMin, fMax] = partPriceRange(frame)
        const [gMin, gMax] = partPriceRange(groupset)
        const [wMin, wMax] = partPriceRange(wheels)
        min = Math.min(min, fMin + gMin + wMin + standard)
        max = Math.max(max, fMax + gMax + wMax + standard)
      }
    }
  }

  const low = Math.floor(min / BUDGET_STEP) * BUDGET_STEP
  const high = Math.ceil(max / BUDGET_STEP) * BUDGET_STEP
  return { min: low, max: Math.max(high, low + BUDGET_STEP), step: BUDGET_STEP }
}

/** Budget in die Spanne holen; ohne Vorgabe die (gerundete) Mitte. */
export function clampBudget(budget: number | null, range: BudgetRange): number {
  if (budget === null) {
    return Math.round((range.min + range.max) / 2 / range.step) * range.step
  }
  return Math.min(range.max, Math.max(range.min, budget))
}
