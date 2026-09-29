/**
 * Produktfotos liegen nicht im App-Bundle, sondern in cdn/ und werden per
 * GitHub Pages ausgeliefert (siehe .github/workflows/pages.yml).
 * Über VITE_ASSET_BASE lässt sich die Basis-URL überschreiben.
 */
const ASSET_BASE: string =
  import.meta.env.VITE_ASSET_BASE ?? 'https://aurelwidmaier.github.io/pelaro_config'

export const partImage = (path: string) => `${ASSET_BASE}/parts/${path}`
