import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConfigurator } from '../../../context/ConfiguratorContext'
import {
  getBikeTypeInfo,
  getConfiguredPrice,
  getConfiguredWeight,
  getFrameById,
  getGroupsetById,
  getSelectedVariantOptions,
  getWheelsById,
  type VariantSelection,
} from '../../../config/parts'
import { getStandardParts } from '../../../config/standardParts'
import { findExportBikeImage, useRealFrameImages } from '../../../config/bikeImages'
import { exportBikePdf, type PdfPartRow } from '../../../utils/exportPdf'
import { SHIPPING_NOTE, formatPrice, formatWeight } from '../../../utils/format'
import { BikeCanvas } from '../../../components/BikeCanvas'
import { StepShell } from '../StepShell'
import styles from './ResultStep.module.css'

/** Innenabstand der Bildfläche in px – das Foto ragt darüber bis an den Rand. */
const VISUAL_PADDING = 24

export function ResultStep() {
  const {
    bikeType,
    budget,
    totalPrice,
    totalWeight,
    weightIncomplete,
    frameId,
    frameVariants,
    groupsetId,
    groupsetVariants,
    wheelsId,
    wheelsVariants,
    tireVariants,
    goBack,
    reset,
  } = useConfigurator()

  const bikeTypeInfo = getBikeTypeInfo(bikeType)
  const frame = getFrameById(frameId)
  const groupset = getGroupsetById(groupsetId)
  const wheels = getWheelsById(wheelsId)
  const standardParts = getStandardParts(bikeType, { frame, groupset, wheels, wheelsVariants, tireVariants })
  const overBudget = totalPrice > budget
  const [exporting, setExporting] = useState(false)
  const realImages = useRealFrameImages(frame?.imageKey)

  const partRows: ResultRow[] = [
    { label: 'Bike-Typ', option: bikeTypeInfo, url: undefined, price: undefined, weight: undefined, variants: '' },
    {
      label: 'Rahmen',
      option: frame,
      url: frame?.url,
      price: frame ? getConfiguredPrice(frame, frameVariants) : undefined,
      weight: getConfiguredWeight(frame, frameVariants),
      variants: describeVariants(frame, frameVariants),
    },
    {
      label: 'Schaltgruppe',
      option: groupset,
      url: groupset?.url,
      price: groupset ? getConfiguredPrice(groupset, groupsetVariants) : undefined,
      weight: getConfiguredWeight(groupset, groupsetVariants),
      variants: describeVariants(groupset, groupsetVariants),
    },
    {
      label: 'Laufräder',
      option: wheels,
      url: wheels?.url,
      price: wheels ? getConfiguredPrice(wheels, wheelsVariants) : undefined,
      weight: getConfiguredWeight(wheels, wheelsVariants),
      variants: describeVariants(wheels, wheelsVariants),
    },
  ]

  const standardRows: ResultRow[] = standardParts.map((part) => ({
    label: part.label,
    option: part,
    url: part.url,
    price: part.price,
    weight: part.weight,
    variants: part.detail ?? '',
  }))

  async function handleExport() {
    setExporting(true)
    try {
      const image =
        (await findExportBikeImage(frame?.imageKey, wheels?.imageKey, groupset?.imageKey)) ??
        (frame ? { url: frame.image, isPreview: false } : undefined)
      const toPdfRow = (row: ResultRow): PdfPartRow => ({
        label: row.label,
        name: row.option?.name ?? '—',
        detail: row.variants || undefined,
        price: row.price,
        weight: row.weight,
        url: row.url,
      })
      await exportBikePdf({
        bikeTypeName: bikeTypeInfo?.name,
        image,
        parts: partRows.filter((row) => row.price !== undefined).map(toPdfRow),
        standardParts: standardRows.map(toPdfRow),
        totalPrice,
        totalWeight,
        weightIncomplete,
        budget,
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <StepShell
      eyebrow="Dein Ergebnis"
      title="So sieht dein Bike aus"
      intro="Zusammengesetzt aus deinen ausgewählten Teilen. Du kannst noch etwas ändern oder von vorn beginnen."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Neu starten
          </button>
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.visual}>
          <BikeCanvas frameId={frameId} groupsetId={groupsetId} wheelsId={wheelsId} bleed={VISUAL_PADDING} />
        </div>

        <div className={styles.summary}>
          <ul className={styles.list}>
            {partRows.map(renderRow)}
          </ul>

          {standardParts.length > 0 && (
            <>
              <h3 className={styles.listHeading}>Immer dabei</h3>
              <ul className={styles.list}>
                {standardRows.map(renderRow)}
              </ul>
            </>
          )}

          <div className={styles.totalRow}>
            <span>Gesamtpreis</span>
            <span className={overBudget ? styles.totalOver : styles.totalPrice}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span>Gesamtgewicht</span>
            <span className={styles.totalPrice}>
              {totalWeight > 0 ? `${weightIncomplete ? 'mind. ' : ''}${formatWeight(totalWeight)}` : '—'}
            </span>
          </div>
          <div className={styles.budgetNote}>
            {overBudget
              ? `${formatPrice(totalPrice - budget)} über deinem Budget von ${formatPrice(budget)}`
              : `${formatPrice(budget - totalPrice)} unter deinem Budget von ${formatPrice(budget)}`}
          </div>
          <div className={styles.budgetNote}>{SHIPPING_NOTE}</div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'PDF wird erstellt …' : 'Als PDF herunterladen'}
            </button>
            <Link to="/" className="btn btn-ghost">
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>

      {realImages.length > 0 && (
        <section className={styles.real}>
          <h3 className={styles.realTitle}>So sieht dein Rahmen in verschiedenen Builds in echt aus</h3>
          <p className={styles.realIntro}>
            Echte Fotos des {frame?.name} – teils mit anderen Teilen aufgebaut als in deiner Konfiguration.
          </p>
          <div className={styles.realGrid}>
            {realImages.map((src, i) => (
              <a key={src} href={src} target="_blank" rel="noreferrer" className={styles.realItem}>
                <img src={src} alt={`${frame?.name} – echtes Foto ${i + 1}`} loading="lazy" />
              </a>
            ))}
          </div>
        </section>
      )}
    </StepShell>
  )
}

/** Kurzbeschreibung der Unterauswahl, z. B. "Rahmengröße 54 cm · Matt". */
function describeVariants(
  part: Parameters<typeof getSelectedVariantOptions>[0],
  selection: VariantSelection,
): string {
  return getSelectedVariantOptions(part, selection)
    .map(({ group, option }) => `${group.label} ${option.label}`)
    .join(' · ')
}

interface ResultRow {
  label: string
  option?: { name: string }
  url?: string
  price?: number
  weight?: number
  variants: string
}

function renderRow({ label, option, url, price, weight, variants }: ResultRow) {
  const content = (
    <>
      <div>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowName}>
          {option?.name ?? '—'}
          {url && (
            <span className={styles.rowLinkIcon} aria-hidden="true">
              ↗
            </span>
          )}
        </span>
        {variants && <span className={styles.rowVariants}>{variants}</span>}
      </div>
      <span className={styles.rowPrice}>
        {price !== undefined ? formatPrice(price) : ''}
        {weight !== undefined && <span className={styles.rowWeight}>{formatWeight(weight)}</span>}
      </span>
    </>
  )
  return (
    <li key={label}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`${styles.row} ${styles.rowLink}`}
          title={`${option?.name} beim Händler ansehen`}
        >
          {content}
        </a>
      ) : (
        <div className={styles.row}>{content}</div>
      )}
    </li>
  )
}
