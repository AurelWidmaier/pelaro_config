import { formatPrice, formatWeight } from './format'

export interface PdfPartRow {
  label: string
  name: string
  /** Unterauswahl bzw. Menge, z. B. "Rahmengröße 54 cm · Matt". */
  detail?: string
  price?: number
  weight?: number
  url?: string
}

export interface BikePdfData {
  bikeTypeName?: string
  /** Bild-URL (PNG/JPG/SVG, CORS-fähig) und ob es das KI-Vorschaubild ist. */
  image?: { url: string; isPreview: boolean }
  parts: PdfPartRow[]
  standardParts: PdfPartRow[]
  totalPrice: number
  totalWeight: number
  weightIncomplete: boolean
  budget: number
}

// Theme-Farben aus styles/variables.css
const DARK: [number, number, number] = [36, 72, 85]
const ACCENT: [number, number, number] = [230, 72, 51]
const MUTED: [number, number, number] = [91, 116, 128]
const CARD: [number, number, number] = [226, 235, 233]
const LINE: [number, number, number] = [214, 222, 224]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 16
const CONTENT_W = PAGE_W - 2 * MARGIN

/** jsPDF-Standardschriften kennen keine schmalen Leerzeichen aus Intl. */
const pdfText = (text: string) => text.replace(/[  ]/g, ' ')

/**
 * Lädt ein Bild und rendert es auf einen Canvas mit Kachel-Hintergrund.
 * So funktionieren auch SVGs und transparente PNGs im PDF.
 */
async function loadImageAsJpeg(url: string): Promise<{ dataUrl: string; ratio: number }> {
  // onload statt img.decode(): decode() hängt in Hintergrund-Tabs.
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image()
    el.crossOrigin = 'anonymous'
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error(`Bild nicht ladbar: ${url}`))
    el.src = url
  })

  const width = img.naturalWidth || 1500
  const height = img.naturalHeight || 900
  // Auf 1500–2000 px Breite bringen (kleine SVGs werden sonst unscharf).
  const scale = Math.min(Math.max(1, 1500 / width), 2000 / width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = `rgb(${CARD.join(',')})`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return { dataUrl: canvas.toDataURL('image/jpeg', 0.9), ratio: canvas.height / canvas.width }
}

export async function exportBikePdf(data: BikePdfData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  // Kopf
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...DARK)
  doc.text('pelaro', MARGIN, y + 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(pdfText(new Date().toLocaleDateString('de-DE')), PAGE_W - MARGIN, y + 6, { align: 'right' })
  y += 16

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...DARK)
  doc.text(pdfText(`Dein ${data.bikeTypeName ?? 'Bike'}`), MARGIN, y)
  y += 6

  // Bild
  if (data.image) {
    try {
      const { dataUrl, ratio } = await loadImageAsJpeg(data.image.url)
      const imgH = Math.min(CONTENT_W * ratio, 100)
      const imgW = imgH / ratio
      doc.setFillColor(...CARD)
      doc.roundedRect(MARGIN, y, CONTENT_W, imgH + 8, 4, 4, 'F')
      doc.addImage(dataUrl, 'JPEG', MARGIN + (CONTENT_W - imgW) / 2, y + 4, imgW, imgH)
      y += imgH + 8
      if (data.image.isPreview) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...MUTED)
        doc.text('KI-Bild · nur Vorschau', MARGIN, y + 4)
        y += 4
      }
    } catch {
      // Bild nicht ladbar: PDF trotzdem ohne Bild erzeugen.
    }
  }
  y += 8

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const sectionHeading = (title: string) => {
    ensureSpace(12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    doc.text(title.toUpperCase(), MARGIN, y)
    y += 3
  }

  const partRow = (row: PdfPartRow) => {
    const rowH = row.detail || row.weight !== undefined ? 14 : 10
    ensureSpace(rowH)
    const top = y

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MUTED)
    doc.text(pdfText(row.label.toUpperCase()), MARGIN, top + 4)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...(row.url ? ACCENT : DARK))
    const name = pdfText(row.name)
    doc.text(name, MARGIN, top + 8.5)
    if (row.url) {
      const nameW = doc.getTextWidth(name)
      doc.setDrawColor(...ACCENT)
      doc.setLineWidth(0.2)
      doc.line(MARGIN, top + 9.3, MARGIN + nameW, top + 9.3)
    }

    if (row.detail) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...MUTED)
      doc.text(pdfText(row.detail), MARGIN, top + 12.5, { maxWidth: CONTENT_W - 40 })
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    if (row.price !== undefined) doc.text(pdfText(formatPrice(row.price)), PAGE_W - MARGIN, top + 8.5, { align: 'right' })
    if (row.weight !== undefined) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...MUTED)
      doc.text(pdfText(formatWeight(row.weight)), PAGE_W - MARGIN, top + 12.5, { align: 'right' })
    }

    // Ganze Zeile klickbar
    if (row.url) doc.link(MARGIN, top, CONTENT_W, rowH, { url: row.url })

    y = top + rowH + 1.5
    doc.setDrawColor(...LINE)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  }

  sectionHeading('Teileliste')
  data.parts.forEach(partRow)

  if (data.standardParts.length > 0) {
    y += 6
    sectionHeading('Immer dabei')
    data.standardParts.forEach(partRow)
  }

  // Summen
  ensureSpace(30)
  y += 9
  const totalRow = (label: string, value: string, color = DARK) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...DARK)
    doc.text(label, MARGIN, y)
    doc.setTextColor(...color)
    doc.text(pdfText(value), PAGE_W - MARGIN, y, { align: 'right' })
    y += 7
  }
  const overBudget = data.totalPrice > data.budget
  totalRow('Gesamtpreis', formatPrice(data.totalPrice), overBudget ? ACCENT : DARK)
  totalRow(
    'Gesamtgewicht (geschätzt)',
    data.totalWeight > 0 ? `${data.weightIncomplete ? 'mind. ' : ''}${formatWeight(data.totalWeight)}` : '—',
  )
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...MUTED)
  doc.text(
    pdfText(
      overBudget
        ? `${formatPrice(data.totalPrice - data.budget)} über deinem Budget von ${formatPrice(data.budget)}`
        : `${formatPrice(data.budget - data.totalPrice)} unter deinem Budget von ${formatPrice(data.budget)}`,
    ),
    MARGIN,
    y,
  )

  // Fußzeile auf jeder Seite
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(
      'Preise und Gewichte laut Händlerangaben, ohne Gewähr. Gewicht ist eine Schätzung. Links führen zum Händler (Affiliate-Links).',
      MARGIN,
      PAGE_H - 10,
      { maxWidth: CONTENT_W - 15 },
    )
    doc.text(`${i} / ${pages}`, PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' })
  }

  const slug = (data.bikeTypeName ?? 'bike').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  doc.save(`pelaro-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
