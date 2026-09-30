import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LOCAL_IMAGES, resolveImage, type PartSpec, type ProductCategory } from '../config/parts'
import { invalidateCatalog, type ProductRow } from '../lib/catalog'
import { IMAGE_BUCKET, supabase } from '../lib/supabase'
import { BIKE_TYPE_LABEL, CATEGORY_LABEL } from './labels'
import styles from './Admin.module.css'

type Data = Record<string, unknown>

const BIKE_TYPES = Object.keys(BIKE_TYPE_LABEL)

/** Felder, die über das JSON-Feld „Varianten & Preistabelle“ gepflegt werden. */
const ADVANCED_KEYS = ['variants', 'priceTable'] as const

const VARIANTS_HELP = `Varianten: [{ "id": "size", "label": "Rahmengröße", "defaultOptionId": "54",
  "options": [{ "id": "54", "label": "54 cm", "shopLabel": "54cm Matte", "priceDelta": 0, "weight": 1600, "maxTireWidth": 43,
  "specs": [{ "label": "…", "value": "…" }] }] }]
Preistabelle (optional): [{ "when": { "rimDepth": "50", "bearing": "steel" }, "price": 349.99 }]`

function emptyData(category: ProductCategory): Data {
  if (category === 'frame') return { name: '', description: '', price: 0, bikeType: 'rennrad', material: 'carbon', image: '' }
  if (category === 'groupset') return { name: '', description: '', price: 0, bikeTypes: ['rennrad'], kind: 'elektronisch', image: '' }
  return { name: '', description: '', price: 0, bikeTypes: ['rennrad'], material: 'carbon', image: '' }
}

function advancedJson(data: Data): string {
  const advanced: Data = {}
  for (const key of ADVANCED_KEYS) if (data[key] !== undefined) advanced[key] = data[key]
  return JSON.stringify(advanced, null, 2)
}

