import {
  applyCatalog,
  resolveImage,
  type CatalogFrame,
  type CatalogGroupset,
  type CatalogWheelset,
  type ProductCategory,
} from '../config/parts'
import { DEFAULT_STANDARD_PARTS, applyStandardParts, type StandardPartsConfig } from '../config/standardParts'
import { supabase } from './supabase'

/** Eine Zeile der Tabelle `products`; `data` enthält alle Produktfelder außer der ID. */
export interface ProductRow {
  id: string
  category: ProductCategory
  data: Record<string, unknown>
  active: boolean
  sort_order: number
  updated_at?: string
}

export function rowToProduct<T>(row: ProductRow): T {
  const data = row.data as { image?: string }
  return { ...row.data, id: row.id, image: resolveImage(data.image ?? '') } as T
}

let loading: Promise<void> | null = null

/**
 * Lädt aktive Produkte und Standardkomponenten aus der Datenbank und ersetzt
 * damit den mitgelieferten Katalog. Schlägt das fehl, bleibt der eingebaute
 * Katalog aktiv – der Konfigurator funktioniert also auch offline.
 */
export function loadCatalog(): Promise<void> {
  loading ??= (async () => {
    const [products, settings] = await Promise.all([
      supabase.from('products').select('*').eq('active', true).order('sort_order'),
      supabase.from('settings').select('value').eq('key', 'standard_parts').maybeSingle(),
    ])
    if (products.error) throw products.error
    const rows = (products.data ?? []) as ProductRow[]
    if (rows.length > 0) {
      applyCatalog({
        frames: rows.filter((r) => r.category === 'frame').map((r) => rowToProduct<CatalogFrame>(r)),
        groupsets: rows.filter((r) => r.category === 'groupset').map((r) => rowToProduct<CatalogGroupset>(r)),
        wheels: rows.filter((r) => r.category === 'wheels').map((r) => rowToProduct<CatalogWheelset>(r)),
      })
    }
    if (settings.data?.value) {
      applyStandardParts({ ...DEFAULT_STANDARD_PARTS, ...(settings.data.value as Partial<StandardPartsConfig>) })
    }
  })().catch((error) => {
    console.warn('Katalog konnte nicht geladen werden – nutze eingebauten Katalog.', error)
  })
  return loading
}

/** Nach Änderungen im Admin: beim nächsten Aufruf neu laden. */
export function invalidateCatalog() {
  loading = null
}
