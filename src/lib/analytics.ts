import { supabase } from './supabase'

/**
 * Besuchsstatistik. Jeder Seitenaufruf wird gezählt. Eine Besucher-ID
 * (localStorage) und eine Sitzungs-ID (sessionStorage) werden nur mit
 * Einwilligung gespeichert – ohne Einwilligung zählt der Aufruf anonym.
 */
export type Consent = 'granted' | 'denied'

const CONSENT_KEY = 'pelaro-consent'
const VISITOR_KEY = 'pelaro-visitor-id'
const SESSION_KEY = 'pelaro-session-id'

function storageGet(storage: 'local' | 'session', key: string): string | null {
  try {
    return (storage === 'local' ? localStorage : sessionStorage).getItem(key)
  } catch {
    return null
  }
}

function storageSet(storage: 'local' | 'session', key: string, value: string) {
  try {
    ;(storage === 'local' ? localStorage : sessionStorage).setItem(key, value)
  } catch {
    // z. B. privater Modus – dann eben ohne ID
  }
}

export function getConsent(): Consent | null {
  const value = storageGet('local', CONSENT_KEY)
  return value === 'granted' || value === 'denied' ? value : null
}

export function setConsent(value: Consent) {
  storageSet('local', CONSENT_KEY, value)
  if (value === 'denied') {
    try {
      localStorage.removeItem(VISITOR_KEY)
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignorieren
    }
  }
}

function persistentId(storage: 'local' | 'session', key: string): string {
  let id = storageGet(storage, key)
  if (!id) {
    id = crypto.randomUUID()
    storageSet(storage, key, id)
  }
  return id
}

let isFirstView = true

export function trackPageView(path: string) {
  if (path.startsWith('/admin')) return
  const consented = getConsent() === 'granted'
  const entry = isFirstView
  isFirstView = false
  void supabase
    .from('page_views')
    .insert({
      path: path.slice(0, 300),
      referrer: entry && document.referrer ? document.referrer.slice(0, 500) : null,
      is_entry: entry,
      visitor_id: consented ? persistentId('local', VISITOR_KEY) : null,
      session_id: consented ? persistentId('session', SESSION_KEY) : null,
    })
    .then(({ error }) => {
      if (error) console.warn('Seitenaufruf konnte nicht gezählt werden.', error.message)
    })
}
