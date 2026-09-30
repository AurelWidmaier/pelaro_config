import { useState } from 'react'
import styles from './Admin.module.css'

export interface DayStats {
  day: string
  page_views: number
  visits: number
  unique_visitors: number
}

const WIDTH = 720
const HEIGHT = 220
const PAD = { top: 12, right: 8, bottom: 26, left: 36 }
const BAR_GAP = 2

const dayFormat = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' })
const longDayFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })

function niceMax(value: number): number {
  if (value <= 4) return 4
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value / 4)! * magnitude
  return Math.ceil(value / step) * step
}

/** Säulen: Besuche pro Tag; Tooltip mit Aufrufen und eindeutigen Besuchern. */
export function VisitsChart({ data }: { data: DayStats[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)

  if (data.length === 0) return <p className={styles.muted}>Keine Daten.</p>

  const max = niceMax(Math.max(...data.map((d) => d.visits), 1))
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const slot = plotW / data.length
  const barW = Math.max(2, Math.min(28, slot - BAR_GAP))
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max]
  const labelEvery = Math.ceil(data.length / 8)
  const hovered = hover !== null ? data[hover] : null

  return (
    <div>
      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width="100%"
          role="img"
          aria-label="Besuche pro Tag"
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="rgba(36, 72, 85, 0.12)"
                strokeWidth={1}
              />
              <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize={10} fill="var(--text-muted)">
                {Number.isInteger(t) ? t : ''}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * slot + (slot - barW) / 2
            const h = Math.max(0, y(0) - y(d.visits))
            const r = Math.min(4, barW / 2, h)
            return (
              <g key={d.day}>
                {h > 0 && (
                  <path
                    d={`M${x},${y(0)} V${y(0) - h + r} Q${x},${y(0) - h} ${x + r},${y(0) - h} H${x + barW - r} Q${x + barW},${y(0) - h} ${x + barW},${y(0) - h + r} V${y(0)} Z`}
                    fill="var(--color-dark)"
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                )}
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={HEIGHT - 8} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
                    {dayFormat.format(new Date(d.day))}
                  </text>
                )}
                {/* Trefferfläche über die ganze Spalte, größer als die Säule */}
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
              </g>
            )
          })}
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(0)} y2={y(0)} stroke="rgba(36, 72, 85, 0.35)" />
        </svg>
        {hovered && hover !== null && (
          <div
            className={styles.tooltip}
            style={{
              left: `${((PAD.left + hover * slot + slot / 2) / WIDTH) * 100}%`,
              top: `${(y(hovered.visits) / HEIGHT) * 100}%`,
            }}
          >
            <strong>{longDayFormat.format(new Date(hovered.day))}</strong>
            <br />
            {hovered.visits} Besuche · {hovered.unique_visitors} eindeutig
            <br />
            {hovered.page_views} Seitenaufrufe
          </div>
        )}
      </div>
      <button type="button" className={styles.linkButton} onClick={() => setShowTable((v) => !v)}>
        {showTable ? 'Tabelle ausblenden' : 'Als Tabelle anzeigen'}
      </button>
      {showTable && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tag</th>
                <th className={styles.num}>Besuche</th>
                <th className={styles.num}>Eindeutig</th>
                <th className={styles.num}>Aufrufe</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.day}>
                  <td>{longDayFormat.format(new Date(d.day))}</td>
                  <td className={styles.num}>{d.visits}</td>
                  <td className={styles.num}>{d.unique_visitors}</td>
                  <td className={styles.num}>{d.page_views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
