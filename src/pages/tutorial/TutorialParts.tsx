import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { TOOLS } from '../../config/tools'
import type { TutorialBlock, TutorialSection, TutorialVideo } from '../../content/tutorial'
import styles from './Tutorial.module.css'

const TOOLS_BY_ID = new Map(TOOLS.map((tool) => [tool.id, tool]))

/** Wandelt [[werkzeug-id|Text]] in einen Affiliate-Link zum Werkzeug um. */
function toolLinks(text: string): ReactNode {
  return text.split(/\[\[([\w-]+)\|(.+?)\]\]/g).reduce<ReactNode[]>((out, part, i, parts) => {
    if (i % 3 === 0) {
      if (part) out.push(part)
    } else if (i % 3 === 1) {
      const tool = TOOLS_BY_ID.get(part)
      const label = parts[i + 1]
      out.push(
        tool?.url ? (
          <a key={i} className={styles.toolLink} href={tool.url} target="_blank" rel="noopener noreferrer sponsored" title={`${tool.name} beim Händler ansehen (Affiliate-Link)`}>
            {label}
            <sup aria-hidden="true">*</sup>
          </a>
        ) : (
          label
        ),
      )
    }
    return out
  }, [])
}

/** Wandelt **fett** in <strong> und [[werkzeug-id|Text]] in Werkzeug-Links um. */
function rich(text: string): ReactNode {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{toolLinks(part)}</strong> : <Fragment key={i}>{toolLinks(part)}</Fragment>))
}

