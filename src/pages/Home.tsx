import { Link } from 'react-router-dom'
import { Hero3DPlaceholder } from '../components/Hero3DPlaceholder'
import { RevealOnScroll } from '../components/RevealOnScroll'
import styles from './Home.module.css'

const STEPS = [
  {
    n: '01',
    title: 'Bike-Typ wählen',
    text: 'Rennrad, Gravel/Race-Gravel oder Hardtail-MTB – du entscheidest, wofür dein Bike gebaut wird.',
  },
  {
    n: '02',
    title: 'Budget setzen',
    text: 'Sag uns, wie viel du ausgeben willst – der Regler zeigt dir, was mit unseren Teilen möglich ist.',
  },
  {
    n: '03',
    title: 'Teile wählen',
    text: 'Passende Rahmen, Schaltung und Laufräder für dein Budget – jeweils kurz erklärt.',
  },
  {
    n: '04',
    title: 'Bike sehen',
    text: 'Dein Bike wird live zusammengesetzt, inklusive Teileliste und Preis.',
  },
]

const FEATURES = [
  {
    title: 'Für jeden Bike-Typ',
    text: 'Rennrad, Gravel/Race-Gravel oder Hardtail-MTB – der Konfigurator passt sich deinem Einsatzzweck an.',
  },
  {
    title: 'Transparente Preise',
    text: 'Jede Option zeigt sofort, was sie kostet. Keine versteckten Aufschläge am Ende.',
  },
  {
    title: 'Kein Fachwissen nötig',
    text: 'Jede Auswahl wird in einfachen Worten erklärt – perfekt für den ersten Bike-Kauf.',
  },
]

export function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroText}>
            <span className="eyebrow">Rennrad &amp; Gravel Konfigurator</span>
            <h1 className={styles.title}>
              Bau dir dein Bike.
              <br />
              Passend zu deinem Budget.
            </h1>
            <p className={styles.subtitle}>
              In drei einfachen Schritten zum eigenen Rennrad oder Gravelbike – verständlich
              erklärt, visuell zusammengesetzt, ganz ohne Vorwissen.
            </p>
            <Link to="/konfigurator" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Bike konfigurieren
            </Link>
          </div>

          <div className={styles.heroVisual}>
            <Hero3DPlaceholder />
          </div>
        </div>
      </section>

      <section className={`${styles.steps} container`}>
        <RevealOnScroll>
          <h2 className={styles.sectionTitle}>So funktioniert's</h2>
        </RevealOnScroll>
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.n} delay={i * 0.08}>
              <div className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className={styles.featureSection}>
        <div className="container">
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 0.08}>
                <div className={styles.featureCard}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`${styles.ctaInner} container`}>
          <RevealOnScroll>
            <h2 className={styles.ctaTitle}>Bereit für dein Bike?</h2>
            <p className={styles.ctaText}>Der Konfigurator dauert nur ein paar Minuten.</p>
            <Link to="/konfigurator" className="btn btn-primary">
              Jetzt starten
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
