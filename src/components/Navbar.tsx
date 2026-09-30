import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Navbar.module.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tutorial', label: 'Tutorial' },
  { to: '/shop', label: 'Shop' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState<string | null>(null)
  const location = useLocation()

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    if (open) setOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.bar} container`}>
        <NavLink to="/" className={styles.brand}>
          pelaro
        </NavLink>

        <nav className={styles.desktopNav} aria-label="Hauptnavigation">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineOpenTop : ''}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineOpenMid : ''}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerLineOpenBottom : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Mobile Navigation"
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.linkActive : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
