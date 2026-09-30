import { ASSET_BASE } from './assets'
import type { CatalogFrame, CatalogGroupset, CatalogWheelset } from './parts'

/**
 * Werkzeug für den Aufbau. Bilder liegen in cdn/tools/<image> (Tabelle in
 * cdn/tools/README.md). Viele Angebote haben mehrere Versionen – `variant`
 * sagt, welche man beim Händler auswählen muss. Fehlt `url`, zeigt der Shop
 * „Link folgt“.
 */
export interface Tool {
  id: string
  name: string
  /** Wofür man es braucht – kurz und einsteigerfreundlich. */
  description: string
  /** Dateiname in cdn/tools/ */
  image: string
  url?: string
  /** Preis der empfohlenen Version beim Händler, ohne Versand */
  price?: number
  /** Welche Version beim Händler auswählen */
  variant?: string
  /** Unverzichtbar oder nur empfohlen */
  essential: boolean
}

const ALI = 'https://s.click.aliexpress.com/e/'

export const TOOLS: Tool[] = [
  {
    id: 'montagestaender',
    name: 'Montageständer',
    description: 'Hält das Bike in Arbeitshöhe – macht den Aufbau deutlich einfacher.',
    image: 'montagestaender.webp',
    url: `${ALI}_c41cRn5r`,
    price: 37.59,
    variant: 'steel 66lb (reicht für Rennrad und Gravel)',
    essential: false,
  },
  {
    id: 'werkzeugkoffer',
    name: 'Fahrrad-Werkzeugkoffer (44 Teile)',
    description:
      'Grundausstattung mit Kettennieter, Innensechskant 1,5–8 mm (8 mm für DUB-Kurbeln), Reifenhebern, Kassetten-Nuss, Speichen- und Maulschlüsseln.',
    image: 'werkzeugkoffer.webp',
    url: `${ALI}_c4TecGSd`,
    price: 26.19,
    variant: '1 Set',
    essential: true,
  },
  {
    id: 'inbus-set',
    name: 'Bit-Set mit T-Griff (Innensechskant + Torx)',
    description: 'Für Vorbau, Sattel, Bremsen und Steckachsen – die Bits passen auch auf den Drehmomentschlüssel.',
    image: 'inbus-set.webp',
    url: `${ALI}_c3LlwjaD`,
    price: 18.39,
    variant: '46PC',
    essential: true,
  },
  {
    id: 'drehmoment-set',
    name: 'Drehmomentschlüssel-Set 5–25 / 5–60 / 20–220 Nm',
    description:
      'Pflicht bei Carbon: 5–25 Nm für Vorbau, Lenker und Sattelstütze, 5–60 Nm für Innenlager, Kassette und Center-Lock-Scheiben.',
    image: 'drehmoment-set.webp',
    url: `${ALI}_c4rCxTFj`,
    price: 61.39,
    variant: 'MC9PCS',
    essential: true,
  },
  {
    id: 'innenlager-bsa24',
    name: 'Innenlager-Schlüssel 44 mm / 16 Zähne',
    description: 'Für BSA-Innenlager mit 24-mm-Achse (Shimano Hollowtech II, SENICX BSA-24 aus dem ER7-Set).',
    image: 'innenlager-bsa24.webp',
    url: `${ALI}_c3XRe4t3`,
    price: 5.59,
    variant: '44-16',
    essential: true,
  },
  {
    id: 'innenlager-dub',
    name: 'Innenlager-Schlüssel 46 mm / 24 Zähne (BSA-DUB)',
    description: 'Für BSA-DUB-Innenlager mit 29-mm-Achse, wie sie bei LTWOO R9 und GRT12 (ZRACE) im Set liegen.',
    image: 'innenlager-dub.webp',
    url: `${ALI}_c3XRe4t3`,
    price: 5.59,
    variant: '46-24',
    essential: true,
  },
  {
    id: 'innenlager-t47',
    name: 'T47-Innenlager-Aufsatz (MUQZI)',
    description:
      'Aufsatz für Knarre oder Drehmomentschlüssel. Die Größe hängt vom Innenlager ab (49 mm/12 Zähne, 50 oder 52 mm/16 Zähne) – im Zweifel das Set mit allen Größen.',
    image: 'innenlager-t47.webp',
    url: `${ALI}_c3LUtLrx`,
    price: 28.59,
    variant: '„1 Set Black“ (alle T47-Größen, passt sicher) – Einzelgrößen wie „T47-49-12T Black“ ab 7,69 €',
    essential: true,
  },
  {
    id: 'kurbel-kappe',
    name: 'Kurbelkappen-Werkzeug (Hollowtech II)',
    description: 'Stellt bei 24-mm-Kurbeln das Lagerspiel über die Kunststoffkappe ein.',
    image: 'kurbel-kappe.webp',
    url: `${ALI}_c3T67sXr`,
    variant: '„black“ (einzige Variante)',
    price: 2.79,
    essential: true,
  },
  {
    id: 'kassetten-werkzeug',
    name: 'Kassetten-Werkzeug + Kettenpeitsche',
    description:
      'Zieht den Verschlussring der Kassette und der Center-Lock-Bremsscheiben fest (Shimano HG). Die Kettenpeitsche hält die Kassette beim Abnehmen.',
    image: 'kassetten-werkzeug.webp',
    url: `${ALI}_c34zBO4Z`,
    price: 8.19,
    variant: 'Set',
    essential: true,
  },
  {
    id: 'kettenschloss-zange',
    name: 'Kettenschloss-Zange',
    description: 'Öffnet und schließt das Kettenschloss ohne Verletzungsgefahr.',
    image: 'kettenschloss-zange.webp',
    url: `${ALI}_c3Od1p37`,
    price: 4.09,
    variant: 'A model (öffnet und schließt)',
    essential: true,
  },
  {
    id: 'entlueftungs-kit',
    name: 'Entlüftungs-Kit für hydraulische Bremsen',
    description: 'Nach dem Kürzen der Bremsleitungen müssen die Bremsen entlüftet werden – mit Trichter, Spritzen und Adaptern.',
    image: 'entlueftungs-kit.webp',
    url: `${ALI}_c3udX5Ul`,
    price: 19.69,
    variant: 'STD',
    essential: true,
  },
  {
    id: 'mineraloel',
    name: 'Mineralöl für Bremsen',
    description: 'LTWOO-Bremsen laufen mit Mineralöl – auf keinen Fall DOT-Flüssigkeit einfüllen.',
    image: 'mineraloel.webp',
    url: `${ALI}_c3UnqBmh`,
    price: 5.99,
    variant: 'Red Fluid 1pcs (Mineral Oil) – nicht DOT',
    essential: true,
  },
  {
    id: 'leitungsschneider',
    name: 'Bremsleitungs-Schneider',
    description: 'Schneidet die Hydraulik-Bremsleitung sauber und gerade ab – ohne sie zu quetschen.',
    image: 'leitungsschneider.webp',
    url: `${ALI}_c3lsno7R`,
    variant: '„Jagwir 01“ (einzige Variante)',
    price: 7.39,
    essential: true,
  },
  {
    id: 'einpresswerkzeug',
    name: 'Einpresswerkzeug für Stützhülse + Olive',
    description: 'Presst nach dem Kürzen die Stützhülse (Nadel) in die Bremsleitung, damit Olive und Anschluss dicht sitzen.',
    image: 'einpresswerkzeug.webp',
    url: `${ALI}_c3sH0Djb`,
    price: 12.19,
    variant: 'Nylon and needle (oder „Nylon BH59 Set“ für 17,79 € mit Ersatz-Oliven)',
    essential: true,
  },
  {
    id: 'zugschneider',
    name: 'Seilzug- und Hüllenschneider',
    description: 'Kürzt Schaltzüge und -hüllen der mechanischen Schaltung sauber, ohne sie zu quetschen.',
    image: 'zugschneider.webp',
    url: `${ALI}_c4UcsYs1`,
    variant: '„2510160“ (einzige Variante)',
    price: 16.39,
    essential: true,
  },
  {
    id: 'innenverlegung',
    name: 'Werkzeug für innenverlegte Leitungen (Magnet-Set)',
    description: 'Fädelt Leitungen und Züge durch den Rahmen – bei voll integrierten Cockpits Gold wert.',
    image: 'innenverlegung.webp',
    url: `${ALI}_c3j6KvNJ`,
    price: 7.49,
    variant: 'Standard Model',
    essential: true,
  },
  {
    id: 'saegefuehrung',
    name: 'Sägeführung für Gabelschaft (Tube Holder)',
    description: 'Hält den Carbon-Gabelschaft fest und führt die Säge gerade. Zusammen mit der Bügelsäge kaufen.',
    image: 'saegefuehrung.webp',
    url: `${ALI}_c34Dxskp`,
    price: 28.39,
    variant: 'Tube Holder Blue (oder Black)',
    essential: true,
  },
  {
    id: 'buegelsaege',
    name: 'Bügelsäge 12"',
    description: 'Kürzt den Carbon-Gabelschaft – gleicher Link wie die Sägeführung, separat auswählen.',
    image: 'buegelsaege.webp',
    url: `${ALI}_c34Dxskp`,
    price: 17.89,
    variant: '12 inch Hacksaw Bow',
    essential: true,
  },
  {
    id: 'carbon-paste',
    name: 'Carbon-Montagepaste',
    description: 'Verhindert Rutschen bei Carbon-Klemmungen, damit du nicht zu fest anziehen musst.',
    image: 'carbon-paste.webp',
    url: `${ALI}_c3VFJzoV`,
    variant: '„as shows“ (einzige Variante)',
    price: 2.25,
    essential: true,
  },
  {
    id: 'montagefett',
    name: 'Montagefett',
    description: 'Für Gewinde von Innenlager, Pedalen und Steckachsen.',
    image: 'montagefett.webp',
    url: `${ALI}_c3NUi5Fb`,
    price: 3.65,
    variant: '50g',
    essential: true,
  },
  {
    id: 'reifenheber',
    name: 'Reifenheber (10 Stück)',
    description: 'Zum Aufziehen der Reifen und Einlegen der Schläuche.',
    image: 'reifenheber.webp',
    url: `${ALI}_c4nGJsbn`,
    variant: '„bicycle accessories“ (einzige Variante)',
    price: 4.59,
    essential: true,
  },
  {
    id: 'standpumpe',
    name: 'Standpumpe mit Manometer',
    description: 'Pumpt die Reifen auf den richtigen Druck – passt auf Sclaverand-Ventile.',
    image: 'standpumpe.webp',
    url: `${ALI}_c3S8leK5`,
    price: 30.99,
    variant: 'Long style-black',
    essential: true,
  },
]

