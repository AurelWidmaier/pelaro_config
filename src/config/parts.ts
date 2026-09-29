import frameRennradAlu from '../assets/parts/frame/frame-rennrad-alu.svg'
import frameRennradCarbon from '../assets/parts/frame/frame-rennrad-carbon.svg'
import frameGravelAlu from '../assets/parts/frame/frame-gravel-alu.svg'
import frameGravelCarbon from '../assets/parts/frame/frame-gravel-carbon.svg'
import frameRaceGravelAlu from '../assets/parts/frame/frame-race-gravel-alu.svg'
import frameRaceGravelCarbon from '../assets/parts/frame/frame-race-gravel-carbon.svg'
import frameHardtailAlu from '../assets/parts/frame/frame-hardtail-mtb-alu.svg'
import frameHardtailCarbon from '../assets/parts/frame/frame-hardtail-mtb-carbon.svg'

import wheelsAlltag from '../assets/parts/wheels/wheels-alltag.svg'
import wheelsSport from '../assets/parts/wheels/wheels-sport.svg'
import wheelsAero from '../assets/parts/wheels/wheels-aero.svg'

import groupsetEinsteiger from '../assets/parts/groupset/groupset-einsteiger.svg'
import groupsetMittelklasse from '../assets/parts/groupset/groupset-mittelklasse.svg'
import groupsetPerformance from '../assets/parts/groupset/groupset-performance.svg'

/**
 * Datenmodell für den Konfigurator.
 *
 * Alle "CATALOG"-Arrays simulieren die spätere Datenbank: In Produktion
 * würden diese Listen per API/DB-Abfrage kommen (gefiltert nach Bike-Typ
 * und Preisspanne). Für den Prototyp reicht ein statisches, aber
 * realistisch strukturiertes Mock-Sortiment – neue Modelle einfach als
 * weiteren Eintrag ergänzen.
 */

export type BikeType = 'rennrad' | 'gravel' | 'race-gravel' | 'hardtail-mtb'

export interface BikeTypeInfo {
  id: BikeType
  name: string
  description: string
  image: string
}

export const BIKE_TYPES: BikeTypeInfo[] = [
  {
    id: 'rennrad',
    name: 'Rennrad',
    description: 'Schnell auf Asphalt, sportliche Sitzposition – ideal für Straße und Tempo.',
    image: frameRennradAlu,
  },
  {
    id: 'gravel',
    name: 'Gravelbike',
    description: 'Vielseitig für Asphalt, Schotter und Waldwege – der Allrounder.',
    image: frameGravelAlu,
  },
  {
    id: 'race-gravel',
    name: 'Race-Gravel',
    description: 'Sportliche Gravel-Geometrie für alle, die es auch mal eilig haben.',
    image: frameRaceGravelAlu,
  },
  {
    id: 'hardtail-mtb',
    name: 'Hardtail-MTB',
    description: 'Robustes Mountainbike mit Federgabel – für Trails und unebenes Gelände.',
    image: frameHardtailAlu,
  },
]

export function getBikeTypeInfo(id: BikeType | null): BikeTypeInfo | undefined {
  return BIKE_TYPES.find((b) => b.id === id)
}

/* ------------------------------- Rahmen ------------------------------- */

export type FrameMaterial = 'alu' | 'carbon'

export interface CatalogFrame {
  id: string
  bikeType: BikeType
  material: FrameMaterial
  name: string
  description: string
  price: number
  /** Freigestelltes PNG/SVG mit transparentem Hintergrund, Basis-Layer. */
  image: string
}

