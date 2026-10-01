import { Link, Navigate, useLocation } from 'react-router-dom'
import { RevealOnScroll } from '../../components/RevealOnScroll'
import { Seo } from '../../components/Seo'
import { TUTORIAL, TUTORIAL_VIDEOS } from '../../content/tutorial'
import { breadcrumbLd, siteUrl } from '../../seo/url'
import { PAGES, tutorialGroupPath } from '../../seo/pages'
import { VideoGrid } from './TutorialParts'
import styles from './Tutorial.module.css'

/** Alte Links (/tutorial#kette, /tutorial#gruppe-bremsen) zeigen auf die neue Themenseite. */
function legacyTarget(hash: string): string | null {
  const id = hash.slice(1)
  if (!id) return null
  for (const group of TUTORIAL) {
    if (id === `gruppe-${group.id}`) return tutorialGroupPath(group)
    if (group.sections.some((s) => s.id === id)) return `${tutorialGroupPath(group)}#${id}`
  }
  return null
}

/** Übersicht aller Tutorial-Themen – jedes Thema hat eine eigene Seite. */
export function TutorialOverview() {
  const { hash } = useLocation()
  const redirect = legacyTarget(hash)
  if (redirect) return <Navigate to={redirect} replace />

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: PAGES.tutorial.title,
      description: PAGES.tutorial.description,
      url: siteUrl(PAGES.tutorial.path),
      inLanguage: 'de-DE',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: TUTORIAL.map((group, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: group.heading,
          url: siteUrl(tutorialGroupPath(group)),
        })),
      },
    },
    breadcrumbLd([
      { name: 'Startseite', path: '/' },
      { name: 'Tutorials', path: PAGES.tutorial.path },
    ]),
  ]

  return (
    <div className={`container ${styles.page}`}>
      <Seo meta={PAGES.tutorial} jsonLd={jsonLd} />

      <RevealOnScroll>
        <header className={styles.header}>
          <span className="eyebrow">Tutorial</span>
          <h1 className={styles.title}>Dein Bike selbst aufbauen und warten</h1>
          <p className={styles.intro}>
            Schritt-für-Schritt-Anleitungen für Einsteiger – abgestimmt auf die Teile aus dem Konfigurator. Wähle ein
            Thema, dort klappst du die einzelnen Anleitungen auf. Das passende Werkzeug findest du im{' '}
            <Link to="/shop?kategorie=werkzeug">Shop</Link>.
          </p>
        </header>
      </RevealOnScroll>

      <div className={styles.topicGrid}>
        {TUTORIAL.map((group) => {
          const path = tutorialGroupPath(group)
          return (
            <article key={group.id} className={styles.topicCard}>
              <h2 className={styles.topicTitle}>
                <Link to={path} className={styles.topicLink}>
                  {group.heading}
                </Link>
              </h2>
              <p className={styles.topicDesc}>{group.description}</p>
              <ul className={styles.topicSections}>
                {group.sections.map((section) => (
                  <li key={section.id}>
                    <Link to={`${path}#${section.id}`}>{section.title}</Link>
                  </li>
                ))}
              </ul>
              <span className={styles.topicMore} aria-hidden="true">
                {group.sections.length} {group.sections.length === 1 ? 'Anleitung' : 'Anleitungen'} →
              </span>
            </article>
          )
        })}
      </div>

      <VideoGrid videos={TUTORIAL_VIDEOS} title="Videos zum Mitmachen" />
    </div>
  )
}
