import { ASSET_BASE, partImage } from './assets'
import frameRennradAlu from '../assets/parts/frame/frame-rennrad-alu.svg'
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

// Produktfotos kommen von GitHub Pages (siehe ./assets.ts)
const frameSpcycleR088 = partImage('frame/spcycle-r088.png')
const frameBxtPro145 = partImage('frame/bxt-pro-145.png')
const frameBxtGravel135 = partImage('frame/bxt-gravel-135.png')
const wheelsEliteEnt20 = partImage('wheels/elitewheels-ent-2-0.png')
const wheelsEliteSlrGravel = partImage('wheels/elitewheels-slr-gravel.png')
const groupsetLtwooEr7 = partImage('groupset/ltwoo-er7.png')
const groupsetLtwooGrt12 = partImage('groupset/ltwoo-grt12.png')

// Komplettbike-Bilder als Vorschau für die Bike-Typ-Auswahl
const previewRennrad = `${ASSET_BASE}/bikes/bxtPro145_ent2_er7.png`
const previewGravel = `${ASSET_BASE}/bikes/bxtgravel135_slr_grt12.png`

/**
 * Lokale Platzhalter-Grafiken. In der Datenbank werden sie als
 * `local:<key>` gespeichert, weil sich die gebündelte URL bei jedem Build ändert.
 */
export const LOCAL_IMAGES: Record<string, string> = {
  'frame-rennrad-alu': frameRennradAlu,
  'frame-gravel-alu': frameGravelAlu,
  'frame-gravel-carbon': frameGravelCarbon,
  'frame-race-gravel-alu': frameRaceGravelAlu,
  'frame-race-gravel-carbon': frameRaceGravelCarbon,
  'frame-hardtail-mtb-alu': frameHardtailAlu,
  'frame-hardtail-mtb-carbon': frameHardtailCarbon,
  'wheels-alltag': wheelsAlltag,
  'wheels-sport': wheelsSport,
  'wheels-aero': wheelsAero,
  'groupset-einsteiger': groupsetEinsteiger,
  'groupset-mittelklasse': groupsetMittelklasse,
  'groupset-performance': groupsetPerformance,
}

/** `local:<key>` -> gebündelte Asset-URL, alles andere bleibt (http-URL). */
export function resolveImage(value: string): string {
  return value.startsWith('local:') ? (LOCAL_IMAGES[value.slice(6)] ?? '') : value
}

/** Umkehrung von resolveImage: gebündelte Asset-URL -> `local:<key>`. */
export function toStoredImage(url: string): string {
  const key = Object.keys(LOCAL_IMAGES).find((k) => LOCAL_IMAGES[k] === url)
  return key ? `local:${key}` : url
}

/**
 * Datenmodell für den Konfigurator.
 *
 * Die DEFAULT_*-Listen sind der mitgelieferte Katalog. Sobald die Datenbank
 * (Supabase, Tabelle `products`) geladen ist, ersetzt applyCatalog() sie –
 * gepflegt wird das Sortiment dann im Admin unter /admin.
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
    image: previewRennrad,
  },
  {
    id: 'gravel',
    name: 'Gravelbike',
    description: 'Vielseitig für Asphalt, Schotter und Waldwege – der Allrounder.',
    image: previewGravel,
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

/* ------------------------ Specs & Unterauswahlen ------------------------ */

/** Eine technische Angabe, z. B. { label: 'Rahmengewicht', value: '780 g ± 50 g' }. */
export interface PartSpec {
  label: string
  value: string
}

export interface VariantOption {
  id: string
  label: string
  /** Aufpreis gegenüber dem Grundpreis (0, wenn nicht angegeben). */
  priceDelta?: number
  /** Ersetzt das Gesamtgewicht des Teils, wenn diese Option gewählt ist (z. B. je Felgenhöhe). */
  weight?: number
  /** Specs, die nur für diese Option gelten (z. B. Felgenbreite je Felgenhöhe). */
  specs?: PartSpec[]
  /** Maximal empfohlene Reifenbreite in mm (Laufräder, je Felgenhöhe). */
  maxTireWidth?: number
}

/** Eine Unterauswahl eines Teils, z. B. "Rahmengröße" oder "Felgenhöhe". */
export interface VariantGroup {
  id: string
  label: string
  options: VariantOption[]
  /** Vorauswahl; ohne Angabe die erste Option. */
  defaultOptionId?: string
}

/** Gewählte Option je Unterauswahl: { [groupId]: optionId }. */
export type VariantSelection = Record<string, string>

