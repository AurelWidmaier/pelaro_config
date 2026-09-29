import { useEffect, useState } from 'react'
import { ASSET_BASE } from './assets'

/**
 * Fertige Komplettbike-Bilder liegen in cdn/bikes/ auf GitHub Pages.
 * Welche es gibt, steht in manifest.json (erzeugt vom Pages-Workflow).
 * Ein Bild wird nur gezeigt, wenn `<rahmen>_<laufräder>_<schaltgruppe>`
 * exakt zu den imageKeys der Auswahl passt.
 */
const BIKES_BASE = `${ASSET_BASE}/bikes`

let manifestPromise: Promise<Map<string, string>> | null = null

function loadManifest() {
  manifestPromise ??= fetch(`${BIKES_BASE}/manifest.json`)
    .then((res) => (res.ok ? (res.json() as Promise<string[]>) : []))
    .then((files) => new Map(files.map((file) => [file.replace(/\.[^.]+$/, '').toLowerCase(), file])))
    .catch(() => new Map<string, string>())
  return manifestPromise
}

export function useCompleteBikeImage(
  frameKey?: string,
  wheelsKey?: string,
  groupsetKey?: string,
): string | undefined {
  const name = frameKey && wheelsKey && groupsetKey ? `${frameKey}_${wheelsKey}_${groupsetKey}`.toLowerCase() : null
  const [manifest, setManifest] = useState<Map<string, string> | null>(null)

  useEffect(() => {
    if (!name) return
    let active = true
    loadManifest().then((m) => active && setManifest(m))
    return () => {
      active = false
    }
  }, [name])

  const file = name ? manifest?.get(name) : undefined
  return file ? `${BIKES_BASE}/${file}` : undefined
}
