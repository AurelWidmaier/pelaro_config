import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveImage, type ProductCategory } from '../config/parts'
import { invalidateCatalog, type ProductRow } from '../lib/catalog'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils/format'
import { BIKE_TYPE_LABEL, CATEGORY_LABEL } from './labels'
import styles from './Admin.module.css'

export function ProductsPage() {
  const [category, setCategory] = useState<ProductCategory>('frame')
  const [rows, setRows] = useState<ProductRow[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const { data, error: loadError } = await supabase.from('products').select('*').order('sort_order')
    setError(loadError?.message ?? null)
    setRows((data as ProductRow[] | null) ?? [])
  }

  useEffect(() => {
    void load()
  }, [])

  async function toggleActive(row: ProductRow) {
    const { error: updateError } = await supabase.from('products').update({ active: !row.active }).eq('id', row.id)
    if (updateError) setError(updateError.message)
    invalidateCatalog()
    void load()
  }

  const visible = rows.filter((r) => r.category === category)

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Produkte</h1>
          <p className={styles.muted}>Inaktive Produkte erscheinen nicht im Konfigurator.</p>
        </div>
        <div className={styles.actionsRow}>
          <div className={styles.segmented} role="group" aria-label="Kategorie">
            {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.segment} ${category === c ? styles.segmentActive : ''}`}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABEL[c]} ({rows.filter((r) => r.category === c).length})
              </button>
            ))}
          </div>
          <Link to={`/admin/produkte/neu?kategorie=${category}`} className="btn btn-primary">
            Neues Produkt
          </Link>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <section className={`${styles.card} ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Bike-Typ</th>
              <th className={styles.num}>Preis ab</th>
              <th className={styles.num}>Gewicht</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const data = row.data as {
                name?: string
                brand?: string
                price?: number
                weight?: number
                image?: string
                bikeType?: string
                bikeTypes?: string[]
              }
              const types = data.bikeTypes ?? (data.bikeType ? [data.bikeType] : [])
              return (
                <tr key={row.id}>
                  <td>{data.image && <img className={styles.thumb} src={resolveImage(data.image)} alt="" />}</td>
                  <td>
                    <strong>{data.name}</strong>
                    <div className={styles.muted}>
                      {data.brand ? `${data.brand} · ` : ''}
                      {row.id}
                    </div>
                  </td>
                  <td>{types.map((t) => BIKE_TYPE_LABEL[t] ?? t).join(', ')}</td>
                  <td className={styles.num}>{typeof data.price === 'number' ? formatPrice(data.price) : '–'}</td>
                  <td className={styles.num}>{data.weight ? `${data.weight} g` : '–'}</td>
                  <td>
                    <button type="button" className={styles.linkButton} onClick={() => toggleActive(row)}>
                      <span className={`${styles.badge} ${row.active ? '' : styles.badgeOff}`}>
                        {row.active ? 'aktiv' : 'inaktiv'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <Link to={`/admin/produkte/${encodeURIComponent(row.id)}`} className={styles.smallButton}>
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}