interface ConfigurablePart {
  price: number
  /**
   * Gesamtgewicht in Gramm – immer als Summe aller mitgelieferten Teile
   * (z. B. Rahmen + Gabel + Stütze + Cockpit), keine Einzelgewichte.
   * Fehlt bei Platzhalter-Teilen ohne Herstellerangabe.
   */
  weight?: number
  /**
   * Kurzname für fertige Komplettbike-Bilder (cdn/bikes/):
   * `<rahmen>_<laufräder>_<schaltgruppe>`, z. B. spcycleR088_ent2_er7.
   */
  imageKey?: string
  /** Produktseite beim Händler (Affiliate-Link), auf die die Teileliste im Ergebnis verlinkt. */
  url?: string
  specs?: PartSpec[]
  variants?: VariantGroup[]
  /**
   * Preise, die von einer Kombination mehrerer Unterauswahlen abhängen
   * (z. B. Felgenhöhe × Lager). Die erste Zeile, deren `when` komplett zur
   * Auswahl passt, ersetzt den Grundpreis; Aufpreise kommen weiterhin dazu.
   */
  priceTable?: { when: VariantSelection; price: number }[]
}

export function getDefaultVariants(part: ConfigurablePart | undefined): VariantSelection {
  const selection: VariantSelection = {}
  for (const group of part?.variants ?? []) {
    selection[group.id] = group.defaultOptionId ?? group.options[0].id
  }
  return selection
}

/** Löst die gewählten Optionen auf – ungültige/fehlende Einträge fallen auf den Default zurück. */
export function getSelectedVariantOptions(
  part: ConfigurablePart | undefined,
  selection: VariantSelection,
): { group: VariantGroup; option: VariantOption }[] {
  return (part?.variants ?? []).map((group) => {
    const chosenId = selection[group.id] ?? group.defaultOptionId
    const option = group.options.find((o) => o.id === chosenId) ?? group.options[0]
    return { group, option }
  })
}

/** Grundpreis plus Aufpreise der gewählten Unterauswahlen. */
export function getConfiguredPrice(part: ConfigurablePart | undefined, selection: VariantSelection): number {
  if (!part) return 0
  const selected = getSelectedVariantOptions(part, selection)
  const chosen: VariantSelection = Object.fromEntries(selected.map(({ group, option }) => [group.id, option.id]))
  const basePrice =
    part.priceTable?.find(({ when }) => Object.entries(when).every(([groupId, optionId]) => chosen[groupId] === optionId))
      ?.price ?? part.price
  return selected.reduce((sum, { option }) => sum + (option.priceDelta ?? 0), basePrice)
}

/** Gesamtgewicht in Gramm inkl. gewählter Unterauswahl; undefined, wenn unbekannt. */
export function getConfiguredWeight(
  part: ConfigurablePart | undefined,
  selection: VariantSelection,
): number | undefined {
  if (!part) return undefined
  return getSelectedVariantOptions(part, selection).reduce<number | undefined>(
    (weight, { option }) => option.weight ?? weight,
    part.weight,
  )
}

/**
 * Setzt eine Unterauswahl fest, wenn das Teil diese Option überhaupt anbietet –
 * z. B. das Tretlager der Kurbel passend zum Rahmen.
 */
function lockIfOffered(
  locks: VariantSelection,
  part: ConfigurablePart | undefined,
  groupId: string,
  optionId: string | undefined,
) {
  const group = part?.variants?.find((g) => g.id === groupId)
  if (optionId && group?.options.some((o) => o.id === optionId)) locks[groupId] = optionId
}

/** Unterauswahlen der Schaltgruppe, die der Rahmen vorgibt (Tretlager). */
export function getGroupsetLocks(
  groupset: CatalogGroupset | undefined,
  frame: CatalogFrame | undefined,
): VariantSelection {
  const locks: VariantSelection = {}
  lockIfOffered(locks, groupset, 'bottomBracket', frame?.bottomBracket)
  return locks
}

/** Unterauswahlen der Laufräder, die die Schaltgruppe vorgibt (Freilauf passend zur Kassette). */
export function getWheelsLocks(
  wheels: CatalogWheelset | undefined,
  groupset: CatalogGroupset | undefined,
): VariantSelection {
  const locks: VariantSelection = {}
  lockIfOffered(locks, wheels, 'freehub', groupset?.freehub)
  return locks
}

function sizeOptions(sizesCm: number[]): VariantOption[] {
  return sizesCm.map((cm) => ({ id: `${cm}`, label: `${cm} cm` }))
}

const FINISH_GROUP: VariantGroup = {
  id: 'finish',
  label: 'Oberfläche',
  options: [
    { id: 'matt', label: 'Matt' },
    { id: 'glossy', label: 'Glänzend' },
  ],
}

/* ------------------------------- Rahmen ------------------------------- */

export type FrameMaterial = 'alu' | 'carbon'

export type BottomBracket = 'bsa' | 'bb86' | 'pf30' | 'bb30' | 't47'