export function ProductEditor() {
  const { id: routeId } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const isNew = !routeId

  const [id, setId] = useState('')
  const [category, setCategory] = useState<ProductCategory>((search.get('kategorie') as ProductCategory) ?? 'frame')
  const [active, setActive] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [data, setData] = useState<Data>(() => emptyData(category))
  const [advanced, setAdvanced] = useState('{}')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isNew) return
    supabase
      .from('products')
      .select('*')
      .eq('id', routeId)
      .maybeSingle()
      .then(({ data: row, error: loadError }) => {
        if (loadError || !row) {
          setError(loadError?.message ?? 'Produkt nicht gefunden.')
          return
        }
        const product = row as ProductRow
        setId(product.id)
        setCategory(product.category)
        setActive(product.active)
        setSortOrder(product.sort_order)
        setData(product.data)
        setAdvanced(advancedJson(product.data))
      })
  }, [isNew, routeId])

  const set = (key: string, value: unknown) =>
    setData((d) => {
      const next = { ...d }
      if (value === '' || value === undefined || value === null) delete next[key]
      else next[key] = value
      return next
    })

  const str = (key: string) => (typeof data[key] === 'string' ? (data[key] as string) : '')
  const num = (key: string) => (typeof data[key] === 'number' ? String(data[key]) : '')
  const setNum = (key: string, value: string) => set(key, value === '' ? undefined : Number(value.replace(',', '.')))

  const specs = (data.specs as PartSpec[] | undefined) ?? []
  const setSpecs = (next: PartSpec[]) => set('specs', next.length > 0 ? next : undefined)

  const bikeTypes = (data.bikeTypes as string[] | undefined) ?? []
  const toggleBikeType = (type: string) =>
    set('bikeTypes', bikeTypes.includes(type) ? bikeTypes.filter((t) => t !== type) : [...bikeTypes, type])

  const brakeRotors = data.brakeRotors as [number, number] | undefined

  async function uploadImage(file: File) {
    setBusy(true)
    setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
    const path = `${category}/${(id || 'neu').replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { upsert: false })
    setBusy(false)
    if (uploadError) {
      setError(`Upload fehlgeschlagen: ${uploadError.message}`)
      return
    }
    set('image', supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    let advancedData: Data
    try {
      advancedData = JSON.parse(advanced || '{}') as Data
      if (typeof advancedData !== 'object' || Array.isArray(advancedData)) throw new Error('Objekt erwartet')
      if (advancedData.variants !== undefined && !Array.isArray(advancedData.variants))
        throw new Error('"variants" muss eine Liste sein')
      if (advancedData.priceTable !== undefined && !Array.isArray(advancedData.priceTable))
        throw new Error('"priceTable" muss eine Liste sein')
    } catch (e) {
      setError(`Varianten-JSON ungültig: ${(e as Error).message}`)
      return
    }

    const cleanId = id.trim()
    if (!/^[a-z0-9-]+$/.test(cleanId)) {
      setError('ID nur aus Kleinbuchstaben, Ziffern und Bindestrichen, z. B. frame-bxt-pro-145.')
      return
    }
    if (!str('name').trim()) {
      setError('Name fehlt.')
      return
    }
    if (typeof data.price !== 'number' || Number.isNaN(data.price)) {
      setError('Preis fehlt.')
      return
    }
    if (category !== 'frame' && bikeTypes.length === 0) {
      setError('Mindestens einen Bike-Typ auswählen.')
      return
    }

    const payload: Data = { ...data }
    for (const key of ADVANCED_KEYS) delete payload[key]
    Object.assign(payload, advancedData)
    // Felder der anderen Kategorien entfernen
    if (category === 'frame') delete payload.bikeTypes
    else delete payload.bikeType

    setBusy(true)
    const row = { id: cleanId, category, data: payload, active, sort_order: sortOrder }
    const result = isNew
      ? await supabase.from('products').insert(row)
      : await supabase.from('products').update(row).eq('id', routeId)
    setBusy(false)
    if (result.error) {
      setError(result.error.code === '23505' ? 'Diese ID gibt es schon.' : result.error.message)
      return
    }
    invalidateCatalog()
    setMessage('Gespeichert.')
    if (isNew || cleanId !== routeId) navigate(`/admin/produkte/${encodeURIComponent(cleanId)}`, { replace: true })
  }

  async function remove() {
    if (!window.confirm(`„${str('name')}“ endgültig löschen? Tipp: Deaktivieren blendet es nur aus.`)) return
    const { error: deleteError } = await supabase.from('products').delete().eq('id', routeId)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    invalidateCatalog()
    navigate('/admin/produkte')
  }

  const imageValue = str('image')

  return (
    <form className={styles.form} onSubmit={save}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.muted}>{CATEGORY_LABEL[category]}</p>
          <h1 className={styles.title}>{isNew ? 'Neues Produkt' : str('name') || routeId}</h1>
        </div>
        <div className={styles.actionsRow}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/produkte')}>
            Zurück
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Speichert …' : 'Speichern'}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Allgemein</h2>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            ID
            <input className={styles.input} value={id} onChange={(e) => setId(e.target.value)} disabled={!isNew} required />
            <span className={styles.hint}>Eindeutig, später nicht änderbar.</span>
          </label>
          <label className={styles.field}>
            Kategorie
            <select
              className={styles.select}
              value={category}
              disabled={!isNew}
              onChange={(e) => {
                const next = e.target.value as ProductCategory
                setCategory(next)
                setData(emptyData(next))
              }}
            >
              {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            Sortierung
            <input
              className={styles.input}
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
            <span className={styles.hint}>Kleinere Zahl = weiter vorne.</span>
          </label>
          <label className={styles.field}>
            Status
            <span className={styles.checkRow}>
              <label>
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> aktiv (im
                Konfigurator sichtbar)
              </label>
            </span>
          </label>
          <label className={styles.field}>
            Name
            <input className={styles.input} value={str('name')} onChange={(e) => set('name', e.target.value)} required />
          </label>
          <label className={styles.field}>
            Marke
            <input className={styles.input} value={str('brand')} onChange={(e) => set('brand', e.target.value)} />
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            Einsteiger-Tipp
            <input
              className={styles.input}
              value={str('hint')}
              placeholder="Nimm das, wenn …"
              onChange={(e) => set('hint', e.target.value)}
            />
            <span className={styles.hint}>Erscheint auf der Auswahlkarte, z. B. „Nimm das, wenn du viel bergauf fährst.“</span>
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            Beim Händler wählen
            <input
              className={styles.input}
              value={str('shopChoice')}
              placeholder="„{size}cm {finish}“ · Farbe nach Wunsch"
              onChange={(e) => set('shopChoice', e.target.value)}
            />
            <span className={styles.hint}>
              Steht in Teileliste und PDF. {'{gruppen-id}'} wird durch den Händler-Namen der gewählten Variante ersetzt
              („shopLabel“ im Varianten-JSON, sonst die ID).
            </span>
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            Beschreibung
            <textarea
              className={styles.textarea}
              value={str('description')}
              onChange={(e) => set('description', e.target.value)}
            />
          </label>
          <label className={styles.field}>
            Grundpreis (€)
            <input
              className={styles.input}
              inputMode="decimal"
              value={num('price')}
              onChange={(e) => setNum('price', e.target.value)}
              required
            />
            <span className={styles.hint}>Ohne Versand. Aufpreise je Variante im JSON unten.</span>
          </label>
          <label className={styles.field}>
            Gesamtgewicht (g)
            <input
              className={styles.input}
              inputMode="numeric"
              value={num('weight')}
              onChange={(e) => setNum('weight', e.target.value)}
            />
            <span className={styles.hint}>Summe aller mitgelieferten Teile. Leer = unbekannt.</span>
          </label>
          <label className={`${styles.field} ${styles.fieldWide}`}>
            Händler-Link (Affiliate)
            <input className={styles.input} type="url" value={str('url')} onChange={(e) => set('url', e.target.value)} />
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Einordnung & Kompatibilität</h2>
        <div className={styles.formGrid}>
          {category === 'frame' ? (
            <label className={styles.field}>
              Bike-Typ
              <select className={styles.select} value={str('bikeType')} onChange={(e) => set('bikeType', e.target.value)}>
                {BIKE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {BIKE_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className={styles.field}>
              Bike-Typen
              <div className={styles.checkRow}>
                {BIKE_TYPES.map((t) => (
                  <label key={t}>
                    <input type="checkbox" checked={bikeTypes.includes(t)} onChange={() => toggleBikeType(t)} />
                    {BIKE_TYPE_LABEL[t]}
                  </label>
                ))}
              </div>
            </div>
          )}

          {category !== 'groupset' && (
            <label className={styles.field}>
              Material
              <select className={styles.select} value={str('material')} onChange={(e) => set('material', e.target.value)}>
                <option value="alu">Alu</option>
                <option value="carbon">Carbon</option>
              </select>
            </label>
          )}

          {category === 'groupset' && (
            <>
              <label className={styles.field}>
                Art
                <select className={styles.select} value={str('kind')} onChange={(e) => set('kind', e.target.value)}>
                  <option value="mechanisch-2x">2x mechanisch</option>
                  <option value="mechanisch-1x">1x mechanisch</option>
                  <option value="elektronisch">Elektronisch</option>
                </select>
              </label>
              <label className={styles.field}>
                Freilauf der Kassette
                <select className={styles.select} value={str('freehub')} onChange={(e) => set('freehub', e.target.value)}>
                  <option value="">– nicht festgelegt –</option>
                  <option value="shimano-hg">Shimano HG</option>
                  <option value="sram-xdr">SRAM XDR</option>
                  <option value="shimano-ms">Shimano Micro Spline</option>
                </select>
                <span className={styles.hint}>Legt die Freilauf-Variante der Laufräder fest.</span>
              </label>
              <div className={styles.field}>
                Lieferumfang
                <div className={styles.checkRow}>
                  <label>
                    <input
                      type="checkbox"
                      checked={data.includesRotors === true}
                      onChange={(e) => set('includesRotors', e.target.checked || undefined)}
                    />
                    Bremsscheiben im Set
                  </label>
                </div>
                <span className={styles.hint}>
                  Innenlager im Set: als Variante mit der ID „bottomBracket“ (bsa, bb86, pf30, bb30, t47) anlegen – sie
                  wird dann automatisch passend zum Rahmen gewählt.
                </span>
              </div>
            </>
          )}

          {category === 'frame' && (
            <>
              <label className={styles.field}>
                Tretlager
                <select
                  className={styles.select}
                  value={str('bottomBracket')}
                  onChange={(e) => set('bottomBracket', e.target.value)}
                >
                  <option value="">– unbekannt –</option>
                  <option value="bsa">BSA</option>
                  <option value="bb86">BB86/92</option>
                  <option value="pf30">PF30</option>
                  <option value="bb30">BB30</option>
                  <option value="t47">T47</option>
                </select>
              </label>
              <label className={styles.field}>
                Bremsscheiben VR / HR (mm)
                <span className={styles.checkRow}>
                  {[0, 1].map((i) => (
                    <select
                      key={i}
                      className={styles.select}
                      style={{ width: 'auto' }}
                      value={brakeRotors ? String(brakeRotors[i]) : ''}
                      onChange={(e) => {
                        if (!e.target.value) return set('brakeRotors', undefined)
                        const next: [number, number] = brakeRotors ? [...brakeRotors] : [160, 160]
                        next[i] = Number(e.target.value)
                        set('brakeRotors', next)
                      }}
                    >
                      <option value="">Standard</option>
                      {[140, 160, 180, 203].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ))}
                </span>
              </label>
            </>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Bild</h2>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            {imageValue && <img className={styles.imagePreview} src={resolveImage(imageValue)} alt="" />}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            />
            <span className={styles.hint}>PNG mit transparentem Hintergrund wirkt am besten.</span>
          </div>
          <div className={styles.form}>
            <label className={styles.field}>
              Bild-URL
              <input className={styles.input} value={imageValue} onChange={(e) => set('image', e.target.value)} />
              <span className={styles.hint}>
                Hochgeladen, eigene URL oder Platzhalter: {Object.keys(LOCAL_IMAGES).map((k) => `local:${k}`).join(', ')}
              </span>
            </label>
            <label className={styles.field}>
              Kurzname für Komplettbike-Bilder (imageKey)
              <input className={styles.input} value={str('imageKey')} onChange={(e) => set('imageKey', e.target.value)} />
              <span className={styles.hint}>z. B. bxtPro145 → cdn/bikes/bxtPro145_ent2_er7.png</span>
            </label>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={data.photo === true}
                onChange={(e) => set('photo', e.target.checked || undefined)}
              />
              Echtes Produktfoto (nicht als Ebene über die Bike-Grafik legen)
            </label>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Technische Daten</h2>
        {specs.map((spec, i) => (
          <div key={i} className={styles.specRow}>
            <input
              className={styles.input}
              placeholder="Bezeichnung"
              value={spec.label}
              onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
            />
            <input
              className={styles.input}
              placeholder="Wert"
              value={spec.value}
              onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
            />
            <button type="button" className={styles.smallButton} onClick={() => setSpecs(specs.filter((_, j) => j !== i))}>
              Entfernen
            </button>
          </div>
        ))}
        <button type="button" className={styles.smallButton} onClick={() => setSpecs([...specs, { label: '', value: '' }])}>
          + Zeile
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Varianten & Preistabelle (JSON)</h2>
        <label className={styles.field}>
          <textarea
            className={`${styles.textarea} ${styles.code}`}
            value={advanced}
            onChange={(e) => setAdvanced(e.target.value)}
            spellCheck={false}
          />
          <span className={styles.hint} style={{ whiteSpace: 'pre-wrap' }}>
            {VARIANTS_HELP}
          </span>
        </label>
      </section>

      <div className={styles.actionsRow}>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Speichert …' : 'Speichern'}
        </button>
        {!isNew && (
          <button type="button" className={`${styles.smallButton} ${styles.dangerButton}`} onClick={remove}>
            Produkt löschen
          </button>
        )}
      </div>
    </form>
  )
}
