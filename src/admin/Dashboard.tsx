import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { VisitsChart, type DayStats } from './VisitsChart'
import styles from './Admin.module.css'

interface Summary {
  page_views: number
  visits: number
  unique_visitors: number
  consented_share: number | null
}

const RANGES = [
  { days: 1, label: 'Heute' },
  { days: 7, label: '7 Tage' },
  { days: 30, label: '30 Tage' },
  { days: 90, label: '90 Tage' },
]

const numberFormat = new Intl.NumberFormat('de-DE')

export function Dashboard() {
  const [days, setDays] = useState(30)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [daily, setDaily] = useState<DayStats[]>([])
  const [topPages, setTopPages] = useState<{ path: string; page_views: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    // Das Diagramm zeigt mindestens 7 Tage, damit „Heute“ nicht nur eine Säule ist.
    const chartDays = Math.max(days, 7)
    Promise.all([
      supabase.rpc('admin_visit_summary', { days }),
      supabase.rpc('admin_visit_stats', { days: chartDays }),
      supabase.rpc('admin_top_pages', { days, max_rows: 10 }),
    ]).then(([s, d, t]) => {
      if (!active) return
      const failed = s.error ?? d.error ?? t.error
      setError(failed ? failed.message : null)
      setSummary((s.data as Summary[] | null)?.[0] ?? null)
      setDaily(
        ((d.data as DayStats[] | null) ?? []).map((row) => ({
          day: row.day,
          page_views: Number(row.page_views),
          visits: Number(row.visits),
          unique_visitors: Number(row.unique_visitors),
        })),
      )
      setTopPages((t.data as { path: string; page_views: number }[] | null) ?? [])
    })
    return () => {
      active = false
    }
  }, [days])

  const tiles = [
    { label: 'Eindeutige Besucher', value: summary?.unique_visitors, sub: 'mit Einwilligung gezählt' },
    { label: 'Besuche', value: summary?.visits, sub: 'Sitzungen inkl. anonymer' },
    { label: 'Seitenaufrufe', value: summary?.page_views, sub: 'alle Aufrufe' },
    {
      label: 'Einwilligungsquote',
      value: summary?.consented_share != null ? `${Math.round(Number(summary.consented_share) * 100)} %` : undefined,
      sub: 'Aufrufe mit Besucher-ID',
    },
  ]

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Übersicht</h1>
          <p className={styles.muted}>Besuche der Website (ohne /admin), Zeitzone Berlin.</p>
        </div>
        <div className={styles.segmented} role="group" aria-label="Zeitraum">
          {RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              className={`${styles.segment} ${days === range.days ? styles.segmentActive : ''}`}
              aria-pressed={days === range.days}
              onClick={() => setDays(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className={styles.error}>Statistik konnte nicht geladen werden: {error}</p>}

      <div className={styles.tiles}>
        {tiles.map((tile) => (
          <div key={tile.label} className={styles.tile}>
            <span className={styles.tileLabel}>{tile.label}</span>
            <span className={styles.tileValue}>
              {typeof tile.value === 'number' ? numberFormat.format(tile.value) : (tile.value ?? '–')}
            </span>
            <span className={styles.tileSub}>{tile.sub}</span>
          </div>
        ))}
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Besuche pro Tag</h2>
        <VisitsChart data={daily} />
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Meistbesuchte Seiten</h2>
        {topPages.length === 0 ? (
          <p className={styles.muted}>Noch keine Aufrufe im Zeitraum.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Seite</th>
                <th className={styles.num}>Aufrufe</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page) => (
                <tr key={page.path}>
                  <td>{page.path}</td>
                  <td className={styles.num}>{numberFormat.format(Number(page.page_views))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className={styles.muted}>
        Eindeutige Besucher werden nur gezählt, wenn Besucher der Statistik zustimmen. Ohne Zustimmung
        zählt ein Besuch anonym als Aufruf bzw. Besuch, aber nicht als eindeutiger Besucher.
      </p>
    </>
  )
}