export function toolImage(tool: Tool): string {
  return `${ASSET_BASE}/tools/${tool.image}`
}

function tool(id: string): Tool {
  const found = TOOLS.find((t) => t.id === id)
  if (!found) throw new Error(`Unbekanntes Werkzeug: ${id}`)
  return found
}

/** Werkzeug, das jedes Bike im Konfigurator braucht. */
const GENERAL_TOOL_IDS = [
  'werkzeugkoffer',
  'inbus-set',
  'drehmoment-set',
  'kassetten-werkzeug',
  'kettenschloss-zange',
  'entlueftungs-kit',
  'mineraloel',
  'leitungsschneider',
  'einpresswerkzeug',
  'innenverlegung',
  'saegefuehrung',
  'buegelsaege',
  'carbon-paste',
  'montagefett',
  'reifenheber',
  'standpumpe',
  'montagestaender',
]

/** Kurbeln mit 24-mm-Achse und Kunststoff-Einstellkappe (Hollowtech-Stil), Innenlager BSA-24. */
const HOLLOWTECH_GROUPSETS = ['groupset-ltwoo-er7']
/** Kurbeln mit DUB-Achse (29 mm) – Innenlager aus dem Set ist ein DUB-Lager. */
const DUB_GROUPSETS = ['groupset-ltwoo-r9', 'groupset-ltwoo-grt12']

