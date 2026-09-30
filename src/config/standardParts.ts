import {
  getConfiguredPrice,
  getConfiguredWeight,
  hasBottomBracketInSet,
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
  /** Was beim Händler genau auszuwählen ist (Variantennamen des Händlers). */
  shopChoice?: string
  price: number
  /** Fehlt, wenn der Händler kein Gewicht angibt. */
  weight?: number
  url: string
}

/** Ein einzelnes Händlerprodukt mit Preis/Gewicht fürs ganze Bike. */
export interface SimplePart {
  name: string
  price: number
  weight?: number
  url: string
  detail?: string
  /** Was beim Händler genau auszuwählen ist (Variantennamen des Händlers). */
  shopChoice?: string
}

/**
 * Pflegbare Daten der Standardkomponenten. Im Admin als Einstellung
 * `standard_parts` gespeichert; fehlt sie, gelten DEFAULT_STANDARD_PARTS.
 */
export interface StandardPartsConfig {
  saddle: SimplePart
  barTape: SimplePart
  /** Rennrad-Reifen, Preis/Gewicht für beide Reifen. */
  roadTire: SimplePart
  /** Gravel-Reifen mit wählbarer Breite, Preis/Gewicht je Reifen. */
  gravelTire: {
    brand: string
    name: string
    url: string
    options: { id: string; label: string; pricePerTire: number; weightPerTire?: number; shopLabel?: string }[]
    /** Farbe beim Händler, z. B. „Black“. */
    shopColor?: string
  }
  /** Schläuche, Preis fürs Set, Gewicht je Schlauch. */
  tubes: {
    name: string
    url: string
    price: number
    weightRoad: number
    weightGravel: number
    /** Händler-Varianten (Größe inkl. Stückzahl) für Rennrad und Gravel. */
    shopRoad?: string
    shopGravel?: string
  }
  /** Bremsscheiben je Größe in mm, Preis/Gewicht je Scheibe. */
  rotors: { name: string; url: string; sizes: Record<string, { price: number; weight: number }> }
  /** Bremsscheiben VR/HR, wenn der Rahmen nichts anderes vorgibt. */
  defaultRotors: [number, number]
  /**
   * Zusätzliches Innenlager je `<rahmen-id>|<schaltgruppen-id>`. Wird nur
   * gebraucht, wenn die Schaltgruppe kein passendes Lager mitbringt.
   */
  bottomBrackets: Record<string, SimplePart>
}

