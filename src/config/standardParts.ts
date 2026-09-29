import type { BikeType, CatalogFrame } from './parts'

/**
 * Standardkomponenten, die bei jedem Bike automatisch dabei sind (nicht
 * wählbar). Preise/Gewichte gelten für das ganze Bike, also z. B. beide
 * Reifen zusammen.
 */
export interface StandardPart {
  id: string
  label: string
  name: string
  /** Menge/Größe als Zusatzinfo, z. B. "2 × 700 × 28C" oder "VR 160 mm · HR 140 mm". */
  detail?: string
  price: number
  weight: number
  url: string
}

/** Bike-Typen mit Straßen-/Gravel-Ausstattung (700C, Rennlenker). */
const SUPPORTED_BIKE_TYPES: BikeType[] = ['rennrad', 'gravel', 'race-gravel']

const ROTORS: Record<number, { price: number; weight: number }> = {
  140: { price: 11, weight: 121 },
  160: { price: 7, weight: 143 },
  180: { price: 14, weight: 160 },
  203: { price: 15, weight: 190 },
}

/** Bremsscheiben VR/HR, wenn der Rahmen nichts anderes vorgibt. */
const DEFAULT_ROTORS: [number, number] = [160, 160]

export function getStandardParts(bikeType: BikeType | null, frame?: CatalogFrame): StandardPart[] {
  if (!bikeType || !SUPPORTED_BIKE_TYPES.includes(bikeType)) return []

  const gravelTubes = bikeType !== 'rennrad'
  const [front, rear] = frame?.brakeRotors ?? DEFAULT_ROTORS

  return [
    {
      id: 'saddle',
      label: 'Sattel',
      name: 'Elitaone Carbon-Sattel',
      price: 17.69,
      weight: 135,
      url: 'https://s.click.aliexpress.com/e/_c3ySK67f',
    },
    {
      id: 'bartape',
      label: 'Lenkerband',
      name: 'BUCKLOS Lenkerband',
      price: 6.59,
      weight: 75,
      url: 'https://s.click.aliexpress.com/e/_c33BMsXn',
    },
    {
      id: 'tires',
      label: 'Reifen',
      name: 'Continental Grand Prix',
      detail: '2 Stück',
      price: 2 * 33.79,
      weight: 2 * 360,
      url: 'https://s.click.aliexpress.com/e/_c2I9HvhX',
    },
    {
      id: 'tubes',
      label: 'Schläuche',
      name: 'Ridenow 700C TPU-Schläuche',
      detail: gravelTubes ? '2 Stück, Gravel' : '2 Stück, Rennrad',
      price: 20.39,
      weight: 2 * (gravelTubes ? 45 : 24),
      url: 'https://s.click.aliexpress.com/e/_c3BJpVR3',
    },
    {
      id: 'rotors',
      label: 'Bremsscheiben',
      name: 'Bremsscheiben',
      detail: `VR ${front} mm · HR ${rear} mm`,
      price: ROTORS[front].price + ROTORS[rear].price,
      weight: ROTORS[front].weight + ROTORS[rear].weight,
      url: 'https://s.click.aliexpress.com/e/_c3afRncd',
    },
  ]
}
