import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Admin.module.css'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (signInError) setError('Anmeldung fehlgeschlagen – E-Mail oder Passwort falsch.')
  }

  return (
    <div className={styles.center}>
      <form className={`${styles.card} ${styles.loginCard}`} onSubmit={submit}>
        <h1 className={styles.title}>Admin-Login</h1>
        <label className={styles.field}>
          E-Mail
          <input
            className={styles.input}
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          Passwort
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Anmelden …' : 'Anmelden'}
        </button>
      </form>
    </div>
  )
}