export const FRAME_CATALOG: CatalogFrame[] = [
  // Rennrad
  { id: 'frame-rennrad-alu-basic', bikeType: 'rennrad', material: 'alu', name: 'Alu Race Einstieg', description: 'Leichter Alu-Rennradrahmen für den unkomplizierten Einstieg.', price: 199, image: frameRennradAlu },
  { id: 'frame-rennrad-alu-sport', bikeType: 'rennrad', material: 'alu', name: 'Alu Race Sport', description: 'Steiferes Rohrset für bessere Kraftübertragung bei flotter Fahrweise.', price: 349, image: frameRennradAlu },
  { id: 'frame-rennrad-carbon-endurance', bikeType: 'rennrad', material: 'carbon', name: 'Carbon Endurance', description: 'Komfortabler Carbon-Rahmen für lange Ausfahrten ohne Ermüdung.', price: 549, image: frameRennradCarbon },
  { id: 'frame-rennrad-carbon-race', bikeType: 'rennrad', material: 'carbon', name: 'Carbon Race', description: 'Carbon-Rahmen für maximale Laufruhe und minimales Gewicht.', price: 899, image: frameRennradCarbon },

  // Gravel
  { id: 'frame-gravel-alu-basic', bikeType: 'gravel', material: 'alu', name: 'Alu Gravel Einstieg', description: 'Robuster Alu-Gravelrahmen mit entspannter Sitzposition für lange Touren.', price: 229, image: frameGravelAlu },
  { id: 'frame-gravel-alu-sport', bikeType: 'gravel', material: 'alu', name: 'Alu Gravel Allround', description: 'Vielseitiger Alu-Rahmen mit viel Reifenfreiheit für Schotter und Asphalt.', price: 399, image: frameGravelAlu },
  { id: 'frame-gravel-carbon-endurance', bikeType: 'gravel', material: 'carbon', name: 'Carbon Endurance Gravel', description: 'Federleichter Carbon-Rahmen für lange, komfortable Gravel-Touren.', price: 599, image: frameGravelCarbon },
  { id: 'frame-gravel-carbon-race', bikeType: 'gravel', material: 'carbon', name: 'Carbon Gravel', description: 'Leichter Carbon-Rahmen mit gedämpfter Fahrt über groben Untergrund.', price: 949, image: frameGravelCarbon },

  // Race-Gravel
  { id: 'frame-race-gravel-alu-basic', bikeType: 'race-gravel', material: 'alu', name: 'Alu Race-Gravel Einstieg', description: 'Sportlich ausgelegter Alu-Rahmen für schnelle Gravel-Ausfahrten.', price: 249, image: frameRaceGravelAlu },
  { id: 'frame-race-gravel-alu-sport', bikeType: 'race-gravel', material: 'alu', name: 'Alu Race-Gravel Sport', description: 'Aggressivere Geometrie für mehr Tempo auf Schotter und Asphalt.', price: 419, image: frameRaceGravelAlu },
  { id: 'frame-race-gravel-carbon-endurance', bikeType: 'race-gravel', material: 'carbon', name: 'Carbon Race-Gravel Endurance', description: 'Leichter Carbon-Rahmen mit sportlicher, aber verträglicher Sitzposition.', price: 629, image: frameRaceGravelCarbon },
  { id: 'frame-race-gravel-carbon-race', bikeType: 'race-gravel', material: 'carbon', name: 'Carbon Race-Gravel', description: 'Wettkampftaugliches Carbon-Setup für ambitionierte Gravel-Racer:innen.', price: 999, image: frameRaceGravelCarbon },

  // Hardtail-MTB
  { id: 'frame-hardtail-alu-basic', bikeType: 'hardtail-mtb', material: 'alu', name: 'Alu Hardtail Einstieg', description: 'Stabiler Alu-Rahmen für den Einstieg ins Mountainbiken.', price: 219, image: frameHardtailAlu },
  { id: 'frame-hardtail-alu-sport', bikeType: 'hardtail-mtb', material: 'alu', name: 'Alu Hardtail Trail', description: 'Trail-orientierte Geometrie mit mehr Reserven bei ruppigem Terrain.', price: 379, image: frameHardtailAlu },
  { id: 'frame-hardtail-carbon-trail', bikeType: 'hardtail-mtb', material: 'carbon', name: 'Carbon Trail', description: 'Leichter Carbon-Rahmen für effizientes Bergauffahren mit Reserven im Trail.', price: 579, image: frameHardtailCarbon },
  { id: 'frame-hardtail-carbon-race', bikeType: 'hardtail-mtb', material: 'carbon', name: 'Carbon Hardtail', description: 'Federleichter Carbon-Rahmen für Marathon- und Renneinsatz.', price: 929, image: frameHardtailCarbon },
]

/* ------------------------------ Schaltung ------------------------------ */

export type GroupsetKind = 'mechanisch-2x' | 'mechanisch-1x' | 'elektronisch'

export interface CatalogGroupset {
  id: string
  bikeTypes: BikeType[]
  kind: GroupsetKind
  name: string
  description: string
  price: number
  /** Kleiner optionaler Layer (z. B. Kurbel/Schaltwerk-Icon). */
  image: string
}

