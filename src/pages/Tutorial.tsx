import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { RevealOnScroll } from '../components/RevealOnScroll'
import {
  TUTORIAL,
  TUTORIAL_VIDEOS,
  type TutorialBlock,
  type TutorialSection,
  type TutorialVideo,
} from '../content/tutorial'
import styles from './Tutorial.module.css'

/** Wandelt **fett** im Text in <strong> um. */
function rich(text: string): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

function Block({ block }: { block: TutorialBlock }) {
  switch (block.type) {
    case 'p':
      return <p className={styles.p}>{rich(block.text)}</p>
    case 'steps':
      return (
        <div className={styles.block}>
          {block.title && <h4 className={styles.blockTitle}>{block.title}</h4>}
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
          {block.title && <h4 className={styles.blockTitle}>{block.title}</h4>}
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
          <h4 className={styles.blockTitle}>{block.title}</h4>
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
          {block.title && <h4 className={styles.blockTitle}>{block.title}</h4>}
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

function Section({ section, open, onToggle }: { section: TutorialSection; open: boolean; onToggle: () => void }) {
  return (
    <section id={section.id} className={styles.panel}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={`${section.id}-content`}
        onClick={onToggle}
      >
        <span className={styles.toggleText}>
          <span className={styles.meta}>
            <span className={`${styles.level} ${styles[`level${section.level}`]}`}>{section.level}</span>
            {section.time && <span className={styles.time}>{section.time}</span>}
          </span>
          <span className={styles.sectionTitle}>{section.title}</span>
          <span className={styles.summary}>{section.summary}</span>
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${section.id}-content`}
            className={styles.content}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.inner}>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/** Zeigt erst das Vorschaubild – der YouTube-Player (nocookie) lädt erst nach Klick. */
function VideoCard({ video }: { video: TutorialVideo & { youtubeId: string } }) {
  const [playing, setPlaying] = useState(false)
  return (
    <article className={styles.video}>
      <h3 className={styles.videoTitle}>{video.title}</h3>
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
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className={styles.play} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className={styles.videoDesc}>{video.description}</p>
    </article>
  )
}

export function Tutorial() {
  const location = useLocation()
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const videos = TUTORIAL_VIDEOS.filter((v): v is TutorialVideo & { youtubeId: string } => Boolean(v.youtubeId))

  // Direktlink auf einen Abschnitt (#kette) klappt ihn auf
  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id) return
    setOpenIds((prev) => new Set(prev).add(id))
    // kurz warten, bis das Dropdown aufgeklappt ist
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    return () => window.clearTimeout(timer)
  }, [location.hash])

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className={`container ${styles.page}`}>
      <RevealOnScroll>
        <header className={styles.header}>
          <span className="eyebrow">Tutorial</span>
          <h1 className={styles.title}>Dein Bike selbst aufbauen und warten</h1>
          <p className={styles.intro}>
            Schritt-für-Schritt-Anleitungen für Einsteiger – abgestimmt auf die Teile aus dem Konfigurator. Klapp einfach
            das Thema auf, das du gerade brauchst. Das passende Werkzeug findest du im{' '}
            <Link to="/shop?kategorie=werkzeug">Shop</Link>.
          </p>
        </header>
      </RevealOnScroll>

      <nav className={styles.jump} aria-label="Themen">
        {TUTORIAL.map((group) => (
          <a key={group.id} href={`#gruppe-${group.id}`} className={styles.jumpLink}>
            {group.title}
          </a>
        ))}
        {videos.length > 0 && (
          <a href="#videos" className={styles.jumpLink}>
            Videos
          </a>
        )}
      </nav>

      {TUTORIAL.map((group) => (
        <section key={group.id} id={`gruppe-${group.id}`} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <div className={styles.sections}>
            {group.sections.map((section) => (
              <Section key={section.id} section={section} open={openIds.has(section.id)} onToggle={() => toggle(section.id)} />
            ))}
          </div>
        </section>
      ))}

      {videos.length > 0 && (
        <section id="videos" className={styles.group}>
          <h2 className={styles.groupTitle}>Videos zum Mitmachen</h2>
          <p className={styles.videoIntro}>Manches versteht man am besten, wenn man es einmal gesehen hat.</p>
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <VideoCard key={video.youtubeId} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