export const DEFAULT_STANDARD_PARTS: StandardPartsConfig = {
  saddle: {
    name: 'Elitaone Carbon-Sattel',
    price: 17.69,
    weight: 135,
    url: 'https://s.click.aliexpress.com/e/_c3ySK67f',
    shopChoice: 'keine Auswahl nötig (nur eine Variante)',
  },
  barTape: {
    name: 'BUCKLOS Lenkerband',
    price: 6.59,
    weight: 75,
    url: 'https://s.click.aliexpress.com/e/_c33BMsXn',
    shopChoice: 'Farbe nach Wunsch, z. B. „Black“',
  },
  roadTire: {
    name: 'Continental Grand Prix',
    detail: '2 Stück, 700 × 28C',
    shopChoice: '„700x28 Tubelss“ (schwarz), Menge 2',
    price: 2 * 33.79,
    weight: 2 * 360,
    url: 'https://s.click.aliexpress.com/e/_c2I9HvhX',
  },
  gravelTire: {
    brand: 'Continental',
    name: 'Continental Terra Trail',
    url: 'https://s.click.aliexpress.com/e/_c3UiXXvX',
    shopColor: 'Black',
    options: [
      { id: '40', label: '700 × 40C', pricePerTire: 40.39, weightPerTire: 460, shopLabel: '700x40c' },
      { id: '45', label: '700 × 45C', pricePerTire: 38.19, weightPerTire: 495, shopLabel: '700x45c' },
    ],
  },
  tubes: {
    name: 'Ridenow 700C TPU-Schläuche',
    url: 'https://s.click.aliexpress.com/e/_c3BJpVR3',
    price: 20.39,
    weightRoad: 24,
    weightGravel: 45,
    shopRoad: '24g 700x18-28C 2pc',
    shopGravel: '45g 700x32-47C 2pc',
  },
  rotors: {
    name: 'Bremsscheiben',
    url: 'https://s.click.aliexpress.com/e/_c3afRncd',
    sizes: {
      '140': { price: 11, weight: 121 },
      '160': { price: 7.89, weight: 143 },
      '180': { price: 14, weight: 160 },
      '203': { price: 15, weight: 190 },
    },
  },
  defaultRotors: [160, 160],
  // Die ER7 hat ein BSA-24-Lager im Set, GRT12 und R9 wahlweise BSA, BB86/92,
  // PF30 oder BB30. Der BXT Pro-145 hat T47 mit 86 mm breitem Gehäuse – dafür
  // kommt ein T47-Lager für 86–92 mm dazu (24-mm-Achse für die ER7, DUB für GRT12/R9).
  // T47-Lager für 68/73 mm (z. B. ZRACE ZR-T47) passen dort nicht.
  bottomBrackets: {
    'frame-bxt-pro-145|groupset-ltwoo-er7': {
      name: 'KOCEVLO Innenlager T47 86–92 mm',
      detail: 'T47 für 86-mm-Gehäuse, 24-mm-Achse',
      shopChoice: '„86-92 24mm Axle“',
      price: 18.99,
      url: 'https://de.aliexpress.com/item/1005011557312415.html',
    },
    'frame-bxt-pro-145|groupset-ltwoo-grt12': {
      name: 'KOCEVLO Innenlager T47 86–92 mm',
      detail: 'T47 für 86-mm-Gehäuse, 29-mm-Achse (DUB)',
      shopChoice: '„86-92 29mm Axle“',
      price: 18.99,
      url: 'https://de.aliexpress.com/item/1005011557312415.html',
    },
    'frame-bxt-pro-145|groupset-ltwoo-r9': {
      name: 'KOCEVLO Innenlager T47 86–92 mm',
      detail: 'T47 für 86-mm-Gehäuse, 29-mm-Achse (DUB)',
      shopChoice: '„86-92 29mm Axle“',
      price: 18.99,
      url: 'https://de.aliexpress.com/item/1005011557312415.html',
    },
  },
}

let config: StandardPartsConfig = DEFAULT_STANDARD_PARTS

/** Ersetzt die Standardkomponenten, z. B. durch die Einstellung aus der Datenbank. */
export function applyStandardParts(value: StandardPartsConfig) {
  config = value
}

/** Bike-Typen mit Straßen-/Gravel-Ausstattung (700C, Rennlenker). */
const SUPPORTED_BIKE_TYPES: BikeType[] = ['rennrad', 'gravel']

/** Gravel-Reifen als wählbares Teil (Preis/Gewicht für beide Reifen). */
export function getGravelTire() {
  const tire = config.gravelTire
  return {
    brand: tire.brand,
    name: tire.name,
    url: tire.url,
    price: 2 * (tire.options[0]?.pricePerTire ?? 0),
    variants: [
      {
        id: 'tireWidth',
        label: 'Reifenbreite',
        options: tire.options.map((o) => ({
          id: o.id,
          label: o.label,
          weight: o.weightPerTire !== undefined ? 2 * o.weightPerTire : undefined,
        })),
      },
    ] as VariantGroup[],
    priceTable: tire.options.map((o) => ({ when: { tireWidth: o.id }, price: 2 * o.pricePerTire })),
  }
}

function gravelTireShopChoice(tireVariants: VariantSelection): string {
  const tire = config.gravelTire
  const option = tire.options.find((o) => o.id === tireVariants.tireWidth) ?? tire.options[0]
  return [tire.shopColor && `„${tire.shopColor}“`, `„${option?.shopLabel ?? option?.label}“`, 'Menge 2']
    .filter(Boolean)
    .join(' · ')
}

/** Ventillänge der Schläuche passend zur Felgenhöhe. */
function valveLength(rimDepth: number | undefined): string {
  if (rimDepth === undefined) return 'Ventil passend zur Felgenhöhe'
  if (rimDepth <= 45) return '65-mm-Ventil'
  if (rimDepth <= 60) return '85-mm-Ventil'
  return '85-mm-Ventil + Ventilverlängerung'
}

