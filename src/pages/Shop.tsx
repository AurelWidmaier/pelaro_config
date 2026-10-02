import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TOOLS, toolImage, type Tool } from '../config/tools'
import { TUTORIAL, type TutorialGroup, type TutorialSection } from '../content/tutorial'
import { formatPrice } from '../utils/format'
import { buildIndex, highlight, search } from '../lib/search'
import { Highlighted, SearchField } from '../components/SearchField'
import { Seo } from '../components/Seo'
import { PAGES, tutorialGroupPath } from '../seo/pages'
import styles from './Shop.module.css'

/** Shop-Kategorien – weitere (z. B. Pedale, Zubehör) später einfach ergänzen. */
const CATEGORIES = [
  {
    id: 'werkzeug',
    label: 'Werkzeug',
    intro:
      'Alles, was du für den Aufbau deines Bikes brauchst. Spezialwerkzeug für Innenlager und Kurbel zeigt dir die Werkzeugliste in deinem Konfigurations-Ergebnis.',
  },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

/** Anleitungen, in denen ein Werkzeug verlinkt ist ([[werkzeug-id|…]] im Text). */
function guidesFor(tool: Tool): { group: TutorialGroup; section: TutorialSection }[] {
  const marker = `[[${tool.id}|`
  return TUTORIAL.flatMap((group) =>
    group.sections.filter((section) => JSON.stringify(section.blocks).includes(marker)).map((section) => ({ group, section })),
  )
}

const TOOL_GUIDES = new Map(TOOLS.map((tool) => [tool.id, guidesFor(tool)]))

const TOOL_INDEX = buildIndex(
  TOOLS.map((tool) => ({
    item: tool,
    fields: [
      { text: tool.name, weight: 10 },
      { text: tool.description, weight: 4 },
      { text: (TOOL_GUIDES.get(tool.id) ?? []).map((g) => g.section.title).join(' '), weight: 3 },
      { text: tool.variant ?? '', weight: 1 },
    ],
  })),
)

const SUGGESTIONS = ['Drehmoment', 'Kette', 'Bremse entlüften', 'Innenlager', 'Carbon', 'Reifen']

export function Shop() {
  const [params, setParams] = useSearchParams()
  const categoryId = (CATEGORIES.find((c) => c.id === params.get('kategorie'))?.id ?? 'werkzeug') as CategoryId
  const category = CATEGORIES.find((c) => c.id === categoryId)!
  const query = params.get('q') ?? ''
  const hits = useMemo(() => (query.trim() ? search(TOOL_INDEX, query) : null), [query])
  const terms = hits?.flatMap((h) => h.terms) ?? []
  const essential = TOOLS.filter((t) => t.essential)
  const optional = TOOLS.filter((t) => !t.essential)

  function setQuery(value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const groups = hits
    ? [{ title: hits.length === 1 ? '1 Treffer' : `${hits.length} Treffer`, items: hits.map((h) => h.item) }]
    : [
        { title: 'Das brauchst du', items: essential },
        { title: 'Macht es leichter', items: optional },
      ]

  return (
    <div className={`container ${styles.page}`}>
      <Seo meta={PAGES.shop} />
      <header className={styles.header}>
        <span className="eyebrow">Shop</span>
        <h1 className={styles.title}>Alles für deinen Aufbau</h1>
        <p className={styles.intro}>
          Unsere Empfehlungen – ausgesucht passend zu den Teilen im Konfigurator. Die Links führen zum Händler.
        </p>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Kategorien">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === categoryId}
            className={`${styles.tab} ${c.id === categoryId ? styles.tabActive : ''}`}
            onClick={() => setParams({ kategorie: c.id, ...(query ? { q: query } : {}) })}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className={styles.categoryIntro}>{category.intro}</p>

      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Werkzeug suchen, z. B. „Drehmoment“ oder „Kette“"
        label="Werkzeug durchsuchen"
      />

      {hits?.length === 0 && (
        <div className={styles.noHits} role="status">
          <p>
            Kein Werkzeug zu „{query.trim()}“ gefunden.{' '}
            <Link to={`/tutorial?q=${encodeURIComponent(query.trim())}`}>In den Anleitungen suchen →</Link>
          </p>
          <div className={styles.suggestions}>
            <span>Probier zum Beispiel:</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className={styles.suggestion} onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {groups.filter((group) => group.items.length > 0).map((group) => (
        <section key={group.title} className={styles.section}>
          <h2 className={styles.sectionTitle} role={hits ? 'status' : undefined}>
            {group.title}
          </h2>
          <div className={styles.grid}>
            {group.items.map((tool) => (
              <article key={tool.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img
                    src={toolImage(tool)}
                    alt={tool.name}
                    loading="lazy"
                    onError={(e) => e.currentTarget.classList.add(styles.imageMissing)}
                  />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.name}>
                    <Highlighted parts={highlight(tool.name, terms)} />
                  </h3>
                  <p className={styles.description}>
                    <Highlighted parts={highlight(tool.description, terms)} />
                  </p>
                  {tool.variant && (
                    <p className={styles.variant}>
                      Beim Händler wählen: <strong>{tool.variant}</strong>
                    </p>
                  )}
                  {(TOOL_GUIDES.get(tool.id)?.length ?? 0) > 0 && (
                    <p className={styles.guides}>
                      Anleitung:{' '}
                      {TOOL_GUIDES.get(tool.id)!
                        .slice(0, 2)
                        .map(({ group, section }, i) => (
                          <span key={section.id}>
                            {i > 0 && ' · '}
                            <Link to={`${tutorialGroupPath(group)}#${section.id}`}>{section.title}</Link>
                          </span>
                        ))}
                    </p>
                  )}
                  <div className={styles.footer}>
                    {tool.price !== undefined && <span className={styles.price}>{formatPrice(tool.price)}</span>}
                    {tool.url ? (
                      <a className="btn btn-primary" href={tool.url} target="_blank" rel="noopener noreferrer sponsored">
                        Zum Händler
                      </a>
                    ) : (
                      <span className={styles.soon}>Link folgt</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
