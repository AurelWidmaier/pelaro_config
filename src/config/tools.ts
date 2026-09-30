import { ASSET_BASE } from './assets'
import type { CatalogFrame, CatalogGroupset, CatalogWheelset } from './parts'

/**
 * Werkzeug für den Aufbau. Bilder liegen in cdn/tools/<image>, Händler-Links
 * werden nachgetragen (siehe cdn/tools/README.md). Fehlt der Link, zeigt der
 * Shop „Link folgt“.
 */
export interface Tool {
  id: string
  name: string
  /** Wofür man es braucht – kurz und einsteigerfreundlich. */
  description: string
  /** Dateiname in cdn/tools/ */
  image: string
  url?: string
  price?: number
  /** Unverzichtbar oder nur empfohlen */
  essential: boolean
}

export const TOOLS: Tool[] = [
  { id: 'montagestaender', name: 'Montageständer', description: 'Hält das Bike in Arbeitshöhe – macht den Aufbau deutlich einfacher.', image: 'montagestaender.png', essential: false },
  { id: 'inbus-set', name: 'Innensechskant-Set 2–10 mm + Torx T25', description: 'Für fast alle Schrauben: Vorbau, Sattel, Bremsen, Steckachsen und Kurbel (8 mm).', image: 'inbus-set.png', essential: true },
  { id: 'drehmoment-klein', name: 'Drehmomentschlüssel 2–24 Nm', description: 'Pflicht bei Carbon: Vorbau, Sattelstütze und Lenker nur mit dem vorgegebenen Drehmoment anziehen.', image: 'drehmoment-klein.png', essential: true },
  { id: 'drehmoment-gross', name: 'Drehmomentschlüssel 20–60 Nm', description: 'Für Innenlager, Kassette und Center-Lock-Bremsscheiben (ca. 35–50 Nm).', image: 'drehmoment-gross.png', essential: true },
  { id: 'innenlager-bsa', name: 'Innenlagerschlüssel BSA 44 mm, 16 Zähne', description: 'Schraubt das BSA-Innenlager ein (Shimano Hollowtech II / SRAM DUB BSA). Passt auch für außenverzahnte Center-Lock-Ringe.', image: 'innenlager-bsa.png', essential: true },
  { id: 'innenlager-t47', name: 'Innenlagerschlüssel T47', description: 'Schraubt das T47-Innenlager ein. Die Größe hängt vom Lager ab – meist 49 mm mit 12 Zähnen.', image: 'innenlager-t47.png', essential: true },
  { id: 'kurbel-kappe', name: 'Kurbelkappen-Werkzeug (Shimano TL-FC16/18)', description: 'Stellt bei 24-mm-Kurbeln das Lagerspiel über die Kunststoffkappe ein.', image: 'kurbel-kappe.png', essential: true },
  { id: 'kassetten-werkzeug', name: 'Kassetten- & Center-Lock-Werkzeug (Shimano HG)', description: 'Zieht den Verschlussring der Kassette und der Center-Lock-Bremsscheiben fest.', image: 'kassetten-werkzeug.png', essential: true },
  { id: 'kettenpeitsche', name: 'Kettenpeitsche', description: 'Hält die Kassette fest, wenn du sie später wieder abnehmen willst.', image: 'kettenpeitsche.png', essential: false },
  { id: 'kettennieter', name: 'Kettennieter 11/12-fach', description: 'Kürzt die Kette auf die passende Länge.', image: 'kettennieter.png', essential: true },
  { id: 'kettenschloss-zange', name: 'Kettenschloss-Zange', description: 'Öffnet und schließt das Kettenschloss ohne Verletzungsgefahr.', image: 'kettenschloss-zange.png', essential: true },
  { id: 'entlueftungs-kit', name: 'Entlüftungs-Kit + Mineralöl (Shimano-kompatibel)', description: 'Nach dem Kürzen der Bremsleitungen müssen die hydraulischen Bremsen entlüftet werden.', image: 'entlueftungs-kit.png', essential: true },
  { id: 'leitungsschneider', name: 'Hydraulikleitungs-Schneider + Einpresswerkzeug', description: 'Schneidet die Bremsleitung sauber ab und presst Stützhülse und Olive ein.', image: 'leitungsschneider.png', essential: true },
  { id: 'zugschneider', name: 'Seilzug- und Hüllenschneider', description: 'Für die Schaltzüge der mechanischen Schaltung – normale Zangen quetschen die Hülle.', image: 'zugschneider.png', essential: true },
  { id: 'innenverlegung', name: 'Werkzeug für innenverlegte Leitungen (Magnet-Set)', description: 'Fädelt Leitungen und Züge durch den Rahmen – bei voll integrierten Cockpits Gold wert.', image: 'innenverlegung.png', essential: true },
  { id: 'carbon-saege', name: 'Carbon-Säge mit Sägeführung', description: 'Kürzt den Carbon-Gabelschaft sauber und gerade auf deine Sitzhöhe.', image: 'carbon-saege.png', essential: true },
  { id: 'carbon-paste', name: 'Carbon-Montagepaste', description: 'Verhindert Rutschen bei Carbon-Klemmungen, damit du nicht zu fest anziehen musst.', image: 'carbon-paste.png', essential: true },
  { id: 'montagefett', name: 'Montagefett', description: 'Für Gewinde von Innenlager, Pedalen und Steckachsen.', image: 'montagefett.png', essential: true },
  { id: 'schraubensicherung', name: 'Schraubensicherung mittelfest', description: 'Für Bremsscheiben- und Bremssattelschrauben.', image: 'schraubensicherung.png', essential: false },
  { id: 'reifenheber', name: 'Reifenheber', description: 'Zum Aufziehen der Reifen und Einlegen der Schläuche.', image: 'reifenheber.png', essential: true },
  { id: 'standpumpe', name: 'Standpumpe mit Manometer (Sclaverand)', description: 'Pumpt die Reifen auf den richtigen Druck.', image: 'standpumpe.png', essential: true },
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
  'montagestaender',
  'inbus-set',
  'drehmoment-klein',
  'drehmoment-gross',
  'kassetten-werkzeug',
  'kettennieter',
  'kettenschloss-zange',
  'entlueftungs-kit',
  'leitungsschneider',
  'innenverlegung',
  'carbon-saege',
  'carbon-paste',
  'montagefett',
  'schraubensicherung',
  'reifenheber',
  'standpumpe',
  'kettenpeitsche',
]

/** Kurbeln mit 24-mm-Achse und Kunststoff-Einstellkappe (Hollowtech-Stil). */
const CAP_CRANK_GROUPSETS = ['groupset-ltwoo-er7']

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

  if (frame?.bottomBracket === 'bsa') {
    specific.push({ tool: tool('innenlager-bsa'), reason: `${frame.name} hat ein BSA-Gewindetretlager.` })
  } else if (frame?.bottomBracket === 't47') {
    specific.push({ tool: tool('innenlager-t47'), reason: `${frame.name} hat ein T47-Gewindetretlager.` })
  }

  if (groupset && CAP_CRANK_GROUPSETS.includes(groupset.id)) {
    specific.push({ tool: tool('kurbel-kappe'), reason: `Die Kurbel der ${groupset.name} wird über eine Kappe eingestellt.` })
  }

  if (groupset && groupset.kind !== 'elektronisch') {
    specific.push({ tool: tool('zugschneider'), reason: `Die ${groupset.name} schaltet mechanisch über Seilzüge.` })
  }

  const specificIds = new Set(specific.map((s) => s.tool.id))
  const general = GENERAL_TOOL_IDS.map(tool).filter((t) => !specificIds.has(t.id))
  return { specific, general }
}
