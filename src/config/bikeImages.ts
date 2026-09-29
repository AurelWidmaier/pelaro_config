import { useEffect, useState } from 'react'
import { ASSET_BASE } from './assets'

/**
 * Fertige Komplettbike-Bilder liegen auf GitHub Pages:
 * - cdn/bikes/   Vorschaubilder für den Konfigurator
 * - cdn/exports/ spezielle Bilder für den PDF-Export (optional)
 * Welche es gibt, steht jeweils in manifest.json (erzeugt vom Pages-Workflow).
 * Ein Bild wird nur genutzt, wenn `<rahmen>_<laufräder>_<schaltgruppe>`
 * exakt zu den imageKeys der Auswahl passt.
 */
type BikeImageFolder = 'bikes' | 'exports'

const manifestPromises = new Map<BikeImageFolder, Promise<Map<string, string>>>()

function loadManifest(folder: BikeImageFolder) {
  let promise = manifestPromises.get(folder)
  if (!promise) {
    promise = fetch(`${ASSET_BASE}/${folder}/manifest.json`, { cache: 'no-cache' })
      .then((res) => (res.ok ? (res.json() as Promise<string[]>) : []))
      .then((files) => new Map(files.map((file) => [file.replace(/\.[^.]+$/, '').toLowerCase(), file])))
      .catch(() => new Map<string, string>())
    manifestPromises.set(folder, promise)
  }
  return promise
}

function imageName(frameKey?: string, wheelsKey?: string, groupsetKey?: string): string | null {
  return frameKey && wheelsKey && groupsetKey ? `${frameKey}_${wheelsKey}_${groupsetKey}`.toLowerCase() : null
}

async function findImage(folder: BikeImageFolder, name: string | null): Promise<string | undefined> {
  if (!name) return undefined
  const file = (await loadManifest(folder)).get(name)
  return file ? `${ASSET_BASE}/${folder}/${file}` : undefined
}

export function useCompleteBikeImage(
  frameKey?: string,
  wheelsKey?: string,
  groupsetKey?: string,
): string | undefined {
  const name = imageName(frameKey, wheelsKey, groupsetKey)
  const [manifest, setManifest] = useState<Map<string, string> | null>(null)

  useEffect(() => {
    if (!name) return
    let active = true
    loadManifest('bikes').then((m) => active && setManifest(m))
    return () => {
      active = false
    }
  }, [name])

  const file = name ? manifest?.get(name) : undefined
  return file ? `${ASSET_BASE}/bikes/${file}` : undefined
}

/**
 * Bild für den PDF-Export: erst ein spezielles Export-Bild, sonst das
 * Vorschaubild. `isPreview` sagt, ob es das (KI-)Vorschaubild ist.
 */
export async function findExportBikeImage(
  frameKey?: string,
  wheelsKey?: string,
  groupsetKey?: string,
): Promise<{ url: string; isPreview: boolean } | undefined> {
  const name = imageName(frameKey, wheelsKey, groupsetKey)
  const exportImage = await findImage('exports', name)
  if (exportImage) return { url: exportImage, isPreview: false }
  const previewImage = await findImage('bikes', name)
  return previewImage ? { url: previewImage, isPreview: true } : undefined
}
