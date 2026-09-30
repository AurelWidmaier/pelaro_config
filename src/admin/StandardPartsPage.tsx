import { useEffect, useState } from 'react'
import { DEFAULT_STANDARD_PARTS, type StandardPartsConfig } from '../config/standardParts'
import { invalidateCatalog } from '../lib/catalog'
import { supabase } from '../lib/supabase'
import styles from './Admin.module.css'

type SimpleKey = 'saddle' | 'barTape' | 'roadTire'

const SIMPLE_PARTS: { key: SimpleKey; label: string; hint: string }[] = [
  { key: 'saddle', label: 'Sattel', hint: '' },
  { key: 'barTape', label: 'Lenkerband', hint: '' },
  { key: 'roadTire', label: 'Rennrad-Reifen', hint: 'Preis und Gewicht für beide Reifen.' },
]

/** Standardkomponenten (Einstellung `standard_parts`). */
export function StandardPartsPage() {
  const [config, setConfig] = useState<StandardPartsConfig | null>(null)
  const [json, setJson] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'standard_parts')
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) setError(loadError.message)
        const value = { ...DEFAULT_STANDARD_PARTS, ...((data?.value as Partial<StandardPartsConfig>) ?? {}) }
        setConfig(value)
        setJson(JSON.stringify({ gravelTire: value.gravelTire, rotors: value.rotors, defaultRotors: value.defaultRotors, bottomBrackets: value.bottomBrackets }, null, 2))
      })
  }, [])

  if (!config) return <p className={styles.muted}>Lädt …</p>

  const setSimple = (key: SimpleKey, field: string, value: string) =>
    setConfig((c) => {
      if (!c) return c
      const part = { ...c[key] } as Record<string, unknown>
      if (field === 'price' || field === 'weight') {
        if (value === '') delete part[field]
        else part[field] = Number(value.replace(',', '.'))
      } else if (value === '' && (field === 'detail' || field === 'shopChoice')) delete part[field]
      else part[field] = value
      return { ...c, [key]: part }
    })

  const setTubes = (field: keyof StandardPartsConfig['tubes'], value: string) =>
    setConfig((c) =>
      c && {
        ...c,
        tubes: {
          ...c.tubes,
          [field]: ['name', 'url', 'shopRoad', 'shopGravel'].includes(field) ? value : Number(value.replace(',', '.')),
        },
      },
    )

  async function save() {
    if (!config) return
    setError(null)
    setMessage(null)
    let advanced: Partial<StandardPartsConfig>
    try {
      advanced = JSON.parse(json) as Partial<StandardPartsConfig>
    } catch (e) {
      setError(`JSON ungültig: ${(e as Error).message}`)
      return
    }
    const value = { ...config, ...advanced }
    const { error: saveError } = await supabase.from('settings').upsert({ key: 'standard_parts', value })
    if (saveError) {
      setError(saveError.message)
      return
    }
    setConfig(value)
    invalidateCatalog()
    setMessage('Gespeichert.')
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Standardteile</h1>
          <p className={styles.muted}>Teile, die bei jedem Bike automatisch dabei sind. Preise ohne Versand.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={save}>
          Speichern
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {SIMPLE_PARTS.map(({ key, label, hint }) => (
        <section key={key} className={styles.card}>
          <h2 className={styles.cardTitle}>{label}</h2>
          {hint && <p className={styles.muted}>{hint}</p>}
          <div className={styles.formGrid}>
            <label className={styles.field}>
              Name
              <input className={styles.input} value={config[key].name} onChange={(e) => setSimple(key, 'name', e.target.value)} />
            </label>
            <label className={styles.field}>
              Preis (€)
              <input
                className={styles.input}
                inputMode="decimal"
                value={config[key].price}
                onChange={(e) => setSimple(key, 'price', e.target.value)}
              />
            </label>
            <label className={styles.field}>
              Gewicht (g)
              <input
                className={styles.input}
                inputMode="numeric"
                value={config[key].weight ?? ''}
                onChange={(e) => setSimple(key, 'weight', e.target.value)}
              />
            </label>
            <label className={styles.field}>
              Zusatzinfo
              <input
                className={styles.input}
                value={config[key].detail ?? ''}
                onChange={(e) => setSimple(key, 'detail', e.target.value)}
              />
            </label>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              Beim Händler wählen
              <input
                className={styles.input}
                value={config[key].shopChoice ?? ''}
                placeholder="z. B. „700x28 Tubelss“ (schwarz), Menge 2"
                onChange={(e) => setSimple(key, 'shopChoice', e.target.value)}
              />
            </label>
            <label className={`${styles.field} ${styles.fieldWide}`}>
              Händler-Link
              <input className={styles.input} value={config[key].url} onChange={(e) => setSimple(key, 'url', e.target.value)} />
            </label>
          </div>
        </section>
      ))}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Schläuche</h2>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            Name
            <input className={styles.input} value={config.tubes.name} onChange={(e) => setTubes('name', e.target.value)} />
          </label>
          <label className={styles.field}>
            Preis fürs Set (€)
            <input className={styles.input} inputMode="decimal" value={config.tubes.price} onChange={(e) => setTubes('price', e.target.value)} />
          </label>
          <label className={styles.field}>
            Gewicht je Schlauch Rennrad (g)
            <input className={styles.input} inputMode="numeric" value={config.tubes.weightRoad} onChange={(e) => setTubes('weightRoad', e.target.value)} />
          </label>
          <label className={styles.field}>
            Gewicht je Schlauch Gravel (g)
            <input className={styles.input} inputMode="numeric" value={config.tubes.weightGravel} onChange={(e) => setTubes('weightGravel', e.target.value)} />
          </label>
          <label className={styles.field}>
            Händler-Variante Rennrad
            <input className={styles.input} value={config.tubes.shopRoad ?? ''} onChange={(e) => setTubes('shopRoad', e.target.value)} />
          </label>
          <label className={styles.field}>
            Händler-Variante Gravel
            <input className={styles.input} value={config.tubes.shopGravel ?? ''} onChange={(e) => setTubes('shopGravel', e.target.value)} />
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            Händler-Link
            <input className={styles.input} value={config.tubes.url} onChange={(e) => setTubes('url', e.target.value)} />
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Gravel-Reifen, Bremsscheiben & Innenlager (JSON)</h2>
        <label className={styles.field}>
          <textarea
            className={`${styles.textarea} ${styles.code}`}
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
          />
          <span className={styles.hint}>
            gravelTire.options: Preis/Gewicht je Reifen, shopLabel = Größe beim Händler · shopChoice = was beim Händler zu wählen ist · rotors.sizes: Preis/Gewicht je Scheibe · defaultRotors: VR/HR in mm
            · bottomBrackets: Zusatz-Innenlager je „rahmen-id|schaltgruppen-id“ (nur nötig, wenn die Gruppe kein passendes
            Lager mitbringt)
          </span>
        </label>
      </section>
    </>
  )
}
