import { useMemo, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Highlighted, SearchField } from '../../components/SearchField'
import { TUTORIAL, TUTORIAL_VIDEOS, type TutorialBlock, type TutorialGroup, type TutorialSection } from '../../content/tutorial'
import { buildIndex, highlight, search, snippet } from '../../lib/search'
import { tutorialGroupPath } from '../../seo/pages'
import styles from './Tutorial.module.css'

interface Entry {
  group: TutorialGroup
  section: TutorialSection
  body: string
}

function blockText(block: TutorialBlock): string[] {
  switch (block.type) {
    case 'p':
    case 'tip':
    case 'warning':
      return [block.text]
    case 'steps':
    case 'list':
    case 'checklist':
      return block.items
    case 'table':
      return [...block.head, ...block.rows.flat(), block.note ?? '']
    case 'terms':
      return block.items.map(([term, def]) => `${term}: ${def}`)
  }
}

let cachedIndex: ReturnType<typeof buildIndex<Entry>> | null = null

/** Index über alle Anleitungen – wird beim ersten Tippen einmal aufgebaut. */
function tutorialIndex() {
  cachedIndex ??= buildIndex(
    TUTORIAL.flatMap((group) =>
      group.sections.map((section) => {
        const videos = TUTORIAL_VIDEOS.filter((v) => v.section === section.id)
        const body = section.blocks.flatMap(blockText).join(' ')
        const item: Entry = { group, section, body }
        return {
          item,
          fields: [
            { text: section.title, weight: 10 },
            { text: section.summary, weight: 5 },
            { text: section.blocks.map((b) => ('title' in b ? (b.title ?? '') : '')).join(' '), weight: 4 },
            { text: `${group.title} ${group.heading}`, weight: 2 },
            { text: videos.map((v) => `${v.title} ${v.description}`).join(' '), weight: 2 },
            { text: body, weight: 1 },
          ],
        }
      }),
    ),
  )
  return cachedIndex
}

const SUGGESTIONS = ['Kette kürzen', 'Bremsen entlüften', 'Drehmoment', 'Schaltwerk einstellen', 'Tubeless', 'Gabelschaft kürzen']
const PAGE_SIZE = 8

/**
 * Suche über alle Tutorials. Die Suchanfrage steht als ?q= in der URL – Ergebnisse
 * lassen sich so teilen und der Zurück-Button funktioniert.
 */
export function TutorialSearch() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') ?? ''
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(PAGE_SIZE)

  const hits = useMemo(() => (query.trim() ? search(tutorialIndex(), query) : []), [query])
  const visible = hits.slice(0, shown)

  function setQuery(value: string) {
    setActive(0)
    setShown(PAGE_SIZE)
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const href = (e: Entry) => `${tutorialGroupPath(e.group)}#${e.section.id}`

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (visible.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      navigate(href(visible[active].item))
    }
  }

  return (
    <div className={styles.search}>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Anleitung suchen, z. B. „Kette kürzen“ oder „Drehmoment Vorbau“"
        label="Tutorials durchsuchen"
        onKeyDown={onKeyDown}
        listId="tutorial-search-results"
        activeId={visible.length ? `tutorial-hit-${active}` : undefined}
        expanded={visible.length > 0}
      />

      {query.trim() && (
        <div className={styles.searchResults}>
          <p className={styles.searchCount} role="status">
            {hits.length === 0
              ? `Keine Anleitung zu „${query.trim()}“ gefunden.`
              : `${hits.length} ${hits.length === 1 ? 'Anleitung' : 'Anleitungen'} gefunden`}
          </p>

          {hits.length > 0 ? (
            <ul id="tutorial-search-results" role="listbox" aria-label="Suchergebnisse" className={styles.hitList}>
              {visible.map(({ item, terms }, i) => (
                <li key={item.section.id} id={`tutorial-hit-${i}`} role="option" aria-selected={i === active}>
                  <Link
                    to={href(item)}
                    className={`${styles.hit} ${i === active ? styles.hitActive : ''}`}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className={styles.hitMeta}>
                      {item.group.title} · {item.section.level}
                    </span>
                    <span className={styles.hitTitle}>
                      <Highlighted parts={highlight(item.section.title, terms)} />
                    </span>
                    <span className={styles.hitSnippet}>
                      <Highlighted parts={highlight(snippet(`${item.section.summary} ${item.body}`, terms), terms)} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noHits}>
              <span>Probier zum Beispiel:</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className={styles.jumpLink} onClick={() => setQuery(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className={styles.searchFooter}>
            {hits.length > shown && (
              <button type="button" className="btn btn-ghost" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                Weitere {Math.min(PAGE_SIZE, hits.length - shown)} anzeigen
              </button>
            )}
            <Link to={`/shop?kategorie=werkzeug&q=${encodeURIComponent(query.trim())}`} className={styles.searchShopLink}>
              „{query.trim()}“ im Werkzeug-Shop suchen →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