function Block({ block }: { block: TutorialBlock }) {
  switch (block.type) {
    case 'p':
      return <p className={styles.p}>{rich(block.text)}</p>
    case 'steps':
      return (
        <div className={styles.block}>
          {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
          <ol className={styles.steps}>
            {block.items.map((item, i) => (
              <li key={i}>{rich(item)}</li>
            ))}
          </ol>
        </div>
      )
    case 'list':
      return (
        <div className={styles.block}>
          {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
          <ul className={styles.list}>
            {block.items.map((item, i) => (
              <li key={i}>{rich(item)}</li>
            ))}
          </ul>
        </div>
      )
    case 'checklist':
      return (
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>{block.title}</h3>
          <ul className={styles.checklist}>
            {block.items.map((item, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" />
                  <span>{rich(item)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'tip':
      return (
        <div className={`${styles.callout} ${styles.tip}`}>
          <span className={styles.calloutLabel}>Tipp</span>
          <p>{rich(block.text)}</p>
        </div>
      )
    case 'warning':
      return (
        <div className={`${styles.callout} ${styles.warning}`}>
          <span className={styles.calloutLabel}>Achtung</span>
          <p>{rich(block.text)}</p>
        </div>
      )
    case 'table':
      return (
        <div className={styles.block}>
          {block.title && <h3 className={styles.blockTitle}>{block.title}</h3>}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{rich(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className={styles.note}>{rich(block.note)}</p>}
        </div>
      )
    case 'terms':
      return (
        <dl className={styles.terms}>
          {block.items.map(([term, def]) => (
            <div key={term} className={styles.term}>
              <dt>{term}</dt>
              <dd>{rich(def)}</dd>
            </div>
          ))}
        </dl>
      )
  }
}

/**
 * Aufklappbarer Abschnitt. Der Inhalt bleibt auch zugeklappt im HTML (nur per CSS
 * eingeklappt), damit Suchmaschinen ihn lesen und der Seite zuordnen können.
 */
function Section({
  section,
  videos,
  open,
  onToggle,
}: {
  section: TutorialSection
  videos: PlayableVideo[]
  open: boolean
  onToggle: () => void
}) {
  const contentId = `${section.id}-content`
  return (
    <section id={section.id} className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
      <div className={styles.toggle}>
        <div className={styles.toggleText}>
          <span className={styles.meta}>
            <span className={`${styles.level} ${styles[`level${section.level}`]}`}>{section.level}</span>
            {section.time && <span className={styles.time}>{section.time}</span>}
          </span>
          <h2 className={styles.sectionTitle}>
            <button type="button" className={styles.toggleButton} aria-expanded={open} aria-controls={contentId} onClick={onToggle}>
              {section.title}
            </button>
          </h2>
          <p className={styles.summary}>{section.summary}</p>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      <div id={contentId} className={styles.content} inert={!open}>
        <div className={styles.contentClip}>
          <div className={styles.inner}>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            {videos.length > 0 && (
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>{videos.length === 1 ? 'Video zur Anleitung' : 'Videos zur Anleitung'}</h3>
                <div className={styles.videoGrid}>
                  {videos.map((video) => (
                    <VideoCard key={video.youtubeId} video={video} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Liste von Dropdowns – immer nur eins offen, #abschnitt in der URL klappt es auf. */
export function SectionList({ sections, videos }: { sections: TutorialSection[]; videos: TutorialVideo[] }) {
  const location = useLocation()
  const [openId, setOpenId] = useState<string | null>(null)
  const [lastHash, setLastHash] = useState<string | null>(null)

  // Direktlink auf einen Abschnitt (#kette) klappt ihn auf
  if (location.hash !== lastHash) {
    setLastHash(location.hash)
    const id = location.hash.slice(1)
    if (sections.some((s) => s.id === id)) setOpenId(id)
  }

  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id || !sections.some((s) => s.id === id)) return
    // kurz warten, bis das Dropdown aufgeklappt ist
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    return () => window.clearTimeout(timer)
  }, [location.hash, sections])

  function toggle(id: string) {
    const opening = openId !== id
    setOpenId(opening ? id : null)
    // Link auf den offenen Abschnitt teilbar machen, ohne neuen Verlaufseintrag
    window.history.replaceState(window.history.state, '', opening ? `#${id}` : location.pathname)
    if (!opening) return
    // Klappt ein langer Abschnitt darüber zu, rutscht der neue nach oben aus dem Bild – dann zurückholen
    window.setTimeout(() => {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 320)
  }

  return (
    <div className={styles.sections}>
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          videos={playable(videos).filter((v) => v.section === section.id)}
          open={openId === section.id}
          onToggle={() => toggle(section.id)}
        />
      ))}
    </div>
  )
}

type PlayableVideo = TutorialVideo & { youtubeId: string }

/** Nur Videos mit YouTube-ID – Platzhalter ohne ID werden nicht angezeigt. */
function playable(videos: TutorialVideo[]): PlayableVideo[] {
  return videos.filter((v): v is PlayableVideo => Boolean(v.youtubeId))
}

/** Zeigt erst das Vorschaubild – der YouTube-Player (nocookie) lädt erst nach Klick. */
function VideoCard({ video }: { video: PlayableVideo }) {
  const [playing, setPlaying] = useState(false)
  return (
    <article className={styles.video}>
      <h3 className={styles.videoTitle}>
        {video.title}
        {video.language && <span className={styles.videoLang}>{video.language}</span>}
      </h3>
      <div className={styles.player}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.preview} onClick={() => setPlaying(true)} aria-label={`Video abspielen: ${video.title}`}>
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={video.title} loading="lazy" />
            <span className={styles.play} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className={styles.videoDesc}>{rich(video.description)}</p>
    </article>
  )
}

export function VideoGrid({ videos, title }: { videos: TutorialVideo[]; title: string }) {
  const list = playable(videos)
  if (list.length === 0) return null
  return (
    <section id="videos" className={styles.group}>
      <h2 className={styles.groupTitle}>{title}</h2>
      <p className={styles.videoIntro}>Manches versteht man am besten, wenn man es einmal gesehen hat.</p>
      <div className={styles.videoGrid}>
        {list.map((video) => (
          <VideoCard key={video.youtubeId} video={video} />
        ))}
      </div>
    </section>
  )
}
