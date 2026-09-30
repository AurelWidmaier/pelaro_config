import { useEffect, useState } from 'react'
import { ASSET_BASE } from './assets'

/**
 * Bilder auf GitHub Pages (cdn/):
 * - bikes/       freigestellte Komplettbike-Vorschauen (PNG)
 * - bikes/jpg/   dieselben Builds als Foto mit Hintergrund – zweites Bild der Galerie
 * - bikes/real/  echte Fotos, nur nach Rahmen sortiert: real/<rahmen>/<datei>
 * - exports/     spezielle Bilder für den PDF-Export (optional)
 * Welche es gibt, steht jeweils in manifest.json (erzeugt vom Pages-Workflow).
 * Ein Build-Bild wird nur genutzt, wenn `<rahmen>_<laufräder>_<schaltgruppe>`
 * exakt zu den imageKeys der Auswahl passt (Groß-/Kleinschreibung egal).
 */
type BikeImageFolder = 'bikes' | 'bikes/jpg' | 'bikes/real' | 'exports'

const manifestPromises = new Map<BikeImageFolder, Promise<string[]>>()

function loadManifest(folder: BikeImageFolder): Promise<string[]> {
  let promise = manifestPromises.get(folder)
  if (!promise) {
    promise = fetch(`${ASSET_BASE}/${folder}/manifest.json`, { cache: 'no-cache' })
      .then((res) => (res.ok ? (res.json() as Promise<string[]>) : []))
      .catch(() => [])
    manifestPromises.set(folder, promise)
  }
  return promise
}

/** Dateiname ohne Endung, klein geschrieben -> Datei. */
async function loadBuildIndex(folder: BikeImageFolder): Promise<Map<string, string>> {
  const files = await loadManifest(folder)
  return new Map(files.map((file) => [file.replace(/\.[^.]+$/, '').toLowerCase(), file]))
}

function imageName(frameKey?: string, wheelsKey?: string, groupsetKey?: string): string | null {
  return frameKey && wheelsKey && groupsetKey ? `${frameKey}_${wheelsKey}_${groupsetKey}`.toLowerCase() : null
}

async function findImage(folder: BikeImageFolder, name: string | null): Promise<string | undefined> {
  if (!name) return undefined
  const file = (await loadBuildIndex(folder)).get(name)
  return file ? `${ASSET_BASE}/${folder}/${file}` : undefined
}

export interface CompleteBikeImages {
  /** Freigestellte Vorschau (PNG). */
  cutout?: string
  /** Foto mit Hintergrund (JPG), füllt die ganze Bildfläche. */
  photo?: string
}

export function useCompleteBikeImages(frameKey?: string, wheelsKey?: string, groupsetKey?: string): CompleteBikeImages {
  const name = imageName(frameKey, wheelsKey, groupsetKey)
  const [images, setImages] = useState<CompleteBikeImages & { name: string | null }>({ name: null })

  useEffect(() => {
    if (!name) return
    let active = true
    Promise.all([findImage('bikes', name), findImage('bikes/jpg', name)]).then(
      ([cutout, photo]) => active && setImages({ name, cutout, photo }),
    )
    return () => {
      active = false
    }
  }, [name])

  return images.name === name && name ? { cutout: images.cutout, photo: images.photo } : {}
}

/** Echte Fotos eines Rahmens aus bikes/real/<rahmen>/. */
export function useRealFrameImages(frameKey?: string): string[] {
  const [state, setState] = useState<{ key?: string; images: string[] }>({ images: [] })

  useEffect(() => {
    if (!frameKey) return
    let active = true
    const prefix = `${frameKey.toLowerCase()}/`
    loadManifest('bikes/real').then((files) => {
      if (!active) return
      const images = files
        .filter((file) => file.toLowerCase().startsWith(prefix))
        .map((file) => `${ASSET_BASE}/bikes/real/${file}`)
      setState({ key: frameKey, images })
    })
    return () => {
      active = false
    }
  }, [frameKey])

  return state.key === frameKey ? state.images : []
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
