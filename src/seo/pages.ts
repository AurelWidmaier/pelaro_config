import { TUTORIAL, type TutorialGroup } from '../content/tutorial.ts'

/**
 * Titel und Beschreibungen aller öffentlichen Seiten. Wird in der App (Seo-Komponente)
 * und beim Build (vite.config.ts: HTML pro Seite, sitemap.xml) verwendet – deshalb
 * hier nur reine Daten, keine Browser- oder React-Importe.
 */
export const SITE_NAME = 'Pelaro'

export interface PageMeta {
  path: string
  title: string
  description: string
}

export function tutorialGroupPath(group: TutorialGroup): string {
  return `/tutorial/${group.id}`
}

export const PAGES = {
  home: {
    path: '/',
    title: 'Pelaro – Rennrad & Gravelbike selbst konfigurieren',
    description:
      'Stell dir dein Rennrad oder Gravelbike Schritt für Schritt zusammen – passend zu deinem Budget, verständlich erklärt, mit Teileliste und Aufbau-Anleitung.',
  },
  tutorial: {
    path: '/tutorial',
    title: 'Fahrrad-Tutorials: Rennrad & Gravelbike aufbauen und warten | Pelaro',
    description:
      'Schritt-für-Schritt-Anleitungen für Einsteiger: Bike aufbauen, Schaltung einstellen, Bremsen entlüften, Reifen wechseln, Drehmoment-Tabelle und Wartungs-Checkliste.',
  },
  shop: {
    path: '/shop',
    title: 'Fahrradwerkzeug für den Aufbau | Pelaro Shop',
    description:
      'Das passende Werkzeug für Aufbau und Wartung deines Rennrads oder Gravelbikes – ausgesucht passend zu den Teilen im Pelaro-Konfigurator.',
  },
  configurator: {
    path: '/konfigurator',
    title: 'Bike-Konfigurator: Rennrad & Gravelbike zusammenstellen | Pelaro',
    description:
      'Rahmen, Schaltung, Laufräder und Cockpit auswählen und sehen, wie dein Bike aussieht – mit Gesamtpreis, Gewicht, Teileliste und Werkzeugliste.',
  },
} satisfies Record<string, PageMeta>

export function tutorialGroupMeta(group: TutorialGroup): PageMeta {
  return {
    path: tutorialGroupPath(group),
    title: `${group.heading} – Anleitung | ${SITE_NAME}`,
    description: group.description,
  }
}

/** Alle Seiten, die in die Sitemap gehören. */
export function allPages(): PageMeta[] {
  return [
    PAGES.home,
    PAGES.configurator,
    PAGES.tutorial,
    ...TUTORIAL.map(tutorialGroupMeta),
    PAGES.shop,
  ]
}
