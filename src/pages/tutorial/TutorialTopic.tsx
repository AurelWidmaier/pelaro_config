import { Link, Navigate, useParams } from 'react-router-dom'
import { RevealOnScroll } from '../../components/RevealOnScroll'
import { Seo } from '../../components/Seo'
import { TUTORIAL, TUTORIAL_VIDEOS } from '../../content/tutorial'
import { breadcrumbLd, siteUrl } from '../../seo/url'
import { PAGES, SITE_NAME, tutorialGroupMeta, tutorialGroupPath } from '../../seo/pages'
import { SectionList, VideoGrid } from './TutorialParts'
import styles from './Tutorial.module.css'

/** **fett** entfernen – für Texte in strukturierten Daten. */
function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1')
}

/** Eigene Seite pro Überthema (/tutorial/antrieb-schaltung) mit den Anleitungen als Dropdowns. */
export function TutorialTopic() {
  const { groupId } = useParams()
  const index = TUTORIAL.findIndex((g) => g.id === groupId)
  if (index < 0) return <Navigate to="/tutorial" replace />

  const group = TUTORIAL[index]
  const meta = tutorialGroupMeta(group)
  const prev = TUTORIAL[index - 1]
  const next = TUTORIAL[index + 1]
  const others = TUTORIAL.filter((g) => g.id !== group.id)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: group.heading,
      description: group.description,
      url: siteUrl(meta.path),
      inLanguage: 'de-DE',
      proficiencyLevel: group.sections.every((s) => s.level === 'Einsteiger') ? 'Beginner' : 'Expert',
      publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl('/') },
      isPartOf: { '@type': 'CollectionPage', name: 'Tutorials', url: siteUrl(PAGES.tutorial.path) },
      hasPart: group.sections.map((section) => ({
        '@type': 'WebPageElement',
        name: section.title,
        description: plain(section.summary),
        url: siteUrl(`${meta.path}#${section.id}`),
      })),
    },
    breadcrumbLd([
      { name: 'Startseite', path: '/' },
      { name: 'Tutorials', path: PAGES.tutorial.path },
      { name: group.title, path: meta.path },
    ]),
  ]

  return (
    <div className={`container ${styles.page}`}>
      <Seo meta={meta} jsonLd={jsonLd} />

      <nav className={styles.breadcrumb} aria-label="Brotkrumen">
        <ol>
          <li>
            <Link to="/tutorial">Tutorials</Link>
          </li>
          <li aria-current="page">{group.title}</li>
        </ol>
      </nav>

      <RevealOnScroll>
        <header className={styles.header}>
          <span className="eyebrow">Tutorial · {group.title}</span>
          <h1 className={styles.title}>{group.heading}</h1>
          <p className={styles.intro}>{group.intro}</p>
        </header>
      </RevealOnScroll>

      <SectionList sections={group.sections} />

      <VideoGrid videos={TUTORIAL_VIDEOS.filter((v) => v.group === group.id)} title={`Videos: ${group.title}`} />

      <nav className={styles.pager} aria-label="Weitere Tutorials">
        {prev ? (
          <Link to={tutorialGroupPath(prev)} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>← Vorheriges Thema</span>
            <span className={styles.pagerTitle}>{prev.heading}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={tutorialGroupPath(next)} className={`${styles.pagerLink} ${styles.pagerNext}`}>
            <span className={styles.pagerLabel}>Nächstes Thema →</span>
            <span className={styles.pagerTitle}>{next.heading}</span>
          </Link>
        )}
      </nav>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Weitere Themen</h2>
        <div className={styles.jump}>
          {others.map((g) => (
            <Link key={g.id} to={tutorialGroupPath(g)} className={styles.jumpLink}>
              {g.title}
            </Link>
          ))}
        </div>
      </section>

      <aside className={styles.cta}>
        <div>
          <h2 className={styles.ctaTitle}>Noch kein Bike?</h2>
          <p className={styles.ctaText}>Stell dir im Konfigurator dein Rennrad oder Gravelbike zusammen – mit Teileliste und passender Werkzeugliste.</p>
        </div>
        <Link to="/konfigurator" className="btn btn-primary">
          Bike konfigurieren
        </Link>
      </aside>
    </div>
  )
}
