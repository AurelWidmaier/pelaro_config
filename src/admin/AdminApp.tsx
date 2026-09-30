import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { LoginForm } from './LoginForm'
import { Dashboard } from './Dashboard'
import { ProductsPage } from './ProductsPage'
import { ProductEditor } from './ProductEditor'
import { StandardPartsPage } from './StandardPartsPage'
import styles from './Admin.module.css'

type AdminState = 'loading' | 'signed-out' | 'forbidden' | 'admin'

/** Admin-Bereich unter /admin: Login, Statistik, Produkte, Standardteile. */
export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null)
  const [state, setState] = useState<AdminState>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true
    if (!session) {
      supabase.auth.getSession().then(({ data }) => active && !data.session && setState('signed-out'))
      return
    }
    // Die Admin-Liste ist nur für Admins lesbar – sieht man sich selbst, ist man Admin.
    supabase
      .from('admin_users')
      .select('email')
      .then(({ data }) => active && setState(data && data.length > 0 ? 'admin' : 'forbidden'))
    return () => {
      active = false
    }
  }, [session])

  useEffect(() => {
    document.title = 'Pelaro Admin'
  }, [])

  if (state === 'loading') return <div className={styles.center}>Lädt …</div>
  if (state === 'signed-out') return <LoginForm />
  if (state === 'forbidden') {
    return (
      <div className={styles.center}>
        <div className={`${styles.card} ${styles.loginCard}`}>
          <h1 className={styles.title}>Kein Zugriff</h1>
          <p className={styles.muted}>{session?.user.email} ist nicht als Admin freigeschaltet.</p>
          <button type="button" className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>
            Abmelden
          </button>
        </div>
      </div>
    )
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <span className={styles.brand}>pelaro admin</span>
          <nav className={styles.nav}>
            <NavLink to="/admin" end className={navClass}>
              Übersicht
            </NavLink>
            <NavLink to="/admin/produkte" className={navClass}>
              Produkte
            </NavLink>
            <NavLink to="/admin/standardteile" className={navClass}>
              Standardteile
            </NavLink>
            <a href="/" className={styles.navLink} target="_blank" rel="noreferrer">
              Website ↗
            </a>
          </nav>
          <div className={styles.userBox}>
            <span>{session?.user.email}</span>
            <button type="button" className={styles.linkButton} onClick={() => supabase.auth.signOut()}>
              Abmelden
            </button>
          </div>
        </div>
      </header>
      <main className={`container ${styles.main}`}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="produkte" element={<ProductsPage />} />
          <Route path="produkte/neu" element={<ProductEditor />} />
          <Route path="produkte/:id" element={<ProductEditor />} />
          <Route path="standardteile" element={<StandardPartsPage />} />
        </Routes>
      </main>
    </div>
  )
}
