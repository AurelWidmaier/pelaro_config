import {
  getConfiguredPrice,
  getConfiguredWeight,
  getGroupsetLocks,
  getSelectedVariantOptions,
  type BikeType,
  type CatalogFrame,
  type CatalogGroupset,
  type CatalogWheelset,
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
  160: { price: 7.89, weight: 143 },
  180: { price: 14, weight: 160 },
  203: { price: 15, weight: 190 },
}

/**
 * Gravel-Reifen (Gravel & Race-Gravel) mit wählbarer Breite. Preise gelten
 * je Reifen, das Bike bekommt zwei (40C ca. 460 g, 45C ca. 495 g).
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
        { id: '40', label: '700 × 40C', weight: 2 * 460 },
        { id: '45', label: '700 × 45C', weight: 2 * 495 },
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
 * die Schaltgruppe kein passendes Lager mitbringt: Die ER7 hat ein BSA-24-Lager
 * im Set, die GRT12 wahlweise BSA, BB86/92, PF30 oder BB30, und der BXT Pro-145
 * bringt sein T47-Lager selbst mit.
 */
const BOTTOM_BRACKETS: Record<string, Omit<StandardPart, 'id' | 'label'>> = {
  // T47 ist nicht unter den GRT12-Lagern
  'frame-bxt-pro-145|groupset-ltwoo-grt12': {
    name: 'ZRACE Innenlager T47-DUB',
    detail: 'T47, 29-mm-Achse',
    price: 22.19,
    weight: 129,
    url: 'https://s.click.aliexpress.com/e/_c3yXlbbL',
  },
}

/** Ventillänge der Schläuche passend zur Felgenhöhe. */
function valveLength(rimDepth: number | undefined): string {
  if (rimDepth === undefined) return 'Ventil passend zur Felgenhöhe'
  if (rimDepth <= 45) return '65-mm-Ventil'
  if (rimDepth <= 60) return '85-mm-Ventil'
  return '85-mm-Ventil + Ventilverlängerung'
}

function selectedRim(wheels: CatalogWheelset | undefined, wheelsVariants: VariantSelection) {
  return getSelectedVariantOptions(wheels, wheelsVariants).find(({ group }) => group.id === 'rimDepth')?.option
}

/**
 * Warnung, wenn der Gravel-Reifen breiter ist, als die gewählte Felge
 * empfiehlt (z. B. ENT 2.0: max. 43C).
 */
export function getTireWarning(
  wheels: CatalogWheelset | undefined,
  wheelsVariants: VariantSelection,
  tireVariants: VariantSelection,
): string | undefined {
  const max = selectedRim(wheels, wheelsVariants)?.maxTireWidth
  const width = Number(getSelectedVariantOptions(GRAVEL_TIRE, tireVariants)[0].option.id)
  if (!wheels || max === undefined || width <= max) return undefined
  return `${wheels.name} empfiehlt Reifen bis ${max} mm – ${width} mm liegt darüber.`
}

export interface StandardPartsContext {
  frame?: CatalogFrame
  groupset?: CatalogGroupset
  wheels?: CatalogWheelset
  wheelsVariants?: VariantSelection
  tireVariants?: VariantSelection
}

/** Bremsscheiben VR/HR, wenn der Rahmen nichts anderes vorgibt. */
const DEFAULT_ROTORS: [number, number] = [160, 160]

export function getStandardParts(
  bikeType: BikeType | null,
  { frame, groupset, wheels, wheelsVariants = {}, tireVariants = {} }: StandardPartsContext = {},
): StandardPart[] {
  if (!bikeType || !SUPPORTED_BIKE_TYPES.includes(bikeType)) return []

  const gravelTubes = bikeType !== 'rennrad'
  const rim = selectedRim(wheels, wheelsVariants)
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
          detail: `2 Stück, ${getSelectedVariantOptions(GRAVEL_TIRE, tireVariants)[0].option.label}`,
          price: getConfiguredPrice(GRAVEL_TIRE, tireVariants),
          weight: getConfiguredWeight(GRAVEL_TIRE, tireVariants),
          url: GRAVEL_TIRE.url,
        }
      : {
          id: 'tires',
          label: 'Reifen',
          name: 'Continental Grand Prix',
          detail: '2 Stück, 700 × 25/28C',
          price: 2 * 33.79,
          weight: 2 * 360,
          url: 'https://s.click.aliexpress.com/e/_c2I9HvhX',
        },
    {
      id: 'tubes',
      label: 'Schläuche',
      name: 'Ridenow 700C TPU-Schläuche',
      detail: `2 Stück, ${gravelTubes ? 'Gravel 32–47C' : 'Rennrad 18–32C'}, ${valveLength(rim ? Number(rim.id) : undefined)}`,
      price: 20.39,
      weight: 2 * (gravelTubes ? 45 : 24),
      url: 'https://s.click.aliexpress.com/e/_c3BJpVR3',
    },
    // Bringt die Schaltgruppe Bremsscheiben mit, braucht es keine zusätzlichen.
    ...(groupset?.includesRotors
      ? []
      : [
          {
            id: 'rotors',
            label: 'Bremsscheiben',
            name: 'Bremsscheiben',
            detail: `VR ${front} mm · HR ${rear} mm`,
            price: ROTORS[front].price + ROTORS[rear].price,
            weight: ROTORS[front].weight + ROTORS[rear].weight,
            url: 'https://s.click.aliexpress.com/e/_c3afRncd',
          },
        ]),
    ...(bottomBracket ? [{ id: 'bottomBracket', label: 'Innenlager', ...bottomBracket }] : []),
  ]
}