export interface CatalogFrame extends ConfigurablePart {
  id: string
  bikeType: BikeType
  material: FrameMaterial
  /** Hersteller, nur bei echten Katalogprodukten gesetzt. */
  brand?: string
  name: string
  description: string
  price: number
  /** Freigestelltes PNG/SVG mit transparentem Hintergrund, Basis-Layer. */
  image: string
  /**
   * Echtes, freigestelltes Produktfoto: Geometrie/Nabenpositionen weichen von
   * den Platzhalter-SVGs ab, daher legt die Bike-Canvas keine Laufrad-/
   * Schaltungs-Layer darüber (layerPositions.ts ist darauf nicht kalibriert).
   */
  photo?: boolean
  /** Bremsscheiben-Größen VR/HR in mm für die Standardkomponenten (sonst 160/160). */
  brakeRotors?: [number, number]
  /** Tretlager-Standard; legt bei Kurbeln mit Tretlager-Auswahl die passende Variante fest. */
  bottomBracket?: BottomBracket
}

export const DEFAULT_FRAME_CATALOG: CatalogFrame[] = [
  // Rennrad
  { id: 'frame-rennrad-alu-basic', bikeType: 'rennrad', material: 'alu', name: 'Alu Race Einstieg', description: 'Leichter Alu-Rennradrahmen für den unkomplizierten Einstieg.', price: 199, image: frameRennradAlu },
  { id: 'frame-rennrad-alu-sport', bikeType: 'rennrad', material: 'alu', name: 'Alu Race Sport', description: 'Steiferes Rohrset für bessere Kraftübertragung bei flotter Fahrweise.', price: 349, image: frameRennradAlu },
  {
    id: 'frame-bxt-pro-145',
    imageKey: 'bxtPro145',
    bikeType: 'rennrad',
    material: 'carbon',
    brand: 'BXT',
    name: 'BXT Pro-145 Aero',
    description: 'Aero-Rennradrahmen aus Carbon inkl. Gabel, Sattelstütze und integriertem Cockpit.',
    price: 557.39,
    url: 'https://s.click.aliexpress.com/e/_c36p0Pxx',
    bottomBracket: 't47',
    // Rahmen 1050 + Lenker 390 + Gabel 430 + Sattelstütze 195
    weight: 2065,
    image: frameBxtPro145,
    photo: true,
    specs: [
      { label: 'Einsatz', value: 'Aero-Rennrad' },
      { label: 'Material', value: 'Carbon' },
      { label: 'Lieferumfang', value: 'Rahmen, Gabel, Sattelstütze, Lenker, Innenlager' },
      { label: 'Tretlager', value: 'T47-Gewinde, 86 mm breit – Innenlager liegt bei' },
      { label: 'Achsen VR/HR', value: '12 × 100 mm / 12 × 142 mm Steckachse' },
      { label: 'Bremsen', value: 'Flat Mount' },
      { label: 'Reifenfreiheit', value: 'max. 700 × 32C' },
    ],
    variants: [
      { id: 'size', label: 'Rahmengröße', options: sizeOptions([47, 50, 52, 54, 56, 58]), defaultOptionId: '54' },
      FINISH_GROUP,
    ],
  },
  {
    id: 'frame-spcycle-r088',
    imageKey: 'spcycleR088',
    bikeType: 'rennrad',
    material: 'carbon',
    brand: 'Spcycle',
    name: 'Spcycle R088',
    description: 'Leichtes Carbon-Set aus Rahmen, Gabel, Sattelstütze und integriertem Cockpit für agiles, direktes Fahrverhalten.',
    price: 629.39,
    url: 'https://s.click.aliexpress.com/e/_c4oN7F05',
    bottomBracket: 'bsa',
    // Rahmen 780 (± 50) + Gabel 395 + Sattelstütze 175 + Lenker HB-05 360 (± 20)
    weight: 1710,
    image: frameSpcycleR088,
    photo: true,
    specs: [
      { label: 'Einsatz', value: 'Rennrad' },
      { label: 'Material', value: 'Carbon' },
      {
        label: 'Lieferumfang',
        value: 'Rahmen, Gabel, Sattelstütze, Lenker/Vorbau (HB-05), Steuersatz, Sattelklemme, Steckachsen, UDH-Schaltauge, Di2-Akkuhalter',
      },
      { label: 'Lenker/Vorbau', value: 'HB-05, integriert, 130 mm Drop, 75 mm Reach' },
      { label: 'Tretlager', value: 'BSA-Gewinde, 68 mm' },
      { label: 'Achsen VR/HR', value: '12 × 100 mm / 12 × 142 mm Steckachse' },
      { label: 'Bremsen', value: 'Flat Mount, 140 oder 160 mm' },
      { label: 'Reifenfreiheit', value: 'max. 700 × 32C' },
    ],
    variants: [
      { id: 'size', label: 'Rahmengröße', options: sizeOptions([44, 49, 52, 54, 56, 58]), defaultOptionId: '54' },
      FINISH_GROUP,
      {
        id: 'color',
        label: 'Farbe',
        options: [
          { id: 'black', label: 'Schwarz' },
          { id: 'ud-carbon', label: 'UD Carbon' },
          { id: 'solid', label: 'Uni-Lackierung', priceDelta: 22.6 },
          { id: 'metallic', label: 'Metallic', priceDelta: 32.3 },
          { id: 'chameleon-blue', label: 'Chameleon Blau', priceDelta: 54.6 },
          { id: 'chameleon-green', label: 'Chameleon Grün', priceDelta: 54.6 },
          { id: 'chameleon-purple', label: 'Chameleon Lila', priceDelta: 54.6 },
        ],
      },
    ],
  },

  // Gravel
  { id: 'frame-gravel-alu-basic', bikeType: 'gravel', material: 'alu', name: 'Alu Gravel Einstieg', description: 'Robuster Alu-Gravelrahmen mit entspannter Sitzposition für lange Touren.', price: 229, image: frameGravelAlu },
  { id: 'frame-gravel-alu-sport', bikeType: 'gravel', material: 'alu', name: 'Alu Gravel Allround', description: 'Vielseitiger Alu-Rahmen mit viel Reifenfreiheit für Schotter und Asphalt.', price: 399, image: frameGravelAlu },
  {
    id: 'frame-bxt-gravel-135',
    imageKey: 'bxtGravel135',
    bikeType: 'gravel',
    material: 'carbon',
    brand: 'BXT',
    name: 'BXT Gravel-135',
    description: 'T1000-Carbon-Gravelrahmen mit Platz für 47-mm-Reifen, Steckachsen und Cockpit inklusive.',
    price: 548.39,
    url: 'https://s.click.aliexpress.com/e/_c3AqSCXf',
    brakeRotors: [160, 140],
    bottomBracket: 'bsa',
    // Rahmen 1140 (52 cm) + Lenker/Vorbau 380 + Gabel 490 + Sattelstütze 140
    weight: 2150,
    image: frameBxtGravel135,
    photo: true,
    specs: [
      { label: 'Einsatz', value: 'Gravel' },
      { label: 'Material', value: 'Carbon T1000' },
      { label: 'Lieferumfang', value: 'Rahmen, Gabel, Sattelstütze, Lenker/Vorbau' },
      { label: 'Gewichtsangabe', value: 'bezogen auf Rahmengröße 52 cm' },
      { label: 'Gabelschaft', value: '28,6 mm' },
      { label: 'Sattelstütze', value: '400 mm lang' },
      { label: 'Lenker/Vorbau', value: '12° Flare, 420 × 90 mm, schwarz matt' },
      { label: 'Achsen VR/HR', value: '12 × 100 mm / 12 × 142 mm Steckachse' },
      { label: 'Steuersatz', value: 'oben 1-1/2" (52 mm), unten 1-1/2" (52 mm)' },
      { label: 'Bremsen', value: 'Flat-Mount-Scheibenbremse VR/HR' },
      { label: 'Schaltung', value: 'mechanisch & Di2 kompatibel' },
      { label: 'Tretlager', value: 'BSA-Gewinde, 68 mm' },
      { label: 'Reifenfreiheit', value: '700C × 47 mm oder 27,5" × 2,1"' },
    ],
    variants: [
      { id: 'size', label: 'Rahmengröße', options: sizeOptions([49, 52, 54, 56, 58]), defaultOptionId: '54' },
      FINISH_GROUP,
    ],
  },
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

export interface CatalogGroupset extends ConfigurablePart {
  id: string
  bikeTypes: BikeType[]
  kind: GroupsetKind
  /** Hersteller, nur bei echten Katalogprodukten gesetzt. */
  brand?: string
  name: string
  description: string
  price: number
  /** Kleiner optionaler Layer (z. B. Kurbel/Schaltwerk-Icon). */
  image: string
  /**
   * Echtes Produktfoto statt freigestelltem Layer: wird nur auf der
   * Auswahlkarte gezeigt, nicht über den Rahmen auf die Bike-Canvas gelegt.
   */
  photo?: boolean
  /** Freilauf-Standard der Kassette; legt bei Laufrädern mit Freilauf-Auswahl die Variante fest. */
  freehub?: Freehub
  /** Bremsscheiben sind im Set – die Standard-Bremsscheiben entfallen. */
  includesRotors?: boolean
}

export type Freehub = 'shimano-hg' | 'sram-xdr' | 'shimano-ms'

export const DEFAULT_GROUPSET_CATALOG: CatalogGroupset[] = [
  // Mechanisch, 2-fach – passend für Rennrad, Gravel, Race-Gravel
  { id: 'groupset-2x-einsteiger', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Einsteiger-Schaltung', description: 'Zuverlässige 2-fach Schaltung mit großer Bandbreite – einfach zu warten.', price: 139, image: groupsetEinsteiger },
  { id: 'groupset-2x-mittelklasse', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Mittelklasse-Schaltung', description: 'Präzisere Gangwechsel und geringeres Gewicht als die Einsteigerstufe.', price: 299, image: groupsetMittelklasse },
  { id: 'groupset-2x-performance', bikeTypes: ['rennrad', 'gravel', 'race-gravel'], kind: 'mechanisch-2x', name: '2x Performance-Schaltung', description: 'Leichtbau-Komponenten für schnelle, verlustarme Gangwechsel.', price: 649, image: groupsetPerformance },

  // Mechanisch, 1-fach – passend für Gravel, Race-Gravel, Hardtail-MTB
  { id: 'groupset-1x-einsteiger', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x Einsteiger-Schaltung', description: 'Simple 1-fach Schaltung ohne Umwerfer – weniger Technik, weniger Wartung.', price: 159, image: groupsetEinsteiger },
  { id: 'groupset-1x-mittelklasse', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x Mittelklasse-Schaltung', description: 'Breite Kassette für viel Bandbreite bei nur einem Kettenblatt.', price: 329, image: groupsetMittelklasse },
  { id: 'groupset-1x-performance', bikeTypes: ['gravel', 'race-gravel', 'hardtail-mtb'], kind: 'mechanisch-1x', name: '1x12 Performance-Schaltung', description: 'Präzises 1x12-Setup mit Clutch-Schaltwerk für ruhigen Kettenlauf.', price: 679, image: groupsetPerformance },

  // Elektronisch – Premium-Option für Rennrad, Gravel, Race-Gravel
  {
    id: 'groupset-ltwoo-er7',
    imageKey: 'er7',
    bikeTypes: ['rennrad', 'gravel', 'race-gravel'],
    kind: 'elektronisch',
    brand: 'LTWOO',
    name: 'LTWOO ER7 2x12',
    description: 'Elektronische 2x12-Gruppe mit App-Einstellung, Scheibenbremsen und 50/34-Kurbel.',
    price: 568.39,
    url: 'https://s.click.aliexpress.com/e/_c4VO1vKZ',
    // ca. Gesamtgewicht der Gruppe
    weight: 2300,
    freehub: 'shimano-hg',
    image: groupsetLtwooEr7,
    photo: true,
    specs: [
      { label: 'Typ', value: 'Elektronisch, 2 × 12-fach' },
      {
        label: 'Lieferumfang',
        value: 'Schaltwerk, Umwerfer, Kassette, Kurbel, Innenlager BSA24, Kette, Akku, Bremssättel, Schalt-/Bremshebel',
      },
      { label: 'Schaltwerk', value: '10–12-fach per App, Kassette 11–32T, IPX7' },
      { label: 'Umwerfer', value: 'max. 54T, Kapazität 16T, Kettenlinie 44,5–46,5 mm, 61–66°' },
      { label: 'Stromversorgung', value: 'Akku in der Sattelstütze, Laden per USB-C' },
      { label: 'Kassette', value: 'ZRACE 12-fach, 11–32T, Shimano HG, Alu-Spider' },
      { label: 'Kurbel', value: 'L-TWOO (SENICX), 50/34T, 24-mm-Stahlachse' },
      { label: 'Innenlager', value: 'BSA-24 (98 g) im Set' },
      { label: 'Kette', value: 'L-TWOO 12-fach, 126 Glieder (KMC)' },
      { label: 'Bremsen', value: 'Bremssättel 198 g, Schalt-/Bremshebel 500 g (je Paar)' },
    ],
    variants: [
      {
        id: 'crankLength',
        label: 'Kurbellänge',
        defaultOptionId: '170',
        options: [
          { id: '165', label: '165 mm' },
          { id: '170', label: '170 mm' },
        ],
      },
    ],
  },
  {
    id: 'groupset-ltwoo-grt12',
    imageKey: 'grt12',
    bikeTypes: ['gravel', 'race-gravel'],
    kind: 'mechanisch-1x',
    brand: 'LTWOO',
    name: 'LTWOO GRT12 1x12',
    description: 'Mechanische 1x12-Gravelgruppe mit hydraulischen Scheibenbremsen und großer Kassette bis 50T.',
    price: 356.99,
    url: 'https://s.click.aliexpress.com/e/_c4Nf8s9j',
    weight: 2600,
    freehub: 'shimano-hg',
    includesRotors: true,
    image: groupsetLtwooGrt12,
    photo: true,
    specs: [
      { label: 'Typ', value: 'Mechanisch, 1 × 12-fach, GRX-Style' },
      { label: 'Lieferumfang', value: 'Schalt-/Bremshebel, Bremssättel, Schaltwerk, Kurbel, Kassette, Kette, Innenlager, 2 Bremsscheiben' },
      { label: 'Innenlager', value: 'im Set, passend zum Rahmen (BSA, BB86/92, PF30 oder BB30)' },
      { label: 'Kurbel', value: 'ZRACE, DUB-Achse 29 mm' },
      { label: 'Bremsscheiben', value: '2 × Center Lock im Set' },
      { label: 'Kassette', value: 'HG-Aufnahme – auf Rennrad-Freiläufen evtl. 1,85-mm-Spacer nötig' },
      { label: 'Bremsen', value: 'Hydraulische Scheibenbremsen inkl. Bremsscheiben' },
      { label: 'Material', value: 'Aluminium' },
    ],
    variants: [
      {
        id: 'cassette',
        label: 'Farbe / Kassette',
        options: [
          { id: 'silver-11-46', label: 'Silber, 11–46T' },
          { id: 'silver-11-50', label: 'Silber, 11–50T', priceDelta: 4.4 },
          { id: 'black-11-50', label: 'Schwarz, 11–50T', priceDelta: 28.4 },
          { id: 'gold-11-50', label: 'Gold, 11–50T', priceDelta: 40.4 },
        ],
      },
      {
        id: 'chainring',
        label: 'Kettenblatt',
        defaultOptionId: '40',
        options: ['38', '40', '42', '44'].map((teeth) => ({ id: teeth, label: `${teeth}T` })),
      },
      {
        id: 'bottomBracket',
        label: 'Tretlager',
        options: [
          { id: 'bsa', label: 'BSA' },
          { id: 'bb86', label: 'BB86/92' },
          { id: 'pf30', label: 'PF30' },
          { id: 'bb30', label: 'BB30' },
        ],
      },
      {
        id: 'crankLength',
        label: 'Kurbellänge',
        defaultOptionId: '170',
        options: [
          { id: '165', label: '165 mm' },
          { id: '170', label: '170 mm' },
          { id: '172.5', label: '172,5 mm' },
          { id: '175', label: '175 mm' },
        ],
      },
    ],
  },
]

/* ------------------------------ Laufräder ------------------------------ */

export type WheelMaterial = 'alu' | 'carbon'

export interface CatalogWheelset extends ConfigurablePart {
  id: string
  bikeTypes: BikeType[]
  material: WheelMaterial
  /** Hersteller, nur bei echten Katalogprodukten gesetzt. */
  brand?: string
  name: string
  description: string
  price: number
  image: string
  /**
   * Echtes Produktfoto statt freigestelltem Layer: wird nur auf der
   * Auswahlkarte gezeigt, nicht über den Rahmen auf die Bike-Canvas gelegt.
   */
  photo?: boolean
}

function rimSpecs(outer: string, inner: string, erd: string, tires: string): PartSpec[] {
  return [
    { label: 'Außenbreite', value: outer },
    { label: 'Innenbreite', value: inner },
    { label: 'ERD', value: erd },
    { label: 'Empfohlene Reifen', value: tires },
  ]
}

export const DEFAULT_WHEELS_CATALOG: CatalogWheelset[] = [
  { id: 'wheels-rennrad-alu-basic', bikeTypes: ['rennrad'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 119, image: wheelsAlltag },
  { id: 'wheels-rennrad-alu-sport', bikeTypes: ['rennrad'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 219, image: wheelsSport },
  {
    id: 'wheels-elitewheels-ent-2-0',
    imageKey: 'ent2',
    bikeTypes: ['rennrad', 'gravel', 'race-gravel'],
    material: 'carbon',
    brand: 'Elitewheels',
    name: 'Elitewheels ENT 2.0',
    description: 'Tubeless-Carbon-Laufradsatz in sechs Felgenhöhen – vom leichten Kletterer bis zum 82-mm-Aero-Laufrad.',
    price: 349,
    url: 'https://s.click.aliexpress.com/e/_c38esKvx',
    // Laufradsatz-Gewicht (± 4 %) hängt von der Felgenhöhe ab, siehe Optionen; 50 mm als Basis.
    weight: 1620,
    image: wheelsEliteEnt20,
    photo: true,
    specs: [
      { label: 'Material', value: 'Carbon' },
      { label: 'Laufradgröße', value: '700C' },
      { label: 'Reifen', value: 'Tubeless-ready' },
      { label: 'Achsen VR/HR', value: '12 × 100 mm / 12 × 142 mm Steckachse' },
      { label: 'Bremsscheiben-Aufnahme', value: 'Center Lock' },
    ],
    variants: [
      {
        id: 'rimDepth',
        label: 'Felgenhöhe',
        defaultOptionId: '50',
        options: [
          { id: '30', label: '30 mm', weight: 1563, maxTireWidth: 38, specs: rimSpecs('28 mm', '18,5 mm', '579 mm', '700 × 25–38C') },
          { id: '38', label: '38 mm', weight: 1573, maxTireWidth: 43, specs: rimSpecs('28 mm', '21 mm', '563 mm', '700 × 25–43C') },
          { id: '50', label: '50 mm', weight: 1620, maxTireWidth: 43, specs: rimSpecs('28 mm', '21 mm', '539 mm', '700 × 25–43C') },
          { id: '55', label: '55 mm', weight: 1715, maxTireWidth: 43, specs: rimSpecs('31 mm', '21 mm', '529 mm', '700 × 25–43C') },
          { id: '60', label: '60 mm', weight: 1768, maxTireWidth: 43, specs: rimSpecs('28 mm', '21 mm', '519 mm', '700 × 25–43C') },
          { id: '82', label: '82 mm', weight: 1943, maxTireWidth: 43, specs: rimSpecs('31 mm', '21 mm', '475 mm', '700 × 25–43C') },
        ],
      },
      {
        id: 'bearing',
        label: 'Lager',
        options: [
          { id: 'steel', label: 'Stahllager' },
          { id: 'ceramic', label: 'Keramiklager' },
        ],
      },
      {
        id: 'freehub',
        label: 'Freilauf',
        options: [
          { id: 'shimano-hg', label: 'Shimano HG 10/11/12-fach' },
          { id: 'sram-xdr', label: 'SRAM XDR 12-fach' },
          { id: 'shimano-ms', label: 'Shimano Micro Spline 12-fach' },
        ],
      },
    ],
    // Preis je Felgenhöhe × Lager
    priceTable: [
      ...['30', '38', '50'].flatMap((rimDepth) => [
        { when: { rimDepth, bearing: 'steel' }, price: 349.99 },
        { when: { rimDepth, bearing: 'ceramic' }, price: 394 },
      ]),
      ...['55', '60'].flatMap((rimDepth) => [
        { when: { rimDepth, bearing: 'steel' }, price: 356 },
        { when: { rimDepth, bearing: 'ceramic' }, price: 402 },
      ]),
      { when: { rimDepth: '82', bearing: 'steel' }, price: 364 },
      { when: { rimDepth: '82', bearing: 'ceramic' }, price: 409 },
    ],
  },
  { id: 'wheels-rennrad-carbon-aero', bikeTypes: ['rennrad'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 649, image: wheelsAero },

  {
    id: 'wheels-elitewheels-slr-gravel',
    imageKey: 'slr',
    bikeTypes: ['gravel', 'race-gravel'],
    material: 'carbon',
    brand: 'Elitewheels',
    name: 'Elitewheels SLR Gravel',
    description: 'Breiter Tubeless-Carbon-Laufradsatz für Gravel mit 24–25 mm Innenweite und Platz für bis zu 50-mm-Reifen.',
    price: 446.99,
    url: 'https://s.click.aliexpress.com/e/_c3hizf8z',
    // Laufradsatz-Gewicht (± 4 %) hängt von der Felgenhöhe ab, siehe Optionen; 38 mm als Basis.
    weight: 1558,
    image: wheelsEliteSlrGravel,
    photo: true,
    specs: [
      { label: 'Material', value: 'Carbon' },
      { label: 'Laufradgröße', value: '700C' },
      { label: 'Achsen VR/HR', value: '12 × 100 mm / 12 × 142 mm Steckachse' },
      { label: 'Bremsscheiben-Aufnahme', value: 'Center Lock' },
    ],
    variants: [
      {
        id: 'rimDepth',
        label: 'Felgenhöhe',
        defaultOptionId: '38',
        options: [
          { id: '35', label: '35 mm', weight: 1581, maxTireWidth: 50, specs: rimSpecs('34 mm', '25 mm', '569 mm', '700 × 32–50C') },
          { id: '38', label: '38 mm', weight: 1558, maxTireWidth: 50, specs: rimSpecs('32,5 mm', '25 mm', '563 mm', '700 × 32–50C') },
          { id: '45', label: '45 mm', weight: 1629, maxTireWidth: 45, specs: rimSpecs('34 mm', '24 mm', '549 mm', '700 × 28–45C') },
        ],
      },
      {
        id: 'bearing',
        label: 'Lager',
        options: [
          { id: 'steel', label: 'Stahllager' },
          { id: 'ceramic', label: 'Keramiklager', priceDelta: 37.4 },
        ],
      },
      {
        id: 'freehub',
        label: 'Freilauf',
        options: [{ id: 'shimano-hg', label: 'Shimano HG 10/11/12-fach' }],
      },
    ],
  },
  { id: 'wheels-gravel-alu-basic', bikeTypes: ['gravel'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 139, image: wheelsAlltag },
  { id: 'wheels-gravel-alu-sport', bikeTypes: ['gravel'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 249, image: wheelsSport },
  { id: 'wheels-gravel-carbon-aero', bikeTypes: ['gravel'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 699, image: wheelsAero },

  { id: 'wheels-race-gravel-alu-basic', bikeTypes: ['race-gravel'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile Alu-Laufräder für den Alltag – langlebig und pflegeleicht.', price: 129, image: wheelsAlltag },
  { id: 'wheels-race-gravel-alu-sport', bikeTypes: ['race-gravel'], material: 'alu', name: 'Alu-Laufräder Sport', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten.', price: 239, image: wheelsSport },
  { id: 'wheels-race-gravel-carbon-aero', bikeTypes: ['race-gravel'], material: 'carbon', name: 'Carbon-Laufräder Aero', description: 'Aerodynamische Carbon-Laufräder für maximale Performance.', price: 679, image: wheelsAero },

  { id: 'wheels-hardtail-alu-basic', bikeTypes: ['hardtail-mtb'], material: 'alu', name: 'Alu-Laufräder Alltag', description: 'Stabile, breite Alu-Laufräder für den Alltag auf dem Trail.', price: 149, image: wheelsAlltag },
  { id: 'wheels-hardtail-alu-sport', bikeTypes: ['hardtail-mtb'], material: 'alu', name: 'Alu-Laufräder Trail', description: 'Leichtere Alu-Laufräder für spürbar agileres Fahrverhalten im Gelände.', price: 269, image: wheelsSport },
  { id: 'wheels-hardtail-carbon-trail', bikeTypes: ['hardtail-mtb'], material: 'carbon', name: 'Carbon-Laufräder Trail', description: 'Steife, leichte Carbon-Laufräder für effizienten Vortrieb im Gelände.', price: 449, image: wheelsAero },
  { id: 'wheels-hardtail-carbon-race', bikeTypes: ['hardtail-mtb'], material: 'carbon', name: 'Carbon-Laufräder Race', description: 'Renntaugliche Carbon-Laufräder für maximale Effizienz im Wettkampf.', price: 719, image: wheelsAero },
]

/* ------------------------------ Katalog -------------------------------- */

let frameCatalog = DEFAULT_FRAME_CATALOG
let groupsetCatalog = DEFAULT_GROUPSET_CATALOG
let wheelsCatalog = DEFAULT_WHEELS_CATALOG

export type ProductCategory = 'frame' | 'groupset' | 'wheels'

export interface CatalogData {
  frames: CatalogFrame[]
  groupsets: CatalogGroupset[]
  wheels: CatalogWheelset[]
}

/** Ersetzt den Katalog, z. B. durch die Produkte aus der Datenbank. */
export function applyCatalog(data: CatalogData) {
  frameCatalog = data.frames
  groupsetCatalog = data.groupsets
  wheelsCatalog = data.wheels
}

/* ------------------------------ Lookups -------------------------------- */

export function getFrameById(id: string | null): CatalogFrame | undefined {
  return frameCatalog.find((f) => f.id === id)
}

export function getGroupsetById(id: string | null): CatalogGroupset | undefined {
  return groupsetCatalog.find((g) => g.id === id)
}

export function getWheelsById(id: string | null): CatalogWheelset | undefined {
  return wheelsCatalog.find((w) => w.id === id)
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

export interface Suggestion<T> {
  /** Alle passenden Teile, günstigste zuerst. */
  options: T[]
  /** Das Teil, das am besten zur Preisspanne des Budgets passt. */
  recommendedId?: string
}

/**
 * Zeigt immer alle Teile des Bike-Typs, nach Preis aufsteigend (günstiger
 * links, teurer rechts). Empfohlen wird das Teil, dessen Preis am nächsten an
 * der Mitte der Budget-Preisspanne liegt – bevorzugt eines innerhalb der Spanne.
 */
function suggestByBracket<T extends { id: string; price: number }>(items: T[], bracket: PriceBracket): Suggestion<T> {
  const options = [...items].sort((a, b) => a.price - b.price)
  const center = (bracket.min + bracket.max) / 2
  const inBracket = options.filter((item) => item.price >= bracket.min && item.price <= bracket.max)
  const candidates = inBracket.length > 0 ? inBracket : options
  const recommended = candidates.reduce<T | undefined>(
    (best, item) => (!best || Math.abs(item.price - center) < Math.abs(best.price - center) ? item : best),
    undefined,
  )
  return { options, recommendedId: recommended?.id }
}

export function suggestFrames(bikeType: BikeType, budget: number): Suggestion<CatalogFrame> {
  const matches = frameCatalog.filter((f) => f.bikeType === bikeType)
  return suggestByBracket(matches, getPriceBracket('frame', budget))
}

export function suggestGroupsets(bikeType: BikeType, budget: number): Suggestion<CatalogGroupset> {
  const matches = groupsetCatalog.filter((g) => g.bikeTypes.includes(bikeType))
  return suggestByBracket(matches, getPriceBracket('groupset', budget))
}

export function suggestWheels(bikeType: BikeType, budget: number): Suggestion<CatalogWheelset> {
  const matches = wheelsCatalog.filter((w) => w.bikeTypes.includes(bikeType))
  return suggestByBracket(matches, getPriceBracket('wheels', budget))
}

export const BUDGET_RANGE = {
  min: 300,
  max: 2000,
  step: 50,
  default: 900,
}