export interface RequiredTool {
  tool: Tool
  /** Warum es für genau dieses Bike gebraucht wird */
  reason: string
}

export interface ToolList {
  specific: RequiredTool[]
  general: Tool[]
}

/** Werkzeugliste für eine Konfiguration: Spezialwerkzeug + allgemeines Werkzeug. */
export function getToolList(
  frame?: CatalogFrame,
  groupset?: CatalogGroupset,
  _wheels?: CatalogWheelset,
): ToolList {
  const specific: RequiredTool[] = []
  const isDub = Boolean(groupset && DUB_GROUPSETS.includes(groupset.id))

  if (frame?.bottomBracket === 'bsa') {
    specific.push(
      isDub
        ? { tool: tool('innenlager-dub'), reason: `${frame.name} hat BSA, die ${groupset!.name} bringt ein DUB-Innenlager mit.` }
        : { tool: tool('innenlager-bsa24'), reason: `${frame.name} hat ein BSA-Gewindetretlager.` },
    )
  } else if (frame?.bottomBracket === 't47') {
    specific.push({
      tool: tool('innenlager-t47'),
      reason: `${frame.name} hat T47 (86 mm) – dafür kommt das KOCEVLO-T47-Innenlager mit ${isDub ? '29-mm-Achse (DUB)' : '24-mm-Achse'} dazu.`,
    })
  }

  if (groupset && HOLLOWTECH_GROUPSETS.includes(groupset.id)) {
    specific.push({ tool: tool('kurbel-kappe'), reason: `Die Kurbel der ${groupset.name} wird über eine Kappe eingestellt.` })
  }

  if (groupset && groupset.kind !== 'elektronisch') {
    specific.push({ tool: tool('zugschneider'), reason: `Die ${groupset.name} schaltet mechanisch über Seilzüge.` })
  }

  const specificIds = new Set(specific.map((s) => s.tool.id))
  const general = GENERAL_TOOL_IDS.map(tool).filter((t) => !specificIds.has(t.id))
  return { specific, general }
}
