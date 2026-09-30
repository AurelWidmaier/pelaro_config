import {
  getConfiguredPrice,
  getGroupsetLocks,
  getSelectedVariantOptions,
  type BikeType,
  type CatalogFrame,
  type CatalogGroupset,
  type VariantGroup,
  type VariantSelection,
} from './parts'

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
  /** Fehlt, wenn der Händler kein Gewicht angibt. */
  weight?: number
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

/**
 * Gravel-Reifen (Gravel & Race-Gravel) mit wählbarer Breite. Preise gelten
 * je Reifen, das Bike bekommt zwei (je 460 g).
 */
export const GRAVEL_TIRE = {
  brand: 'Continental',
  name: 'Continental Terra Trail',
  url: 'https://s.click.aliexpress.com/e/_c3UiXXvX',
  price: 2 * 40.39,
  weight: 2 * 460,
  variants: [
    {
      id: 'tireWidth',
      label: 'Reifenbreite',
      options: [
        { id: '40', label: '700 × 40C' },
        { id: '45', label: '700 × 45C' },
      ],
    },
  ] as VariantGroup[],
  priceTable: [
    { when: { tireWidth: '40' }, price: 2 * 40.39 },
    { when: { tireWidth: '45' }, price: 2 * 38.19 },
  ],
}

/**
 * Zusätzliches Innenlager je Rahmen × Schaltgruppe. Wird nur gebraucht, wenn
 * die Schaltgruppe kein passendes Lager mitbringt (GRT12: BSA, BB86/92, PF30,
 * BB30). Fehlt eine Kombination, liegt das Lager dem Rahmenset bei (BXT
 * Pro-145) oder ist noch offen.
 */
const KACTUS_BSA24: Omit<StandardPart, 'id' | 'label'> = {
  name: 'KACTUS Innenlager BSA24',
  detail: 'BSA 68/73 mm, 24-mm-Achse',
  price: 32.39,
  weight: 149,
  url: 'https://s.click.aliexpress.com/e/_c45TpIpF',
}

const BOTTOM_BRACKETS: Record<string, Omit<StandardPart, 'id' | 'label'>> = {
  // T47 ist nicht unter den GRT12-Lagern
  'frame-bxt-pro-145|groupset-ltwoo-grt12': {
    name: 'ZRACE Innenlager T47-DUB',
    detail: 'T47, 29-mm-Achse',
    price: 22.19,
    weight: 129,
    url: 'https://s.click.aliexpress.com/e/_c3yXlbbL',
  },
  // BSA-Rahmen mit ER7-Kurbel (24-mm-Stahlachse)
  'frame-spcycle-r088|groupset-ltwoo-er7': KACTUS_BSA24,
  'frame-bxt-gravel-135|groupset-ltwoo-er7': KACTUS_BSA24,
}

/** Bremsscheiben VR/HR, wenn der Rahmen nichts anderes vorgibt. */
const DEFAULT_ROTORS: [number, number] = [160, 160]

export function getStandardParts(
  bikeType: BikeType | null,
  frame?: CatalogFrame,
  tireSelection: VariantSelection = {},
  groupset?: CatalogGroupset,
): StandardPart[] {
  if (!bikeType || !SUPPORTED_BIKE_TYPES.includes(bikeType)) return []

  const gravelTubes = bikeType !== 'rennrad'
  const [front, rear] = frame?.brakeRotors ?? DEFAULT_ROTORS
  // Bringt die Schaltgruppe ein zum Rahmen passendes Lager mit, braucht es kein zusätzliches.
  const bottomBracketInSet = Boolean(getGroupsetLocks(groupset, frame).bottomBracket)
  const bottomBracket = bottomBracketInSet ? undefined : BOTTOM_BRACKETS[`${frame?.id}|${groupset?.id}`]

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
    gravelTubes
      ? {
          id: 'tires',
          label: 'Reifen',
          name: GRAVEL_TIRE.name,
          detail: `2 Stück, ${getSelectedVariantOptions(GRAVEL_TIRE, tireSelection)[0].option.label}`,
          price: getConfiguredPrice(GRAVEL_TIRE, tireSelection),
          weight: GRAVEL_TIRE.weight,
          url: GRAVEL_TIRE.url,
        }
      : {
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
    ...(bottomBracket ? [{ id: 'bottomBracket', label: 'Innenlager', ...bottomBracket }] : []),
  ]
}
