/**
 * Kleine Volltextsuche für Shop und Tutorials – läuft komplett im Browser.
 * Versteht Umlaute (entlüften = entlueften = entluften), Tippfehler
 * (Drehmonent → Drehmoment), Wortanfänge (bremsl → Bremsleitung) und
 * gängige Synonyme (Inbus = Innensechskant). Alle Suchwörter müssen vorkommen.
 */

/** Ein durchsuchbares Feld mit Gewicht – Titel zählen mehr als Fließtext. */
export interface SearchField {
  text: string
  weight: number
}

export interface SearchDoc<T> {
  item: T
  fields: SearchField[]
}

interface IndexedField {
  norm: string
  words: string[]
  weight: number
}

interface IndexedDoc<T> {
  item: T
  fields: IndexedField[]
}

export interface SearchIndex<T> {
  docs: IndexedDoc<T>[]
}

export interface SearchHit<T> {
  item: T
  score: number
  /** Normalisierte Suchbegriffe (inkl. gefundener Tippfehler-Varianten) zum Hervorheben */
  terms: string[]
}

/** Gleichwertige Begriffe – jeweils in normalisierter Form. */
const SYNONYMS: string[][] = [
  ['inbus', 'innensechskant', 'imbus', 'sechskant', 'allen'],
  ['tretlager', 'innenlager'],
  ['tubeless', 'schlauchlos'],
  ['drehmoment', 'nm', 'anzugsmoment'],
  ['kettennieter', 'kettenwerkzeug', 'kettenniet'],
  ['entluften', 'entlueftung', 'bleed', 'bleeding'],
  ['mineralol', 'bremsflussigkeit', 'bremsol'],
  ['schaltwerk', 'derailleur'],
  ['umwerfer', 'frontschaltwerk'],
  ['montagestander', 'reparaturstander', 'radstander'],
  ['reifenheber', 'reifenhebel'],
  ['standpumpe', 'pumpe', 'luftpumpe'],
  ['expander', 'kralle', 'compression'],
  ['innenverlegung', 'innenverlegt', 'intern', 'kabelverlegung'],
  ['kassette', 'ritzelpaket', 'ritzel'],
  ['bremsbelage', 'belage', 'bremsbelag'],
  ['zentrieren', 'achter', 'seitenschlag'],
  ['montagepaste', 'carbonpaste', 'carbon-paste'],
]

/** Kleinschreibung, Umlaute vereinheitlichen, Sonderzeichen raus. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*|\[\[[\w-]+\||\]\]/g, '')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const SYNONYM_MAP = new Map<string, string[]>()
for (const group of SYNONYMS) {
  const norm = group.map(normalize)
  for (const word of norm) SYNONYM_MAP.set(word, norm)
}

export function buildIndex<T>(docs: SearchDoc<T>[]): SearchIndex<T> {
  return {
    docs: docs.map((doc) => ({
      item: doc.item,
      fields: doc.fields.map((f) => {
        const norm = normalize(f.text)
        return { norm, words: norm.split(' ').filter(Boolean), weight: f.weight }
      }),
    })),
  }
}

/** Levenshtein-Distanz, bricht ab sobald sie über `max` liegt. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, cur[j])
    }
    if (rowMin > max) return max + 1
    prev = cur
  }
  return prev[b.length]
}

/** Erlaubte Tippfehler je Wortlänge. */
function typoBudget(term: string): number {
  if (term.length >= 8) return 2
  if (term.length >= 5) return 1
  return 0
}

/** Punkte für einen Suchbegriff in einem Feld (0 = nicht gefunden) und die Wortform, die getroffen hat. */
function matchTerm(term: string, field: IndexedField, fuzzy: boolean): { score: number; hit?: string } {
  let best = 0
  let hit: string | undefined
  for (const word of field.words) {
    let s = 0
    if (word === term) s = 3
    else if (word.startsWith(term)) s = 2
    else if (term.length >= 3 && word.includes(term)) s = 1.2
    else if (fuzzy) {
      const budget = typoBudget(term)
      // Tippfehler: gegen das ganze Wort und gegen den gleich langen Wortanfang prüfen
      if (budget > 0 && (distance(term, word, budget) <= budget || distance(term, word.slice(0, term.length), budget) <= budget)) {
        s = 0.8
      }
    }
    if (s > best) {
      best = s
      hit = s === 0.8 ? word : term
    }
  }
  return { score: best * field.weight, hit }
}

/**
 * Sucht erst genau (Wort, Wortanfang, Teilwort). Nur wenn das nichts findet,
 * werden Tippfehler toleriert – so bleiben die Treffer bei richtiger Schreibweise präzise.
 */
export function search<T>(index: SearchIndex<T>, query: string, limit = 50): SearchHit<T>[] {
  const terms = normalize(query).split(' ').filter(Boolean)
  if (terms.length === 0) return []
  const exact = run(index, terms, false)
  return (exact.length > 0 ? exact : run(index, terms, true)).slice(0, limit)
}

function run<T>(index: SearchIndex<T>, terms: string[], fuzzy: boolean): SearchHit<T>[] {
  const hits: SearchHit<T>[] = []
  for (const doc of index.docs) {
    let total = 0
    const found: string[] = []
    let all = true
    for (const term of terms) {
      const variants = [term, ...(SYNONYM_MAP.get(term) ?? []).filter((s) => s !== term)]
      let termBest = 0
      for (const variant of variants) {
        const factor = variant === term ? 1 : 0.8
        for (const field of doc.fields) {
          const { score, hit } = matchTerm(variant, field, fuzzy)
          if (score > 0) {
            termBest = Math.max(termBest, score * factor)
            if (hit && !found.includes(hit)) found.push(hit)
          }
        }
      }
      if (termBest === 0) {
        all = false
        break
      }
      total += termBest
    }
    if (!all) continue
    // Ganze Suchphrase am Stück im Titel → nach oben
    const phrase = terms.join(' ')
    if (terms.length > 1 && doc.fields[0]?.norm.includes(phrase)) total *= 1.5
    hits.push({ item: doc.item, score: total, terms: found })
  }
  return hits.sort((a, b) => b.score - a.score)
}

/** Teilt Originaltext in Stücke, markiert die Stellen, deren normalisierte Form einen Suchbegriff enthält. */
export function highlight(text: string, terms: string[]): { text: string; mark: boolean }[] {
  if (terms.length === 0) return [{ text, mark: false }]
  return text.split(/(\s+)/).map((token) => {
    const norm = normalize(token)
    const mark = norm.length > 0 && terms.some((t) => norm.includes(t) || (t.length >= 4 && norm.startsWith(t.slice(0, -1))))
    return { text: token, mark }
  })
}

/** Ausschnitt rund um den ersten Treffer im Text, ca. `length` Zeichen. */
export function snippet(text: string, terms: string[], length = 150): string {
  const clean = text.replace(/\*\*|\[\[[\w-]+\||\]\]/g, '').replace(/\s+/g, ' ').trim()
  const words = clean.split(' ')
  const index = words.findIndex((w) => {
    const norm = normalize(w)
    return norm && terms.some((t) => norm.includes(t))
  })
  if (index < 0) return clean.length > length ? clean.slice(0, length).replace(/\s\S*$/, '') + ' …' : clean
  let start = index
  let size = words[index].length
  while (start > 0 && size < length / 3) size += words[--start].length + 1
  let end = index
  while (end < words.length - 1 && size < length) size += words[++end].length + 1
  return (start > 0 ? '… ' : '') + words.slice(start, end + 1).join(' ') + (end < words.length - 1 ? ' …' : '')
}