export const GROUPSET_CATALOG: CatalogGroupset[] = [
  // Mechanisch, 2-fach – passend für Rennrad, Gravel, Race-Gravel
  { id: 'groupset-2x-einsteiger', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Einsteiger-Schaltung', description: 'Zuverlässige 2-fach Schaltung mit großer Bandbreite – einfach zu warten.', price: 139, image: groupsetEinsteiger },
  { id: 'groupset-2x-mittelklasse', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Mittelklasse-Schaltung', description: 'Präzisere Gangwechsel und geringeres Gewicht als die Einsteigerstufe.', price: 299, image: groupsetMittelklasse },
  { id: 'groupset-2x-performance', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Performance-Schaltung', description: 'Leichtbau-Komponenten für schnelle, verlustarme Gangwechsel.', price: 649, image: groupsetPerformance },

  // Mechanisch, 1-fach – passend für Gravel, Race-Gravel, Hardtail-MTB
  { id: 'groupset-1x-einsteiger', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x Einsteiger-Schaltung', description: 'Simple 1-fach Schaltung ohne Umwerfer – weniger Technik, weniger Wartung.', price: 159, image: groupsetEinsteiger },
  { id: 'groupset-1x-mittelklasse', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x Mittelklasse-Schaltung', description: 'Breite Kassette für viel Bandbreite bei nur einem Kettenblatt.', price: 329, image: groupsetMittelklasse },
  { id: 'groupset-1x-performance', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x12 Performance-Schaltung', description: 'Präzises 1x12-Setup mit Clutch-Schaltwerk für ruhigen Kettenlauf.', price: 679, image: groupsetPerformance },

  // Elektronisch – Premium-Option für Rennrad, Gravel, Race-Gravel
  { id: 'groupset-di2-performance', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'elektronisch', name: 'Elektronische Schaltung', description: 'Blitzschnelle, perfekt abgestimmte Gangwechsel auf Knopfdruck.', price: 1499, image: groupsetPerformance },
]

/* ------------------------------ Laufräder ------------------------------ */

export type WheelMaterial = 'alu' | 'carbon'

export interface CatalogWheelset {
  id: string
  bikeTypes: BikeType[]
  material: WheelMaterial
  name: string
  description: string
  price: number
  image: string
}

export const WHEELS_CATALOG: CatalogWheelset[] = [
  { id: 'wheels-rennrad-alu-basic', bikeTypes: ['rennrad'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 119, image: wheelsAlltag },
  { id: 'wheels-rennrad-alu-sport', bikeTypes: ['rennrad'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 219, image: wheelsSport },
  { id: 'wheels-rennrad-carbon-endurance', bikeTypes: ['rennrad'], material: 'carbon', name: 'Carbon-Laufräder Endurance', description: 'Leichte Carbon-Laufräder mit gutem Rundlauf für lange Distanzen.', price: 399, image: wheelsAero },
  { id: 'wheels-rennrad-carbon-aero', bikeTypes: ['rennrad'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 649, image: wheelsAero },

  { id: 'wheels-gravel-alu-basic', bikeTypes: ['gravel'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 139, image: wheelsAlltag },
  { id: 'wheels-gravel-alu-sport', bikeTypes: ['gravel'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 249, image: wheelsSport },
  { id: 'wheels-gravel-carbon-endurance', bikeTypes: ['gravel'], material: 'carbon', name: 'Carbon-Laufräder Endurance', description: 'Leichte Carbon-Laufräder für lange, komfortable Gravel-Touren.', price: 429, image: wheelsAero },
  { id: 'wheels-gravel-carbon-aero', bikeTypes: ['gravel'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 699, image: wheelsAero },

  { id: 'wheels-race-gravel-alu-basic', bikeTypes: ['race-gravel'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 129, image: wheelsAlltag },
  { id: 'wheels-race-gravel-alu-sport', bikeTypes: ['race-gravel'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 239, image: wheelsSport },
  { id: 'wheels-race-gravel-carbon-endurance', bikeTypes: ['race-gravel'], material: 'carbon', name: 'Carbon-Laufräder Endurance', description: 'Leichte Carbon-Laufräder mit gutem Rundlauf für flotte Ausfahrten.', price: 409, image: wheelsAero },
  { id: 'wheels-race-gravel-carbon-aero', bikeTypes: ['race-gravel'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 679, image: wheelsAero },

  { id: 'wheels-hardtail-alu-basic', bikeTypes: ['hardtail-mtb'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile, breite Alu-Laufräder für den Alltag auf dem Trail.', price: 149, image: wheelsAlltag },
  { id: 'wheels-hardtail-alu-sport', bikeTypes: ['hardtail-mtb'], material: 'alu', name: 'Alu-Laufräder Trail', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten im Gelände.', price: 269, image: wheelsSport },
  { id: 'wheels-hardtail-carbon-trail', bikeTypes: ['hardtail-mtb'], material: 'carbon', name: 'Carbon-Laufräder Trail', description: 'Steife, leichte Carbon-Laufräder für effizienten Vortrieb im Gelände.', price: 449, image: wheelsAero },
  { id: 'wheels-hardtail-carbon-race', bikeTypes: ['hardtail-mtb'], material: 'carbon', name: 'Carbon-Laufräder Race', description: 'Renntaugliche Carbon-Laufräder für maximale Effizienz im Wettkampf.', price: 719, image: wheelsAero },
]

/* ------------------------------ Lookups -------------------------------- */

export function getFrameById(id: string | null): CatalogFrame | undefined {
  return FRAME_CATALOG.find((f) => f.id === id)
}

export function getGroupsetById(id: string | null): CatalogGroupset | undefined {
  return GROUPSET_CATALOG.find((g) => g.id === id)
}

export function getWheelsById(id: string | null): CatalogWheelset | undefined {
  return WHEELS_CATALOG.find((w) => w.id === id)
}

/* -------------------------- Preisspannen-Logik -------------------------- */

/**
 * Anteil des Gesamtbudgets, der pro Kategorie als "sinnvolle" Preisspanne
 * gilt. Rein heuristisch für den Prototyp – später würde das aus echten
 * Verkaufsdaten kommen.
 */
const PRICE_ALLOCATION: Record<'frame' | 'groupset' | 'wheels', { min: number; max: number }> = {
  frame: { min: 0.32, max: 0.45 },
  groupset: { min: 0.18, max: 0.28 },
  wheels: { min: 0.18, max: 0.28 },
}

export interface PriceBracket {
  min: number
  max: number
}

export function getPriceBracket(category: 'frame' | 'groupset' | 'wheels', budget: number): PriceBracket {
  const alloc = PRICE_ALLOCATION[category]
  return { min: Math.round(budget * alloc.min), max: Math.round(budget * alloc.max) }
}

/**
 * Filtert Katalog-Einträge auf die Preisspanne (mit etwas Puffer nach oben,
 * damit "eine Stufe teurer" noch als Option sichtbar bleibt).
 *
 * Gibt es darin zu wenige Treffer (0 oder 1) – etwa an den Rändern des
 * Budget-Reglers – wird stattdessen das dem Preisspannen-Mittelwert
 * nächstgelegene Modell plus seine direkten Nachbarn (eine Stufe günstiger/
 * teurer) gezeigt. So bleibt die Auswahl immer eine kleine, relevante
 * Teilmenge statt entweder leer oder immer der komplette Katalog.
 */
function suggestByBracket<T extends { price: number }>(items: T[], bracket: PriceBracket): T[] {
  const sorted = [...items].sort((a, b) => a.price - b.price)
  const upperLimit = bracket.max * 1.6
  const inBracket = sorted.filter((item) => item.price >= bracket.min && item.price <= upperLimit)

  if (inBracket.length >= 2) return inBracket

  const center = (bracket.min + bracket.max) / 2
  const anchorIndex = sorted.reduce(
    (closest, item, i) =>
      Math.abs(item.price - center) < Math.abs(sorted[closest].price - center) ? i : closest,
    0,
  )
  return sorted.slice(Math.max(0, anchorIndex - 1), Math.min(sorted.length, anchorIndex + 2))
}

export function suggestFrames(bikeType: BikeType, budget: number): CatalogFrame[] {
  const matches = FRAME_CATALOG.filter((f) => f.bikeType === bikeType)
  return suggestByBracket(matches, getPriceBracket('frame', budget))
}

export function suggestGroupsets(bikeType: BikeType, budget: number): CatalogGroupset[] {
  const matches = GROUPSET_CATALOG.filter((g) => g.bikeTypes.includes(bikeType))
  return suggestByBracket(matches, getPriceBracket('groupset', budget))
}

export function suggestWheels(bikeType: BikeType, budget: number): CatalogWheelset[] {
  const matches = WHEELS_CATALOG.filter((w) => w.bikeTypes.includes(bikeType))
  return suggestByBracket(matches, getPriceBracket('wheels', budget))
}

export const BUDGET_RANGE = {
  min: 300,
  max: 2000,
  step: 50,
  default: 900,
}
