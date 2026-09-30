import type { Tool, ToolList } from '../config/tools'
import { formatPrice } from './format'

// Theme-Farben aus styles/variables.css (wie exportPdf.ts)
const DARK: [number, number, number] = [36, 72, 85]
const ACCENT: [number, number, number] = [230, 72, 51]
const MUTED: [number, number, number] = [91, 116, 128]
const CARD: [number, number, number] = [238, 243, 242]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 16
const CONTENT_W = PAGE_W - 2 * MARGIN

const pdfText = (text: string) => text.replace(/[  ]/g, ' ')

export interface ToolsPdfData {
  bikeName: string
  list: ToolList
}

/** Werkzeugliste als PDF – Spezialwerkzeug zuerst, dann allgemeines Werkzeug. */
export async function exportToolsPdf({ bikeName, list }: ToolsPdfData): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

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
  doc.text('Werkzeugliste', MARGIN, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  doc.text(pdfText(`für dein ${bikeName}`), MARGIN, y)
  y += 10

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN - 10) {
      doc.addPage()
      y = MARGIN
    }
  }

  const heading = (title: string, sub: string) => {
    ensureSpace(16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...ACCENT)
    doc.text(title.toUpperCase(), MARGIN, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    doc.text(pdfText(sub), MARGIN, y)
    y += 5
  }

  const row = (tool: Tool, note?: string) => {
    const descLines = doc.splitTextToSize(pdfText(note ? `${note} ${tool.description}` : tool.description), CONTENT_W - 18)
    const variantParts = [tool.variant ? `Version: ${tool.variant}` : '', tool.price !== undefined ? formatPrice(tool.price) : '']
      .filter(Boolean)
      .join(' · ')
    const variantLines = variantParts ? doc.splitTextToSize(pdfText(variantParts), CONTENT_W - 18) : []
    const h = 8 + (descLines.length + variantLines.length) * 4.2
    ensureSpace(h + 2)
    doc.setFillColor(...CARD)
    doc.roundedRect(MARGIN, y, CONTENT_W, h, 2.5, 2.5, 'F')
    // Checkbox zum Abhaken
    doc.setDrawColor(...DARK)
    doc.setLineWidth(0.4)
    doc.roundedRect(MARGIN + 4, y + 3.5, 4, 4, 0.8, 0.8, 'S')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...DARK)
    const name = pdfText(tool.name + (tool.essential ? '' : ' (empfohlen)'))
    if (tool.url) doc.textWithLink(name, MARGIN + 12, y + 6.8, { url: tool.url })
    else doc.text(name, MARGIN + 12, y + 6.8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.text(descLines, MARGIN + 12, y + 11)
    if (variantLines.length > 0) {
      doc.setTextColor(...DARK)
      doc.text(variantLines, MARGIN + 12, y + 11 + descLines.length * 4.2)
    }
    y += h + 2
  }

  if (list.specific.length > 0) {
    heading('Speziell für dein Bike', 'Diese Werkzeuge hängen von Rahmen und Schaltgruppe ab.')
    list.specific.forEach(({ tool, reason }) => row(tool, reason))
    y += 4
  }
  heading('Allgemeines Werkzeug', 'Brauchst du für jeden Aufbau.')
  list.general.forEach((tool) => row(tool))

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(
      'Werkzeugliste ohne Gewähr. Anzugsmomente immer nach Herstellerangabe. Links führen zum Händler (Affiliate-Links).',
      MARGIN,
      PAGE_H - 10,
      { maxWidth: CONTENT_W - 15 },
    )
    doc.text(`${i} / ${pages}`, PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' })
  }

  doc.save(`pelaro-werkzeugliste-${new Date().toISOString().slice(0, 10)}.pdf`)
}
