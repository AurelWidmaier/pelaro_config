import { useEffect, useState, type ReactNode } from 'react'
import { loadCatalog } from '../lib/catalog'

/** Nach so vielen ms startet der Konfigurator notfalls mit dem eingebauten Katalog. */
const TIMEOUT_MS = 5000

/** Rendert die Kinder erst, wenn der Katalog aus der Datenbank geladen ist. */
export function CatalogGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, TIMEOUT_MS))
    Promise.race([loadCatalog(), timeout]).then(() => active && setReady(true))
    return () => {
      active = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Teile werden geladen …
      </div>
    )
  }
  return <>{children}</>
}
