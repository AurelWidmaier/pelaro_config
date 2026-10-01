import { useSearchParams } from 'react-router-dom'
import { TOOLS, toolImage } from '../config/tools'
import { formatPrice } from '../utils/format'
import { Seo } from '../components/Seo'
import { PAGES } from '../seo/pages'
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

export function Shop() {
  const [params, setParams] = useSearchParams()
  const categoryId = (CATEGORIES.find((c) => c.id === params.get('kategorie'))?.id ?? 'werkzeug') as CategoryId
  const category = CATEGORIES.find((c) => c.id === categoryId)!
  const essential = TOOLS.filter((t) => t.essential)
  const optional = TOOLS.filter((t) => !t.essential)

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
            onClick={() => setParams({ kategorie: c.id })}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className={styles.categoryIntro}>{category.intro}</p>

      {[
        { title: 'Das brauchst du', items: essential },
        { title: 'Macht es leichter', items: optional },
      ].map((group) => (
        <section key={group.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{group.title}</h2>
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
                  <h3 className={styles.name}>{tool.name}</h3>
                  <p className={styles.description}>{tool.description}</p>
                  {tool.variant && (
                    <p className={styles.variant}>
                      Beim Händler wählen: <strong>{tool.variant}</strong>
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