/** Ventillänge als Händler-Variante (45, 65 oder 85 mm). */
function shopValve(rimDepth: number | undefined): string {
  if (rimDepth !== undefined && rimDepth > 45) return '„85mm“'
  return '„65mm“'
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
  const width = Number(getSelectedVariantOptions(getGravelTire(), tireVariants)[0]?.option.id)
  if (!wheels || max === undefined || !(width > max)) return undefined
  return `${wheels.name} empfiehlt Reifen bis ${max} mm – ${width} mm liegt darüber.`
}

export interface StandardPartsContext {
  frame?: CatalogFrame
  groupset?: CatalogGroupset
  wheels?: CatalogWheelset
  wheelsVariants?: VariantSelection
  tireVariants?: VariantSelection
}

function rotor(size: number) {
  return config.rotors.sizes[String(size)] ?? { price: 0, weight: 0 }
}

export function getStandardParts(
  bikeType: BikeType | null,
  { frame, groupset, wheels, wheelsVariants = {}, tireVariants = {} }: StandardPartsContext = {},
): StandardPart[] {
  if (!bikeType || !SUPPORTED_BIKE_TYPES.includes(bikeType)) return []

  const gravel = bikeType !== 'rennrad'
  const rim = selectedRim(wheels, wheelsVariants)
  const [front, rear] = frame?.brakeRotors ?? config.defaultRotors
  // Bringt die Schaltgruppe ein zum Rahmen passendes Lager mit, braucht es kein zusätzliches.
  const bottomBracketInSet = hasBottomBracketInSet(groupset, frame)
  const bottomBracket = bottomBracketInSet ? undefined : config.bottomBrackets[`${frame?.id}|${groupset?.id}`]
  const gravelTire = getGravelTire()

  return [
    { id: 'saddle', label: 'Sattel', ...config.saddle },
    { id: 'bartape', label: 'Lenkerband', ...config.barTape },
    gravel
      ? {
          id: 'tires',
          label: 'Reifen',
          name: gravelTire.name,
          detail: `2 Stück, ${getSelectedVariantOptions(gravelTire, tireVariants)[0]?.option.label ?? ''}`,
          shopChoice: gravelTireShopChoice(tireVariants),
          price: getConfiguredPrice(gravelTire, tireVariants),
          weight: getConfiguredWeight(gravelTire, tireVariants),
          url: gravelTire.url,
        }
      : { id: 'tires', label: 'Reifen', ...config.roadTire },
    {
      id: 'tubes',
      label: 'Schläuche',
      name: config.tubes.name,
      detail: `2 Stück, ${gravel ? 'Gravel 32–47C' : 'Rennrad 18–28C'}, ${valveLength(rim ? Number(rim.id) : undefined)}`,
      price: config.tubes.price,
      weight: 2 * (gravel ? config.tubes.weightGravel : config.tubes.weightRoad),
      url: config.tubes.url,
      shopChoice: [
        '„Presta Valve“',
        `„${gravel ? (config.tubes.shopGravel ?? '') : (config.tubes.shopRoad ?? '')}“`,
        shopValve(rim ? Number(rim.id) : undefined),
      ].join(' · '),
    },
    // Bringt die Schaltgruppe Bremsscheiben mit, braucht es keine zusätzlichen.
    ...(groupset?.includesRotors
      ? []
      : [
          {
            id: 'rotors',
            label: 'Bremsscheiben',
            name: config.rotors.name,
            detail: `VR ${front} mm · HR ${rear} mm`,
            price: rotor(front).price + rotor(rear).price,
            weight: rotor(front).weight + rotor(rear).weight,
            url: config.rotors.url,
            shopChoice: front === rear ? `„${front}“, Menge 2` : `1 × „${front}“ (VR) und 1 × „${rear}“ (HR)`,
          },
        ]),
    ...(bottomBracket ? [{ id: 'bottomBracket', label: 'Innenlager', ...bottomBracket }] : []),
  ]
}
