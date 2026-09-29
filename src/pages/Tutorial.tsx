import { RevealOnScroll } from '../components/RevealOnScroll'
import styles from './Tutorial.module.css'

export function Tutorial() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <RevealOnScroll>
          <span className="eyebrow">Tutorial</span>
          <h1 className={styles.title}>Kommt bald</h1>
          <p className={styles.text}>
            Hier entsteht bald eine kurze Anleitung, die dir Schritt für Schritt zeigt, worauf es
            bei deinem Bike-Aufbau ankommt.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
