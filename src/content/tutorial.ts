/**
 * Inhalte der Tutorials. Jedes Überthema (Gruppe) hat eine eigene Seite,
 * jeder Abschnitt darin ist ein aufklappbares Dropdown.
 * Text darf **fett** enthalten. Blöcke werden in TutorialSection gerendert.
 */
export type TutorialBlock =
  | { type: 'p'; text: string }
  | { type: 'steps'; title?: string; items: string[] }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'tip'; text: string }
  | { type: 'warning'; text: string }
  | { type: 'table'; title?: string; head: string[]; rows: string[][]; note?: string }
  | { type: 'checklist'; title: string; items: string[] }
  | { type: 'terms'; items: [string, string][] }

export interface TutorialSection {
  id: string
  title: string
  /** Ein Satz: worum geht es, wann brauche ich das? */
  summary: string
  level: 'Einsteiger' | 'Fortgeschritten' | 'Nachschlagen'
  /** Grobe Dauer beim ersten Mal */
  time?: string
  blocks: TutorialBlock[]
}

/** Ein Überthema – bekommt eine eigene Seite unter /tutorial/<id>. */
export interface TutorialGroup {
  /** Teil der URL – nicht mehr ändern, sobald die Seite bei Google ist */
  id: string
  /** Kurzer Name für Navigation und Übersicht */
  title: string
  /** Überschrift (h1) und Seitentitel der Themenseite */
  heading: string
  /** Meta-Description und Text der Karte in der Übersicht (ca. 120–160 Zeichen) */
  description: string
  /** Einleitung oben auf der Themenseite */
  intro: string
  sections: TutorialSection[]
}

export const TUTORIAL: TutorialGroup[] = [
  {
    id: 'grundlagen',
    title: 'Grundlagen',
    heading: 'Grundlagen: Werkzeug, Sicherheit & Antrieb verstehen',
    description:
      'Welches Fahrradwerkzeug du wirklich brauchst, die wichtigsten Sicherheitsregeln und wie der Antrieb am Rennrad und Gravelbike funktioniert.',
    intro:
      'Bevor du schraubst: Hier lernst du, welches Werkzeug du für Aufbau und Wartung brauchst, worauf es bei Carbon und Drehmomenten ankommt und wie Kette, Kassette, Kurbel und Schaltung zusammenspielen. Ideal als Einstieg, wenn du dein erstes Bike selbst aufbaust.',
    sections: [
      {
        id: 'start',
        title: 'Bevor du loslegst: Werkzeug & Sicherheit',
        summary: 'Welches Werkzeug du wirklich brauchst und die fünf Regeln, die dein Bike (und dich) heil lassen.',
        level: 'Einsteiger',
        time: '5 Min. lesen',
        blocks: [
          {
            type: 'p',
            text: 'Du musst kein Mechaniker sein, um dein Rad selbst aufzubauen oder zu warten. Wichtig sind drei Dinge: **das richtige Werkzeug**, **Geduld** und das Wissen, **wie fest** eine Schraube angezogen werden darf. Nimm dir beim ersten Mal lieber doppelt so viel Zeit – ein Rad, das in Ruhe aufgebaut wurde, fährt besser und sicherer.',
          },
          {
            type: 'list',
            title: 'Grundausstattung – damit erledigst du 90 % aller Arbeiten',
            items: [
              '**Innensechskant (Inbus) 2–8 mm** – am häufigsten brauchst du 4, 5 und 6 mm',
              '**Torx T25** – für manche Bremsen, Kurbeln und Bremsscheiben',
              '**Drehmomentschlüssel** – bei Carbon Pflicht, siehe unten',
              '**Kettenwerkzeug + Kettenschloss-Zange** – zum Kürzen, Öffnen und Schließen der Kette',
              '**Kassetten-Abzieher + Kettenpeitsche** – für Kassette und Center-Lock-Bremsscheiben',
              '**Reifenheber** und eine **Standpumpe mit Manometer**',
              '**Montagefett** (für Gewinde) und **Carbon-Montagepaste** (für Carbon-Klemmungen)',
              '**Kettenöl** und Lappen',
            ],
          },
          {
            type: 'list',
            title: 'Für den kompletten Aufbau zusätzlich',
            items: [
              '**Innenlager-Werkzeug** passend zu deinem Rahmen (BSA, T47 …)',
              '**Carbon-Säge mit Sägeführung** zum Kürzen des Gabelschafts',
              '**Bremsleitungs-Schneider + Einpresswerkzeug** und ein **Entlüftungs-Kit mit Mineralöl**',
              '**Magnet-Set** zum Einfädeln innenverlegter Leitungen',
              '**Montageständer** – kein Muss, macht aber fast jede Arbeit deutlich angenehmer',
            ],
          },
          {
            type: 'tip',
            text: 'Welche Werkzeuge genau zu deinem Bike passen, zeigt dir die **Werkzeugliste in deinem Konfigurations-Ergebnis** – inklusive der richtigen Version beim Händler. Alles gesammelt findest du im **Shop unter „Werkzeug“**.',
          },
          {
            type: 'steps',
            title: 'Die fünf Sicherheitsregeln',
            items: [
              '**Drehmoment ist Pflicht bei Carbon.** Lenker, Vorbau, Sattelstütze und Gabelschaft reißen, wenn du „nach Gefühl“ zu fest anziehst. Der Wert steht meist direkt am Bauteil (z. B. „5 Nm max“) – dieser Wert gilt immer vor allgemeinen Tabellen.',
              '**Carbon bekommt Montagepaste, kein Fett.** Die Paste sorgt für Reibung, sodass nichts rutscht, obwohl du nur mit wenig Drehmoment anziehst.',
              '**Bremsen vor jeder Fahrt testen** – und nach jeder Arbeit an der Bremse erst im Stand: Hebel ziehen, Rad schieben, es muss sofort blockieren.',
              '**Schaltung nur testen, wenn das Rad sicher steht** – im Montageständer oder kopfüber auf Sattel und Lenker. Nie im Fahren „mal schauen“.',
              '**Kein Öl oder Fett auf Bremsscheiben und Belägen.** Schon Fingerabdrücke können Bremskraft kosten. Scheiben nur mit Bremsenreiniger (ölfrei) oder Isopropanol säubern.',
            ],
          },
          {
            type: 'warning',
            text: 'Wenn du dir bei einem sicherheitsrelevanten Teil (Bremsen, Gabelschaft, Steuersatz, Vorbau) unsicher bist: lieber eine Werkstatt drüberschauen lassen. Das kostet wenig und gibt dir Sicherheit.',
          },
        ],
      },
      {
        id: 'antrieb-verstehen',
        title: 'So funktioniert der Antrieb',
        summary: 'Kurbel, Kette, Kassette, Schaltwerk – was ist was, und was bedeuten Angaben wie „2x12“ oder „50/34“?',
        level: 'Einsteiger',
        time: '5 Min. lesen',
        blocks: [
          {
            type: 'p',
            text: 'Der Antrieb überträgt deine Kraft vom Pedal auf das Hinterrad. Die Teile hängen voneinander ab – wer sie versteht, versteht auch, warum etwas nicht passt.',
          },
          {
            type: 'list',
            title: 'Die Bauteile von vorne nach hinten',
            items: [
              '**Kurbel mit Kettenblatt/Kettenblättern** – hier trittst du rein. 1 Kettenblatt = „1x“ (typisch Gravel), 2 Kettenblätter = „2x“ (typisch Rennrad).',
              '**Kette** – verbindet vorne und hinten.',
              '**Kassette** – das Ritzelpaket am Hinterrad. Mehr Ritzel = feinere Gangsprünge.',
              '**Schaltwerk** – bewegt die Kette hinten von Ritzel zu Ritzel.',
              '**Umwerfer** (nur bei 2x) – wechselt vorne zwischen den Kettenblättern.',
              '**Schalthebel** – steuern beides, per Seilzug (mechanisch) oder Funk/Kabel (elektronisch).',
            ],
          },
          {
            type: 'table',
            title: 'Angaben richtig lesen',
            head: ['Angabe', 'Bedeutung', 'Beispiel'],
            rows: [
              ['2x12', '2 Kettenblätter × 12 Ritzel', 'LTWOO ER7'],
              ['1x12', '1 Kettenblatt × 12 Ritzel', 'LTWOO GRT12'],
              ['50/34', 'Kettenblätter mit 50 und 34 Zähnen', 'Rennrad-Kurbel'],
              ['11–32T', 'kleinstes Ritzel 11, größtes 32 Zähne', 'Rennrad-Kassette'],
            ],
          },
          {
            type: 'p',
            text: '**Faustregel für die Übersetzung:** Kleines Kettenblatt vorne + großes Ritzel hinten = leichter Berggang. Großes Kettenblatt + kleines Ritzel = schneller Gang für die Ebene.',
          },
          {
            type: 'list',
            title: 'So findest du heraus, was du hast',
            items: [
              '**Kettenblätter:** Die Zähnezahl ist meist eingeprägt, sonst zählen.',
              '**Kassette:** kleinstes und größtes Ritzel zählen – oft steht es auch auf der Verpackung („11-32T“).',
              '**Fach-Anzahl (z. B. 11- oder 12-fach):** Ritzel an der Kassette zählen.',
              '**Freilauf:** bestimmt, welche Kassette auf dein Laufrad passt – siehe Abschnitt „Kassette & Freilauf“.',
            ],
          },
          {
            type: 'warning',
            text: 'Kette, Kassette, Schaltwerk und Schalthebel müssen die **gleiche Fach-Anzahl** haben. Eine 11-fach-Kette auf einer 12-fach-Kassette schaltet nicht sauber. Im Konfigurator ist das bereits abgestimmt – wichtig wird es, wenn du später einzelne Teile tauschst.',
          },
        ],
      },
    ],
  },
  {
    id: 'fahrrad-aufbauen',
    title: 'Dein Bike aufbauen',
    heading: 'Rennrad & Gravelbike selbst aufbauen',
    description:
      'Rennrad oder Gravelbike selbst aufbauen: Reihenfolge vom Rahmen zum fertigen Rad, innenverlegte Leitungen einfädeln, Carbon-Gabelschaft und Bremsleitungen kürzen.',
    intro:
      'Vom nackten Rahmen zum fahrbereiten Rad: die richtige Reihenfolge beim Aufbau, das Einfädeln innenverlegter Leitungen in voll integrierte Rahmen, das Kürzen des Carbon-Gabelschafts und der hydraulischen Bremsleitungen – Schritt für Schritt und einsteigerfreundlich erklärt.',
    sections: [
      {
        id: 'aufbau-reihenfolge',
        title: 'Der komplette Aufbau – Schritt für Schritt',
        summary: 'In welcher Reihenfolge du dein Bike aus Rahmen und Teilen zusammensetzt – mit Verweisen auf die Detail-Anleitungen.',
        level: 'Einsteiger',
        time: '1–2 Tage beim ersten Mal',
        blocks: [
          {
            type: 'p',
            text: 'Die Reihenfolge ist wichtig: Manche Arbeiten gehen nur, solange andere Teile noch nicht montiert sind (z. B. Leitungen durch den Rahmen fädeln, bevor das Innenlager drin ist). Arbeite die Liste von oben nach unten ab und hake ab, was erledigt ist.',
          },
          {
            type: 'steps',
            items: [
              '**Auspacken und prüfen:** Alle Teile auslegen, mit Bestellung vergleichen. Rahmen und Gabel auf Transportschäden (Risse, tiefe Kratzer) untersuchen. Fotos machen, falls etwas fehlt.',
              '**Rahmen in den Montageständer:** An der Sattelstütze einspannen – niemals am Carbon-Rahmenrohr selbst.',
              '**Leitungen und Züge durch den Rahmen fädeln**, solange noch nichts im Weg ist (Abschnitt „Innenverlegte Leitungen“).',
              '**Innenlager einschrauben** (Abschnitt „Tretlager“).',
              '**Gabel mit Steuersatz einsetzen**, Vorbau und Lenker provisorisch montieren, Gabelschaft anzeichnen und **kürzen** (Abschnitt „Gabelschaft kürzen“).',
              '**Cockpit final montieren:** Steuersatzspiel einstellen, Vorbau ausrichten, Lenker mit Drehmoment festziehen (Abschnitte „Steuersatz“ und „Cockpit“).',
              '**Schalt-/Bremshebel** am Lenker positionieren, noch ohne Lenkerband.',
              '**Kurbel montieren** (Abschnitt „Kurbel & Umwerfer“).',
              '**Schaltwerk und ggf. Umwerfer** montieren.',
              '**Bremssättel** an Rahmen und Gabel schrauben, **Bremsleitungen kürzen** und anschließen, **entlüften** (Abschnitte „Bremsleitungen kürzen“ und „Bremsen entlüften“).',
              '**Laufräder vorbereiten:** Bremsscheiben und Kassette montieren, Schläuche und Reifen aufziehen (Abschnitte „Kassette“ und „Reifen & Schlauch“).',
              '**Laufräder einbauen**, Bremssättel zur Scheibe ausrichten.',
              '**Kette auflegen, kürzen, schließen** (Abschnitt „Kette“).',
              '**Schaltung einstellen** – mechanisch oder elektronisch (Abschnitte „Schaltwerk“ bzw. „LTWOO ER7“).',
              '**Sattelstütze und Sattel** montieren, Sitzhöhe grob einstellen, **Pedale** einschrauben.',
              '**Lenkerband wickeln** – erst ganz zum Schluss, wenn Hebel und Leitungen final sitzen.',
              '**Alle Schrauben mit Drehmomentschlüssel prüfen** (Abschnitt „Drehmoment-Tabelle“).',
              '**Probefahrt** zuerst auf einem ruhigen Platz: Bremsen, Schalten, Knackgeräusche. Nach 50–100 km alles noch einmal nachprüfen – Züge setzen sich, Schrauben ebenfalls.',
            ],
          },
          {
            type: 'tip',
            text: 'Lege dir für jede Baugruppe eine kleine Schale für Schrauben und Kleinteile an und mach vor jedem Zerlegen ein Handyfoto. Das erspart später viel Rätselraten.',
          },
        ],
      },
      {
        id: 'innenverlegung',
        title: 'Innenverlegte Leitungen & Züge einfädeln',
        summary: 'Bei voll integrierten Rahmen laufen alle Leitungen innen – so bekommst du sie ohne Frust durch.',
        level: 'Fortgeschritten',
        time: '30–60 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Moderne Rahmen wie BXT Pro-145, BXT Gravel-135 oder Spcycle R088 verlegen Brems- und Schaltleitungen komplett innen, teils durch Lenker, Vorbau und Steuersatz. Das sieht sauber aus, braucht beim Aufbau aber etwas Geduld.',
          },
          {
            type: 'steps',
            items: [
              '**Plan machen:** Welche Leitung läuft wohin? Hinterradbremse und Schaltwerk nach hinten, Vorderradbremse durch die Gabel. Bei integrierten Cockpits geht alles zuerst durch Lenker und Vorbau, dann durch den Steuersatz in den Rahmen.',
              '**Führungsleitung verwenden:** Aus dem Magnet-Set den dünnen Führungsschlauch bzw. -draht zuerst von der Austrittsöffnung zum Eingang schieben.',
              '**Mit dem Magneten „angeln“:** Den Magneten außen am Rahmen entlangführen, um das Metallende innen zur Öffnung zu ziehen.',
              '**Leitung nachziehen:** Bremsleitung oder Zughülle auf die Führung stecken und vorsichtig durchziehen – nicht mit Gewalt, sonst knickt sie.',
              '**Länge großzügig lassen:** Bremsleitungen erst kürzen, wenn Lenker und Hebel final sitzen (nach dem Einlenken nach links und rechts prüfen!).',
              '**Enden schützen:** Offene Leitungsenden mit Klebeband verschließen, damit kein Schmutz hineinkommt.',
            ],
          },
          {
            type: 'tip',
            text: 'Bei der elektronischen LTWOO ER7 fädelst du statt Schaltzügen die dünnen Kabel vom Akku in der Sattelstütze zu Schaltwerk und Umwerfer. Die Stecker sind empfindlich – nie am Kabel ziehen, sondern immer am Stecker.',
          },
        ],
      },
      {
        id: 'gabelschaft',
        title: 'Carbon-Gabelschaft kürzen',
        summary: 'Neue Gabeln haben einen zu langen Schaft. So kürzt du ihn gerade und ohne Risiko.',
        level: 'Fortgeschritten',
        time: '30 Min.',
        blocks: [
          {
            type: 'warning',
            text: '**Einmal zu kurz ist für immer zu kurz.** Miss zweimal, säge einmal. Lass lieber 1–2 Spacer zu viel über dem Vorbau – die kannst du nach ein paar Ausfahrten immer noch entfernen und nachkürzen.',
          },
          {
            type: 'steps',
            items: [
              '**Gabel, Steuersatz, Spacer und Vorbau provisorisch montieren** und die gewünschte Lenkerhöhe festlegen.',
              '**Oberkante des Vorbaus** auf dem Gabelschaft mit einem Stift markieren.',
              '**Schnittlinie festlegen:** 3 mm **unter** dieser Markierung – der Schaft muss etwas unter der Vorbau-Oberkante enden, damit die Deckelkappe das Lager vorspannen kann.',
              '**Gabel ausbauen** und den Schaft in die **Sägeführung** einspannen, Schnittlinie genau am Sägeschlitz.',
              '**Mit der Bügelsäge langsam und ohne Druck sägen.** Carbon-Staub nicht einatmen – Maske tragen, Staub feucht aufwischen.',
              '**Schnittkante mit feinem Schleifpapier entgraten**, damit keine Fasern ausfransen.',
              '**Expander (Kralle für Carbon) einsetzen** und nach Herstellerangabe festziehen – niemals eine Sternmutter in einen Carbon-Schaft schlagen.',
            ],
          },
          {
            type: 'tip',
            text: 'Carbon-Montagepaste auf den Schaft, wo der Vorbau klemmt. So hält der Vorbau schon bei 5 Nm sicher.',
          },
        ],
      },
      {
        id: 'bremsleitung-kuerzen',
        title: 'Hydraulische Bremsleitungen kürzen',
        summary: 'Neue Bremsen haben zu lange Leitungen. So kürzt du sie und schließt sie dicht an.',
        level: 'Fortgeschritten',
        time: '20 Min. pro Bremse',
        blocks: [
          {
            type: 'steps',
            items: [
              '**Länge bestimmen:** Lenker komplett nach links und rechts einschlagen – die Leitung darf nirgends spannen oder abknicken. Stelle markieren.',
              '**Leitung am Bremshebel lösen** (Überwurfmutter aufdrehen) – etwas Mineralöl tritt aus, Lappen unterlegen.',
              '**Mit dem Leitungsschneider gerade abschneiden.** Eine schräge oder gequetschte Schnittkante wird undicht.',
              '**Überwurfmutter und neue Olive** (kleiner Messingring) auf die Leitung schieben.',
              '**Stützhülse (Nadel) mit dem Einpresswerkzeug** ins Leitungsende drücken, bis sie bündig sitzt.',
              '**Leitung bis zum Anschlag in den Bremshebel stecken** und die Überwurfmutter festziehen (meist 5–7 Nm).',
              '**Entlüften** – nach dem Kürzen ist fast immer etwas Luft im System (nächster Abschnitt).',
            ],
          },
          {
            type: 'warning',
            text: 'Olive und Stützhülse sind **Einwegteile**. Nach jedem Kürzen neue verwenden – die alten dichten nicht mehr zuverlässig.',
          },
        ],
      },
    ],
  },
  {
    id: 'antrieb-schaltung',
    title: 'Antrieb & Schaltung',
    heading: 'Antrieb & Schaltung einstellen',
    description:
      'Kette kürzen und pflegen, Kassette wechseln, Schaltwerk einstellen, LTWOO R9, GRT12 und ER7 einrichten, Kurbel und Tretlager montieren – Anleitungen für Rennrad und Gravelbike.',
    intro:
      'Alles rund um den Antrieb: Kette prüfen, kürzen und schließen, Kassette und Freilauf, Schaltwerk und Schalthebel einstellen – mechanisch (LTWOO R9 & GRT12) und elektronisch (LTWOO ER7) – sowie Kurbel, Kettenblätter, Umwerfer und Tretlager.',
    sections: [
      {
        id: 'kette',
        title: 'Kette: prüfen, kürzen, schließen, pflegen',
        summary: 'Die Kette ist das Verschleißteil Nr. 1. Wer sie pflegt und rechtzeitig tauscht, spart Kassette und Kettenblätter.',
        level: 'Einsteiger',
        time: '15–30 Min.',
        blocks: [
          {
            type: 'p',
            text: '**Verschleiß prüfen:** Eine Kette „längt“ sich mit der Zeit. Mit einer Kettenlehre misst du das in Sekunden. Bei **11- und 12-fach-Ketten ab 0,5 %** tauschen, bei älteren 8–10-fach ab 0,75 %. Wer zu lange wartet, muss oft auch Kassette und Kettenblätter mittauschen.',
          },
          {
            type: 'steps',
            title: 'Neue Kette auf die richtige Länge bringen',
            items: [
              '**Kette ohne Schaltwerk** über das **größte Kettenblatt und das größte Ritzel** legen.',
              '**Enden zusammenführen** und so kürzen, dass sich die Enden mit **2 zusätzlichen Gliedern** (= 1 Zoll) schließen lassen. Das ist die Standard-Methode für Rennrad und 2x.',
              '**Bei 1x-Gravelgruppen (GRT12)** gibt der Hersteller oft eigene Angaben – im Zweifel die Anleitung des Schaltwerks verwenden.',
              '**Mit dem Kettenwerkzeug** den Stift an der gewünschten Stelle vollständig herausdrücken.',
              '**Mit dem Kettenschloss verbinden:** beide Hälften einsetzen, dann das Rad blockieren und kräftig in die Pedale treten, bis das Schloss hörbar einrastet – oder die Kettenschloss-Zange zum Schließen nutzen.',
            ],
          },
          {
            type: 'tip',
            text: 'Laufrichtung beachten: Viele Ketten haben eine beschriftete Seite, die nach außen zeigen muss. Kettenschlösser immer passend zur Fach-Anzahl verwenden – ein 11-fach-Schloss passt nicht auf eine 12-fach-Kette.',
          },
          {
            type: 'list',
            title: 'Reinigen & ölen',
            items: [
              '**Nach Regen- oder Schotterfahrten** mit einem Lappen abwischen, bei starkem Schmutz Kettenreiniger und Bürste.',
              '**Danach immer ölen:** auf jedes Glied einen kleinen Tropfen, kurz einwirken lassen, dann **Überschuss abwischen** – außen soll die Kette fast trocken wirken, sonst zieht sie Dreck an.',
              '**Trockenlube** für staubige Sommertage, **Nasslube** für Regen und Winter.',
              '**Faustregel:** alle 200–300 km ölen, nach Regenfahrten sofort.',
            ],
          },
        ],
      },
      {
        id: 'kassette',
        title: 'Kassette & Freilauf',
        summary: 'Welche Kassette passt auf welches Laufrad – und wie du sie montierst oder tauschst.',
        level: 'Einsteiger',
        time: '15 Min.',
        blocks: [
          {
            type: 'table',
            title: 'Freilauf-Typen erkennen',
            head: ['Typ', 'So erkennst du ihn', 'Typisch bei'],
            rows: [
              ['Shimano HG', 'lange, gerade Keilverzahnung – der Standard', 'Shimano, LTWOO, ZRACE, SRAM bis 11-fach'],
              ['Shimano Micro Spline', 'viele feine Zähne, kürzer', 'Shimano MTB 12-fach'],
              ['SRAM XD/XDR', 'Gewinde am Ende, kaum Verzahnung', 'SRAM 12-fach, 10er-Ritzel'],
            ],
            note: 'Alle Gruppen im Konfigurator (ER7, R9, GRT12) nutzen **Shimano HG**. Beim Laufrad deshalb immer die HG-Version wählen – der Konfigurator stellt das automatisch ein.',
          },
          {
            type: 'steps',
            title: 'Kassette montieren',
            items: [
              '**Freilauf leicht fetten** (dünn), damit die Kassette später wieder leicht abgeht.',
              '**Kassette aufschieben:** Eine Nut ist breiter als die anderen – die Kassette passt nur in einer Stellung. Bei Rennrad-HG-Freiläufen und MTB-Kassetten (z. B. 11–50T der GRT12) kann ein **1,85-mm-Spacer** hinter die Kassette nötig sein, sonst sitzt sie lose.',
              '**Verschlussring (Lockring)** von Hand eindrehen.',
              '**Mit Kassetten-Werkzeug und Drehmomentschlüssel** auf 40 Nm anziehen.',
            ],
          },
          {
            type: 'steps',
            title: 'Kassette abnehmen',
            items: [
              '**Laufrad ausbauen.**',
              '**Kettenpeitsche** um ein großes Ritzel legen und festhalten.',
              '**Kassetten-Werkzeug** in den Lockring setzen und **gegen den Uhrzeigersinn** lösen – die Kettenpeitsche hält dagegen.',
              '**Ritzel abziehen** und die Reihenfolge der Distanzringe merken (Foto!).',
            ],
          },
          {
            type: 'p',
            text: '**Verschleiß erkennen:** Zähne sehen „haifischflossenartig“ aus, und eine **neue** Kette springt unter Last. Dann Kassette und Kette gemeinsam tauschen.',
          },
        ],
      },
      {
        id: 'schaltwerk-allgemein',
        title: 'Schaltwerk verstehen (gilt für alle Marken)',
        summary: 'Die vier Stellschrauben am Schaltwerk – wer die kennt, kann jede mechanische Schaltung einstellen.',
        level: 'Einsteiger',
        time: '5 Min. lesen',
        blocks: [
          {
            type: 'p',
            text: 'Ob Shimano, SRAM oder LTWOO – das Prinzip ist gleich. Das Schaltwerk hat vier Stellmöglichkeiten. Die Reihenfolge beim Einstellen ist immer: **erst Anschläge, dann Abstand, dann Zugspannung**.',
          },
          {
            type: 'terms',
            items: [
              ['H-Schraube (High)', 'Begrenzt, wie weit das Schaltwerk nach außen fährt – verhindert, dass die Kette vom kleinsten Ritzel in den Rahmen fällt.'],
              ['L-Schraube (Low)', 'Begrenzt, wie weit das Schaltwerk nach innen fährt – verhindert, dass die Kette vom größten Ritzel in die Speichen fällt. **Sicherheitsrelevant!**'],
              ['B-Schraube', 'Stellt den Abstand zwischen oberem Schaltröllchen und größtem Ritzel ein. Zu nah = Rasseln, zu weit = träges Schalten.'],
              ['Zugspannung (Einstellrad)', 'Feinjustiert, wie genau jeder Klick einem Gang entspricht („Indexierung“). Sitzt meist am Schaltwerk oder als Inline-Einsteller in der Zughülle.'],
            ],
          },
          {
            type: 'p',
            text: '**Käfiglänge:** Kurze Käfige sind für Rennrad-Kassetten gedacht, lange für große Kassetten (z. B. 11–50T). Das Schaltwerk muss zur Kassette passen – bei den Gruppen im Konfigurator ist das bereits abgestimmt.',
          },
        ],
      },
      {
        id: 'schaltwerk-ltwoo',
        title: 'Mechanisches Schaltwerk einstellen (LTWOO R9 & GRT12)',
        summary: 'Schritt für Schritt vom lockeren Zug bis zur perfekt schaltenden Kette.',
        level: 'Fortgeschritten',
        time: '30–45 Min.',
        blocks: [
          {
            type: 'p',
            text: 'LTWOO-Schaltwerke sind Shimano-kompatibel gebaut – gleiche Zugverhältnisse, gleiche Kassetten. Die Anleitung funktioniert deshalb genauso für Shimano-Gruppen.',
          },
          {
            type: 'steps',
            title: '1. Montage',
            items: [
              '**Schaltauge prüfen:** Es muss exakt gerade stehen. Ein verbogenes Schaltauge macht jede Einstellung zunichte.',
              '**Schaltwerk anschrauben** (8–10 Nm).',
              '**Kette auflegen** und durch beide Schaltröllchen führen – die Kette darf nicht an der kleinen Metallzunge im Käfig hängen.',
            ],
          },
          {
            type: 'steps',
            title: '2. Anschläge einstellen (H und L) – noch ohne Zug',
            items: [
              'Kette auf das **kleinste Ritzel**. Von hinten schauen: Das obere Schaltröllchen muss **genau unter dem kleinsten Ritzel** stehen. Sonst **H-Schraube** drehen.',
              'Schaltwerk mit der Hand nach innen drücken und Kurbel drehen, bis die Kette auf dem **größten Ritzel** liegt. Das Röllchen muss **genau darunter** stehen, nicht weiter. Sonst **L-Schraube** drehen.',
            ],
          },
          {
            type: 'steps',
            title: '3. Abstand einstellen (B-Schraube)',
            items: [
              'Kette auf das **größte Ritzel**.',
              'B-Schraube drehen, bis zwischen oberem Röllchen und Ritzelzähnen **etwa 5–6 mm** Platz sind. Bei großen Gravel-Kassetten (GRT12, 50T) gibt LTWOO teils mehr Abstand vor – Beipackzettel beachten.',
            ],
          },
          {
            type: 'steps',
            title: '4. Zug einhängen und Schaltung feinjustieren',
            items: [
              'Schalthebel ganz auf den **kleinsten Gang** (kleinstes Ritzel) schalten, Kette liegt auf dem kleinsten Ritzel.',
              'Zug **straff ziehen** (nicht überspannen) und mit der Klemmschraube am Schaltwerk festziehen (ca. 5 Nm).',
              '**Einmal hochschalten.** Geht die Kette nicht aufs zweite Ritzel: Zugspannung **erhöhen** (Einstellrad gegen den Uhrzeigersinn).',
              '**Springt sie zu weit** oder rasselt nach innen: Zugspannung **verringern** (im Uhrzeigersinn).',
              'Alle Gänge rauf und runter schalten und in **Vierteldrehungen** nachjustieren, bis jeder Klick sauber sitzt.',
              '**Zugende** 2–3 cm überstehen lassen und eine Endkappe aufquetschen.',
            ],
          },
          {
            type: 'tip',
            text: 'Neue Züge „setzen sich“ in den ersten 20–30 km. Dann schaltet es plötzlich etwas schlechter – einfach mit dem Einstellrad eine Vierteldrehung nachspannen.',
          },
          {
            type: 'table',
            title: 'Wenn es nicht klappt',
            head: ['Problem', 'Ursache', 'Lösung'],
            rows: [
              ['Kette springt oder rasselt', 'Zugspannung falsch oder Kette/Kassette verschlissen', 'Indexierung nachstellen, Kette messen'],
              ['Größtes/kleinstes Ritzel wird nicht erreicht', 'Anschlag (H/L) zu eng', 'H- bzw. L-Schraube eine halbe Umdrehung öffnen'],
              ['Kette fällt in die Speichen', 'L-Anschlag zu weit offen', '**Sofort** L-Schraube eindrehen – Gefahr für Speichen und Schaltwerk'],
              ['Schalten schwammig', 'Zug oder Hülle verschmutzt/geknickt', 'Zug und Hülle tauschen'],
            ],
          },
        ],
      },
      {
        id: 'schalthebel-ltwoo',
        title: 'Schalthebel & Schaltzug (LTWOO R9 & GRT12)',
        summary: 'Neuen Schaltzug durch den Hebel fädeln und richtig verlegen.',
        level: 'Fortgeschritten',
        time: '20 Min.',
        blocks: [
          {
            type: 'p',
            text: 'LTWOO-Hebel ziehen den Zug genauso weit wie Shimano. Sie funktionieren deshalb mit Shimano-Schaltwerken gleicher Fach-Anzahl – aber **nicht mit SRAM**.',
          },
          {
            type: 'steps',
            items: [
              '**Hebel ganz auf den kleinsten Gang** schalten (mehrmals den kleinen Schaltpaddel drücken).',
              '**Griffgummi vorne hochklappen** – dort liegt die Einfädelöffnung für den Zug.',
              '**Neuen Zug mit dem Nippel voran einfädeln**, bis der Nippel im Hebel einrastet.',
              '**Zughülle auf Länge schneiden** – mit dem Seilzugschneider, damit die Hülle rund bleibt. Hüllenenden mit Endkappen versehen.',
              '**Zug durch Hülle und Rahmen** zum Schaltwerk führen und dort wie oben beschrieben einklemmen.',
              '**Griffgummi wieder zurückklappen.**',
            ],
          },
          {
            type: 'warning',
            text: 'Hüllen immer nur mit einem echten Zugschneider kürzen. Ein normaler Seitenschneider quetscht die Hülle – dann schaltet es hakelig, egal wie gut du einstellst.',
          },
        ],
      },
      {
        id: 'er7',
        title: 'Elektronische Schaltung: LTWOO ER7',
        summary: 'Akku laden, Hebel koppeln, Schaltung per App einstellen – ganz ohne Seilzug.',
        level: 'Einsteiger',
        time: '30 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Bei der ER7 gibt es keinen Schaltzug. Die **Schalthebel funken** ihre Befehle, **Schaltwerk und Umwerfer** bekommen Strom vom **Akku in der Sattelstütze**. Das Einstellen ist deutlich einfacher als bei mechanischen Gruppen.',
          },
          {
            type: 'steps',
            items: [
              '**Akku voll laden** – mit dem mitgelieferten Ladegerät bzw. Kabel laut Anleitung.',
              '**Akku in die Sattelstütze einsetzen** und mit Schaltwerk und Umwerfer verkabeln. Bei schmalen Stützen (z. B. Spcycle R088) sitzt der Akku mit der mitgelieferten Halterung als Verlängerung unten an der Stütze.',
              '**Schaltwerk und Umwerfer montieren** – die mechanischen Anschläge (H/L-Schrauben) und die B-Schraube stellst du genauso ein wie bei einer mechanischen Gruppe (Abschnitt „Mechanisches Schaltwerk“, Schritte 2 und 3).',
              '**Hebel mit dem System koppeln** – so wie in der Anleitung von LTWOO beschrieben.',
              '**LTWOO-App installieren** und verbinden. Dort stellst du die Feinjustage („Micro-Adjust“) ein: Statt am Einstellrad zu drehen, verschiebst du das Schaltwerk in kleinen Schritten, bis jeder Gang sauber läuft.',
              '**In der App die Fach-Anzahl prüfen** (12-fach) und bei Bedarf die Tastenbelegung anpassen.',
            ],
          },
          {
            type: 'tip',
            text: 'Lade den Akku vor langen Touren. Ist er leer, bleibt die Schaltung im letzten Gang stehen – du kommst aber noch nach Hause.',
          },
          {
            type: 'warning',
            text: 'Die genaue Tastenkombination zum Koppeln und für den Einstellmodus steht in der LTWOO-Anleitung zu deiner ER7-Version (V3). Halte dich daran – Firmware-Versionen unterscheiden sich.',
          },
        ],
      },
      {
        id: 'kurbel',
        title: 'Kurbel, Kettenblätter & Umwerfer',
        summary: 'Kurbel montieren, Kettenblätter wechseln und den Umwerfer bei 2-fach einstellen.',
        level: 'Fortgeschritten',
        time: '30–60 Min.',
        blocks: [
          {
            type: 'list',
            title: 'Die zwei Kurbel-Systeme im Konfigurator',
            items: [
              '**24-mm-Achse mit Einstellkappe (LTWOO ER7):** Die Achse hängt fest an der rechten Kurbel. Links wird der Kurbelarm aufgeschoben, das Lagerspiel mit der **Kunststoffkappe** eingestellt (nur handfest mit dem Kappenwerkzeug!) und dann die **zwei Klemmschrauben** abwechselnd angezogen (12–14 Nm).',
              '**DUB-Achse 29 mm (LTWOO R9 & GRT12):** Hier hält eine **große 8-mm-Schraube** den linken Arm – sie zieht die Kurbel beim Festziehen auf die Achse und beim Lösen wieder ab. Anzugsmoment laut Kurbel, meist 40–54 Nm.',
            ],
          },
          {
            type: 'steps',
            title: 'Kettenblätter wechseln',
            items: [
              '**Kurbel ausbauen** (siehe oben).',
              '**Kettenblattschrauben lösen** – bei Bedarf innen mit einem Konterwerkzeug festhalten.',
              '**Neue Kettenblätter ausrichten:** Beschriftung nach außen, ein kleiner Stift am großen Blatt zeigt meist zur Kurbel.',
              '**Schrauben über Kreuz** in mehreren Durchgängen anziehen (8–12 Nm).',
            ],
          },
          {
            type: 'steps',
            title: 'Umwerfer einstellen (nur 2-fach)',
            items: [
              '**Höhe:** Die Unterkante des Käfigs steht **1–2 mm** über den Zähnen des großen Kettenblatts.',
              '**Winkel:** Die Außenseite des Käfigs läuft **parallel** zum großen Kettenblatt.',
              '**Anschläge (H/L):** so einstellen, dass die Kette auf dem kleinen und großen Blatt nicht schleift und nicht herunterfällt.',
              '**Mechanisch (R9):** Zugspannung wie beim Schaltwerk. **Elektronisch (ER7):** Feinjustage in der App.',
            ],
          },
        ],
      },
      {
        id: 'tretlager',
        title: 'Tretlager (Innenlager)',
        summary: 'Welches Tretlager dein Rahmen hat, welches Werkzeug du brauchst und wie du es einbaust.',
        level: 'Fortgeschritten',
        time: '20 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Im Tretlager dreht sich die Kurbelachse. Es gibt **geschraubte** (Gewinde im Rahmen) und **eingepresste** Varianten. Alle Rahmen im Konfigurator haben ein **Gewinde** – das ist die einsteigerfreundlichere Variante.',
          },
          {
            type: 'table',
            head: ['Typ', 'Merkmal', 'Bei uns', 'Werkzeug'],
            rows: [
              ['BSA 68 mm', 'Gewinde, 68 mm breites Gehäuse', 'Spcycle R088, BXT Gravel-135', '44-16 (BSA-24) bzw. 46-24 (DUB)'],
              ['T47', 'Gewinde, größerer Durchmesser (47 mm)', 'BXT Pro-145', 'T47-Schlüssel passend zum Lager'],
              ['BB86/92, PF30, BB30', 'eingepresst, glatte Bohrung', '–', 'Aus-/Eintreiber'],
            ],
            note: 'Welcher Schlüssel genau zu deiner Kombination passt, steht in der Werkzeugliste deiner Konfiguration.',
          },
          {
            type: 'steps',
            title: 'Geschraubtes Tretlager einbauen',
            items: [
              '**Gewinde im Rahmen reinigen** und prüfen.',
              '**Gewinde der Lagerschalen dünn fetten.**',
              '**Die Seiten beachten:** Die rechte Schale (Antriebsseite) hat bei BSA ein **Linksgewinde** – sie wird **gegen** den Uhrzeigersinn festgezogen. Beschriftung „R“/„L“ beachten.',
              '**Beide Schalen von Hand** einschrauben, bis sie sauber greifen – nie schief ansetzen.',
              '**Mit Innenlager-Schlüssel und Drehmomentschlüssel** auf 35–45 Nm anziehen (Herstellerangabe beachten).',
            ],
          },
          {
            type: 'tip',
            text: 'Knacken beim Treten kommt oft **nicht** vom Tretlager. Prüfe vorher Pedale, Sattelstütze, Sattelgestell und Kurbelschrauben – das sind die häufigsten „Knack-Quellen“.',
          },
        ],
      },
    ],
  },
  {
    id: 'bremsen',
    title: 'Bremsen',
    heading: 'Scheibenbremsen warten & entlüften',
    description:
      'Hydraulische Scheibenbremsen am Rennrad und Gravelbike: Bremsbeläge wechseln, schleifende Bremse ausrichten, Quietschen beheben und mit Mineralöl entlüften.',
    intro:
      'Gut funktionierende Bremsen sind das Wichtigste an deinem Rad. Hier lernst du, wie du Bremsbeläge wechselst, eine schleifende Scheibenbremse ausrichtest, Quietschen loswirst und hydraulische Bremsen mit Mineralöl entlüftest.',
    sections: [
      {
        id: 'scheibenbremsen',
        title: 'Scheibenbremsen: Beläge, Ausrichten, Quietschen',
        summary: 'Beläge wechseln, schleifende Bremsen ausrichten und neue Bremsen richtig einbremsen.',
        level: 'Einsteiger',
        time: '15–30 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Alle Bikes im Konfigurator haben **hydraulische Scheibenbremsen mit Mineralöl**. Sie stellen sich selbst nach, brauchen wenig Handkraft und bremsen auch bei Nässe zuverlässig.',
          },
          {
            type: 'steps',
            title: 'Bremsbeläge wechseln',
            items: [
              '**Laufrad ausbauen.**',
              '**Sicherungsstift bzw. -clip** am Bremssattel entfernen und die alten Beläge herausziehen.',
              '**Kolben zurückdrücken** – mit einem Kunststoff-Reifenheber, vorsichtig und gleichmäßig. Nie mit Metall, sonst beschädigst du die Kolben.',
              '**Neue Beläge mit Spreizfeder** einsetzen und den Stift wieder sichern.',
              '**Laufrad einbauen** und den Hebel mehrmals ziehen, bis der Druckpunkt wieder da ist.',
              '**Einbremsen:** 10–20 Mal aus ca. 25 km/h kräftig (nicht bis zum Stillstand) abbremsen. Erst danach erreichen die Beläge volle Bremskraft.',
            ],
          },
          {
            type: 'steps',
            title: 'Schleifende Bremse ausrichten',
            items: [
              '**Die beiden Befestigungsschrauben** des Bremssattels leicht lösen, sodass er sich gerade noch bewegen lässt.',
              '**Bremshebel ziehen und festhalten** – der Sattel richtet sich dabei mittig zur Scheibe aus.',
              '**Schrauben abwechselnd festziehen** (6–8 Nm), während der Hebel gezogen bleibt.',
              '**Rad drehen:** Schleift es noch leicht, gegen ein helles Blatt Papier schauen und den Sattel von Hand minimal korrigieren.',
            ],
          },
          {
            type: 'list',
            title: 'Bremse quietscht oder bremst schlecht',
            items: [
              '**Fett oder Öl auf Scheibe/Belag:** Scheibe mit Bremsenreiniger entfetten, Beläge mit feinem Schleifpapier anrauen. Stark verölte Beläge tauschen.',
              '**Neue Beläge:** brauchen das Einbremsen – danach verschwindet das Quietschen meist.',
              '**Schwammiger Druckpunkt:** Luft im System – Bremse entlüften (nächster Abschnitt).',
            ],
          },
        ],
      },
      {
        id: 'entlueften',
        title: 'Bremsen entlüften (Mineralöl)',
        summary: 'Luft aus der Bremsleitung holen, wenn der Hebel weich wird oder nach dem Kürzen der Leitung.',
        level: 'Fortgeschritten',
        time: '30–45 Min. pro Bremse',
        blocks: [
          {
            type: 'warning',
            text: 'LTWOO-Bremsen laufen mit **Mineralöl**. Niemals DOT-Flüssigkeit einfüllen – DOT zerstört die Dichtungen. Mineralöl ist rot oder grün, DOT meist gelblich/klar.',
          },
          {
            type: 'steps',
            items: [
              '**Laufrad ausbauen, Beläge herausnehmen** und einen **Entlüftungsblock** (Kunststoffplatte aus dem Kit) zwischen die Kolben stecken.',
              '**Rad so drehen**, dass der Bremshebel waagerecht steht und die Entlüftungsschraube oben am Hebel der höchste Punkt ist.',
              '**Am Hebel:** Entlüftungsschraube herausdrehen und den **Trichter** einschrauben, etwas Mineralöl einfüllen.',
              '**Am Bremssattel:** die mit Öl gefüllte **Spritze mit Schlauch** am Entlüftungsnippel anschließen und den Nippel eine Vierteldrehung öffnen.',
              '**Öl von unten nach oben drücken:** langsam mit der Spritze Öl in den Sattel drücken. Im Trichter steigen Luftblasen auf.',
              '**Hebel mehrmals ziehen und loslassen** und leicht gegen Leitung und Sattel klopfen, bis keine Blasen mehr kommen.',
              '**Nippel am Sattel schließen**, Spritze abnehmen.',
              '**Trichter mit Stopfen verschließen**, abschrauben und die Entlüftungsschraube wieder eindrehen.',
              '**Alles gründlich reinigen** – kein Öl darf an Scheibe oder Belägen bleiben.',
              '**Beläge und Laufrad einbauen**, Druckpunkt prüfen: Der Hebel soll sich fest anfühlen und nicht bis zum Lenker durchziehen.',
            ],
          },
          {
            type: 'tip',
            text: 'Ein Tuch unter den Sattel legen und Einweghandschuhe tragen. Mineralöl ist zwar harmlos für die Haut, aber auf der Bremsscheibe fatal.',
          },
        ],
      },
    ],
  },
  {
    id: 'laufraeder-reifen',
    title: 'Laufräder & Reifen',
    heading: 'Laufräder & Reifen: Wechseln, Tubeless, Zentrieren',
    description:
      'Laufrad mit Steckachse aus- und einbauen, Reifen und Schlauch wechseln, richtiger Luftdruck, Tubeless einrichten und Laufrad zentrieren.',
    intro:
      'Platten unterwegs, neue Reifen oder ein Achter im Laufrad: Hier findest du Anleitungen zum Aus- und Einbau mit Steckachse, zum Reifen- und Schlauchwechsel, Richtwerte für den Luftdruck, die Umrüstung auf Tubeless und das Zentrieren von Laufrädern.',
    sections: [
      {
        id: 'laufrad-einbau',
        title: 'Laufrad aus- und einbauen (Steckachse)',
        summary: 'Die Grundlage für fast jede Reparatur – mit Steckachse schnell und sicher.',
        level: 'Einsteiger',
        time: '5 Min.',
        blocks: [
          {
            type: 'steps',
            items: [
              '**Hinten:** vorher auf das **kleinste Ritzel** schalten – dann geht das Hinterrad leichter raus und rein.',
              '**Steckachse herausdrehen** (Hebel oder 6-mm-Inbus) und ganz herausziehen.',
              '**Laufrad nach unten** aus dem Rahmen nehmen, hinten das Schaltwerk dabei leicht nach hinten ziehen.',
              '**Bremshebel nicht ziehen**, solange das Laufrad draußen ist – sonst fahren die Kolben zusammen. Zur Sicherheit einen Belagspreizer oder Transportblock einstecken.',
              '**Einbau:** Scheibe zwischen die Beläge führen, Kette hinten auf das kleinste Ritzel legen, Achse einschieben und mit 12–15 Nm festdrehen.',
            ],
          },
        ],
      },
      {
        id: 'reifen',
        title: 'Reifen & Schlauch wechseln',
        summary: 'Platten flicken, Schlauch tauschen, Reifen montieren – und welcher Luftdruck der richtige ist.',
        level: 'Einsteiger',
        time: '15 Min.',
        blocks: [
          {
            type: 'steps',
            items: [
              '**Luft komplett ablassen** – beim Sclaverand-Ventil die kleine Rändelmutter aufdrehen und drücken.',
              '**Reifen rundherum zur Felgenmitte drücken** – dort ist die Felge tiefer, der Reifen wird lockerer.',
              '**Mit einem Reifenheber** gegenüber dem Ventil eine Seite über die Felge hebeln, mit dem zweiten Heber Stück für Stück weiterarbeiten.',
              '**Schlauch herausnehmen.**',
              '**Ursache suchen:** Innenseite des Reifens vorsichtig mit den Fingern abtasten – oft steckt die Scherbe oder der Dorn noch drin.',
              '**Neuen Schlauch leicht aufpumpen**, bis er rund ist, und zuerst mit dem Ventil in die Felge einlegen.',
              '**Reifen von Hand aufziehen** – am Ventil beginnen, zum Schluss gegenüber. Das letzte Stück mit dem Handballen „rollen“, nur im Notfall mit dem Heber (Schlauch nicht einklemmen!).',
              '**Sitz prüfen:** Die feine Linie an der Reifenflanke muss rundherum gleich weit von der Felge entfernt sein.',
              '**Auf Solldruck aufpumpen.**',
            ],
          },
          {
            type: 'table',
            title: 'Luftdruck – Richtwerte',
            head: ['Reifen', 'Druck', 'Hinweis'],
            rows: [
              ['Rennrad 25 mm', '5,5–7 bar', 'schwerere Fahrer eher oben'],
              ['Rennrad 28–32 mm', '4–5,5 bar', 'mehr Komfort, kaum langsamer'],
              ['Gravel 40–45 mm', '2–3,5 bar', 'auf Schotter eher weniger'],
            ],
            note: 'Die Werte an der Reifenflanke (min./max.) sind immer die Grenze. Hinten etwas mehr Druck als vorne.',
          },
          {
            type: 'tip',
            text: '**Ventillänge:** Das Ventil muss 15–20 mm aus der Felge schauen, damit die Pumpe hält. Hohe Carbonfelgen (50 mm und mehr) brauchen lange Ventile oder eine Ventilverlängerung – der Konfigurator zeigt dir die passende Länge bei den Schläuchen.',
          },
          {
            type: 'list',
            title: 'Schlauch flicken (für unterwegs)',
            items: [
              'Loch finden: Schlauch aufpumpen und hören oder in Wasser halten.',
              'Stelle mit Schleifpapier anrauen, Vulkanisierlösung dünn auftragen, **1–2 Minuten antrocknen lassen**.',
              'Flicken fest aufdrücken. TPU-Schläuche (wie die Ridenow) brauchen **spezielle TPU-Flicken** – normale Gummiflicken halten darauf nicht.',
            ],
          },
        ],
      },
      {
        id: 'tubeless',
        title: 'Tubeless – ohne Schlauch fahren',
        summary: 'Weniger Platten, weniger Luftdruck: So rüstest du tubeless-fähige Laufräder um.',
        level: 'Fortgeschritten',
        time: '30–45 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Die Laufräder im Konfigurator (Elitewheels, RUJIXU) sind tubeless-fähig, die Reifen werden aber standardmäßig mit Schlauch montiert. Umrüsten lohnt sich vor allem beim Gravel – kleine Löcher dichtet die Milch selbst ab.',
          },
          {
            type: 'steps',
            items: [
              '**Tubeless-Felgenband** prüfen bzw. aufkleben – es muss alle Speichenlöcher dicht abdecken.',
              '**Tubeless-Ventil** einsetzen und festziehen.',
              '**Tubeless-fähigen Reifen** montieren (wie oben, aber ohne Schlauch).',
              '**Dichtmilch einfüllen:** Ventileinsatz herausdrehen und 30–40 ml (Rennrad) bzw. 40–60 ml (Gravel) durch das Ventil spritzen.',
              '**Schlagartig aufpumpen** – mit Kompressor oder Tubeless-Pumpe, bis der Reifen mit einem „Plopp“ in die Felge springt.',
              '**Ventileinsatz wieder einsetzen**, auf Druck bringen und das Rad schwenken, damit die Milch überall hinkommt.',
            ],
          },
          {
            type: 'tip',
            text: 'Dichtmilch trocknet mit der Zeit aus – alle 3–6 Monate nachfüllen.',
          },
        ],
      },
      {
        id: 'zentrieren',
        title: 'Speichen & Laufrad zentrieren',
        summary: 'Einen leichten Seitenschlag („Achter“) selbst beheben – und wann du besser zum Händler gehst.',
        level: 'Fortgeschritten',
        time: '30 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Kleine Seitenschläge kannst du mit etwas Übung selbst beheben. Bei **gebrochenen Speichen**, großen Schlägen oder **Carbonfelgen mit hoher Speichenspannung** lohnt sich der Weg zur Werkstatt.',
          },
          {
            type: 'list',
            title: 'Das Grundprinzip',
            items: [
              'Jede Speiche wird am **Nippel** an der Felge gespannt.',
              '**Anziehen** zieht die Felge an dieser Stelle zu der Seite, zu der die Speiche an der Nabe führt.',
              '**Lösen** lässt die Felge an dieser Stelle zur anderen Seite wandern.',
            ],
          },
          {
            type: 'steps',
            title: 'Achter herausfahren',
            items: [
              '**Laufrad einspannen** – ideal im Zentrierständer, notfalls im Rahmen mit einem Kabelbinder als Messpunkt.',
              '**Größten Schlag suchen:** Rad langsam drehen, Stelle markieren.',
              '**Felge schlägt nach links aus:** an dieser Stelle die Speichen, die **zur rechten Nabenseite** führen, eine Vierteldrehung anziehen (und/oder die linken lösen).',
              '**Kleine Schritte:** maximal eine Vierteldrehung pro Speiche, dann wieder prüfen.',
              '**Wiederholen**, bis der Schlag kaum noch sichtbar ist. Ein minimaler Restschlag ist normal.',
            ],
          },
          {
            type: 'warning',
            text: 'Nicht an einzelnen Speichen „kurbeln“ – zu große Korrekturen verziehen das Laufrad schlimmer als vorher.',
          },
        ],
      },
    ],
  },
  {
    id: 'cockpit',
    title: 'Cockpit & Kontaktpunkte',
    heading: 'Cockpit & Kontaktpunkte einstellen',
    description:
      'Steuersatz einstellen, Lenker, Vorbau, Sattelstütze und Sattel montieren, Pedale und Cleats richtig einstellen – für eine sichere und bequeme Sitzposition.',
    intro:
      'Lenker, Sattel und Pedale sind deine Kontaktpunkte zum Rad. Hier erfährst du, wie du den Steuersatz spielfrei einstellst, Lenker, Vorbau, Sattelstütze und Sattel (auch aus Carbon) richtig montierst und Pedale und Cleats einstellst.',
    sections: [
      {
        id: 'steuersatz',
        title: 'Steuersatz einstellen',
        summary: 'Lenkung ohne Spiel und ohne Schwergang – der wichtigste Handgriff beim Cockpit-Aufbau.',
        level: 'Einsteiger',
        time: '10 Min.',
        blocks: [
          {
            type: 'p',
            text: 'Der Steuersatz lagert die Gabel im Rahmen. Alle Rahmen im Konfigurator haben einen **integrierten Ahead-Steuersatz**: Die Lager sitzen im Rahmen, eingestellt wird über die Deckelschraube oben auf dem Vorbau.',
          },
          {
            type: 'steps',
            items: [
              '**Vorbau-Klemmschrauben** (seitlich am Gabelschaft) lösen.',
              '**Deckelschraube oben** langsam anziehen, bis kein Spiel mehr da ist. **Test:** Vorderbremse ziehen und das Rad vor und zurück schieben – es darf nichts klacken.',
              '**Nicht zu fest:** Der Lenker muss sich ohne Hakeln leicht drehen lassen, wenn du das Vorderrad anhebst.',
              '**Vorbau gerade zum Vorderrad ausrichten** (von oben über den Lenker peilen).',
              '**Klemmschrauben abwechselnd** mit dem Drehmomentschlüssel anziehen (meist 5 Nm, Angabe am Vorbau beachten).',
            ],
          },
          {
            type: 'p',
            text: '**Wartung:** 1–2 Mal pro Jahr (öfter bei viel Regen) Lager ausbauen, reinigen und neu fetten. Knarzen oder „Einrasten“ beim Lenken deutet auf verschlissene Lager hin.',
          },
        ],
      },
      {
        id: 'cockpit-montage',
        title: 'Lenker, Vorbau, Sattelstütze & Sattel',
        summary: 'Alles, was du anfasst, richtig montieren – mit Montagepaste und Drehmoment.',
        level: 'Einsteiger',
        time: '30 Min.',
        blocks: [
          {
            type: 'steps',
            title: 'Lenker (bzw. integriertes Cockpit)',
            items: [
              '**Carbon-Montagepaste** dünn auf die Klemmflächen.',
              '**Lenker mittig ausrichten** und den Winkel wählen: Die Unterlenker-Enden zeigen etwa zur hinteren Bremse oder waagerecht nach hinten.',
              '**Klemmschrauben über Kreuz** und in mehreren Durchgängen anziehen, bis der Spalt oben und unten gleich ist (meist 4–6 Nm).',
              'Bei **integrierten Cockpits** ist Lenker und Vorbau ein Teil – hier stellst du nur Höhe (Spacer) und Ausrichtung ein.',
            ],
          },
          {
            type: 'steps',
            title: 'Sattelstütze',
            items: [
              '**Sitzrohr innen und Stütze außen reinigen.**',
              '**Carbon-Montagepaste** auftragen – bei Carbon niemals Fett, sonst rutscht die Stütze.',
              '**Mindesteinstecktiefe** beachten (Markierung auf der Stütze).',
              '**Klemmschraube** mit Drehmoment anziehen (meist 5–7 Nm, Angabe am Rahmen gilt).',
            ],
          },
          {
            type: 'steps',
            title: 'Sattel & Sitzhöhe – die Grundeinstellung',
            items: [
              '**Sattel waagerecht** montieren (Wasserwaage oder Handy-App).',
              '**Sitzhöhe grob einstellen:** Ferse aufs Pedal in der untersten Stellung – das Bein ist jetzt gerade durchgestreckt. Beim Fahren mit dem Fußballen ist es dann leicht gebeugt.',
              '**Sattel vor/zurück:** Pedale waagerecht – das vordere Knie steht etwa über der Pedalachse.',
              '**Klemmschrauben** laut Angabe an der Stütze anziehen (meist 5–12 Nm).',
              '**Immer nur eine Sache ändern** und dann Probe fahren – kleine Änderungen machen einen großen Unterschied.',
            ],
          },
          {
            type: 'steps',
            title: 'Lenkerband wickeln',
            items: [
              '**Unten am Lenkerende beginnen** und von innen nach außen wickeln (rechts im Uhrzeigersinn, links gegen den Uhrzeigersinn).',
              '**Gleichmäßig mit leichtem Zug** und etwa einem Drittel Überlappung wickeln.',
              '**Am Bremshebel** mit einer Acht um den Hebelkörper herum wickeln – die kurzen Beilage-Stücke decken die Lücke ab.',
              '**Oben schräg abschneiden** und mit dem Abschlussband fixieren, **Lenkerstopfen** unten einstecken.',
            ],
          },
        ],
      },
      {
        id: 'pedale',
        title: 'Pedale & Cleats',
        summary: 'Pedale richtig herum eindrehen und Klickplatten schmerzfrei einstellen.',
        level: 'Einsteiger',
        time: '15 Min.',
        blocks: [
          {
            type: 'warning',
            text: '**Das linke Pedal hat ein Linksgewinde.** Es wird **gegen** den Uhrzeigersinn festgezogen. Merkhilfe: Beide Pedale werden „in Fahrtrichtung“ eingedreht. Markierung „L“ und „R“ steht auf der Achse.',
          },
          {
            type: 'steps',
            title: 'Pedale montieren',
            items: [
              '**Gewinde leicht fetten.**',
              '**Von Hand ansetzen** und einige Umdrehungen eindrehen – so merkst du, ob es schief sitzt.',
              '**Mit Inbus oder Pedalschlüssel** festziehen (35–40 Nm).',
            ],
          },
          {
            type: 'p',
            text: '**Klick- oder Flatpedal?** Klickpedale verbinden Schuh und Pedal fest – effizienter und sicherer bei Tempo, brauchen aber spezielle Schuhe und etwas Übung. Flatpedale gehen mit jedem Schuh und sind für den Einstieg entspannter.',
          },
          {
            type: 'steps',
            title: 'Cleats einstellen',
            items: [
              '**Cleat lose** unter den Schuh schrauben.',
              '**Position:** Der Fußballen (breiteste Stelle des Vorderfußes) liegt etwa **über der Pedalachse**.',
              '**Winkel:** so, wie dein Fuß im Stehen natürlich steht – meist Ferse leicht nach innen.',
              '**Festziehen** und die ersten Fahrten locker angehen. Ziehen Knie oder Füße, in kleinen Schritten nachjustieren.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nachschlagen',
    title: 'Zum Nachschlagen',
    heading: 'Drehmoment-Tabelle, Wartung & Glossar',
    description:
      'Drehmoment-Tabelle für Fahrradschrauben, Wartungs-Checkliste für Rennrad und Gravelbike und ein Glossar mit allen wichtigen Fachbegriffen.',
    intro:
      'Zum schnellen Nachschlagen beim Schrauben: die wichtigsten Anzugsmomente in einer Tabelle, eine Wartungs-Checkliste für regelmäßige Kontrollen und ein Glossar, das Fachbegriffe rund ums Rad einfach erklärt.',
    sections: [
      {
        id: 'drehmoment',
        title: 'Drehmoment-Tabelle',
        summary: 'Wie fest ist fest genug? Richtwerte für alle wichtigen Schrauben.',
        level: 'Nachschlagen',
        blocks: [
          {
            type: 'warning',
            text: 'Die Angabe **auf dem Bauteil** (eingeprägt oder aufgedruckt) gilt immer vor dieser Tabelle – besonders bei Carbon.',
          },
          {
            type: 'table',
            head: ['Bauteil', 'Drehmoment'],
            rows: [
              ['Vorbau – Lenkerklemmung', '4–6 Nm'],
              ['Vorbau – Gabelschaftklemmung', '5–6 Nm'],
              ['Sattelstützen-Klemmung', '5–7 Nm'],
              ['Sattelklemmung (Sattel an Stütze)', '5–12 Nm (je nach Stütze)'],
              ['Bremssattel an Rahmen/Gabel', '6–8 Nm'],
              ['Bremsleitung am Hebel (Überwurfmutter)', '5–7 Nm'],
              ['Center-Lock-Ring (Bremsscheibe)', '40 Nm'],
              ['Kassetten-Lockring', '40 Nm'],
              ['Steckachse', '12–15 Nm'],
              ['Schaltwerk am Schaltauge', '8–10 Nm'],
              ['Schaltzug-Klemmschraube', '5–6 Nm'],
              ['Kettenblattschrauben', '8–12 Nm'],
              ['Kurbel-Klemmschrauben (24-mm-Achse, ER7)', '12–14 Nm'],
              ['Kurbelschraube DUB (R9, GRT12)', '40–54 Nm'],
              ['Tretlager BSA / T47', '35–45 Nm'],
              ['Pedale', '35–40 Nm'],
              ['Flaschenhalter', '2–3 Nm'],
            ],
          },
        ],
      },
      {
        id: 'wartung',
        title: 'Wartungs-Checkliste',
        summary: 'Was du wann prüfen solltest – vom 2-Minuten-Check bis zur Jahresinspektion.',
        level: 'Nachschlagen',
        blocks: [
          {
            type: 'checklist',
            title: 'Vor jeder Fahrt (2 Minuten)',
            items: [
              'Reifendruck prüfen',
              'Beide Bremsen ziehen – fester Druckpunkt?',
              'Steckachsen fest?',
              'Akku der elektronischen Schaltung geladen?',
              'Kette trocken oder dreckig? Kurz ölen',
            ],
          },
          {
            type: 'checklist',
            title: 'Wöchentlich (wenn du regelmäßig fährst)',
            items: [
              'Kette reinigen und ölen',
              'Schrauben an Lenker, Vorbau und Sattel kontrollieren (nur prüfen, nicht nachknallen)',
              'Laufräder auf Seitenschlag prüfen',
            ],
          },
          {
            type: 'checklist',
            title: 'Alle paar hundert Kilometer',
            items: [
              'Kettenverschleiß messen',
              'Bremsbeläge auf Reststärke prüfen (unter 1 mm Belag: tauschen)',
              'Alle Gänge durchschalten, ggf. nachjustieren',
              'Reifen auf Schnitte und eingetretene Fremdkörper absuchen',
            ],
          },
          {
            type: 'checklist',
            title: 'Einmal im Jahr (bei viel Regen öfter)',
            items: [
              'Steuersatz zerlegen, reinigen, fetten',
              'Tretlager auf Spiel und Geräusche prüfen',
              'Bremsen entlüften bzw. Mineralöl tauschen',
              'Schaltzüge und -hüllen prüfen, bei Bedarf tauschen',
              'Tubeless-Milch nachfüllen',
              'Alle Schrauben mit dem Drehmomentschlüssel nachprüfen',
            ],
          },
        ],
      },
      {
        id: 'glossar',
        title: 'Glossar – Fachbegriffe einfach erklärt',
        summary: 'Von „B-Tension“ bis „Tubeless“: die wichtigsten Begriffe auf einen Blick.',
        level: 'Nachschlagen',
        blocks: [
          {
            type: 'terms',
            items: [
              ['Achter', 'Seitlicher Schlag im Laufrad – die Felge „eiert“ beim Drehen.'],
              ['B-Tension', 'Abstand zwischen oberem Schaltröllchen und größtem Ritzel, eingestellt über die B-Schraube.'],
              ['BSA', 'Häufigster Gewindestandard für Tretlager, 68 mm breites Gehäuse.'],
              ['Center Lock', 'Befestigung der Bremsscheibe über einen zentralen Verschlussring statt sechs Schrauben.'],
              ['Cleat', 'Platte unter dem Radschuh, die im Klickpedal einrastet.'],
              ['DUB', 'Kurbelachsen-Standard mit 28,99 mm Durchmesser (SRAM, ZRACE, LTWOO).'],
              ['Entlüften', 'Luft aus einer hydraulischen Bremse entfernen.'],
              ['Fach-Anzahl', 'Wie viele Ritzel die Kassette hat (z. B. 12-fach).'],
              ['Flat Mount', 'Befestigungsstandard für Scheibenbremssättel an Rennrad- und Gravelrahmen.'],
              ['Freilauf', 'Teil der Hinterradnabe, auf das die Kassette geschoben wird (z. B. Shimano HG).'],
              ['Indexierung', 'Feineinstellung der Schaltung, damit jeder Klick genau einen Gang schaltet.'],
              ['Kettenlinie', 'Gedachte Linie zwischen Kettenblatt und Kassette – sollte möglichst gerade laufen.'],
              ['Kettenpeitsche', 'Werkzeug, das die Kassette beim Lösen des Lockrings festhält.'],
              ['Limit-Schrauben (H/L)', 'Anschläge am Schaltwerk/Umwerfer, damit die Kette nicht herunterfällt.'],
              ['Lockring', 'Verschlussring, der Kassette oder Bremsscheibe hält.'],
              ['Olive', 'Kleiner Klemmring, der die Bremsleitung am Hebel abdichtet.'],
              ['Pressfit', 'Tretlager, das ohne Gewinde in den Rahmen gepresst wird.'],
              ['Schaltauge', 'Kleines, austauschbares Metallteil, an dem das Schaltwerk hängt – verbiegt sich lieber als der Rahmen.'],
              ['Steckachse', 'Achse, die durch Nabe und Rahmen geschraubt wird – steifer und sicherer als ein Schnellspanner.'],
              ['T47', 'Tretlager-Gewindestandard mit großem Durchmesser (47 mm).'],
              ['Tubeless', 'Reifen ohne Schlauch – abgedichtet mit Dichtmilch.'],
              ['UDH', 'Universelles Schaltauge, das an vielen neuen Rahmen verbaut ist und fast überall erhältlich ist.'],
            ],
          },
        ],
      },
    ],
  },
]

/**
 * YouTube-Videos ganz unten auf der Tutorial-Seite. Für jedes Thema die
 * Video-ID eintragen (der Teil nach „watch?v=“). Videos ohne ID werden nicht angezeigt.
 */
export interface TutorialVideo {
  title: string
  /** Kurzer Satz, was man im Video sieht */
  description: string
  youtubeId?: string
  /** Überthema (Gruppen-id), auf dessen Seite das Video zusätzlich erscheint */
  group?: string
}

export const TUTORIAL_VIDEOS: TutorialVideo[] = [
  { title: 'Rennrad oder Gravelbike komplett aufbauen', group: 'fahrrad-aufbauen', description: 'Vom Rahmen zum fertigen Bike – der ganze Ablauf im Zeitraffer.' },
  { title: 'Innenverlegte Leitungen einfädeln', group: 'fahrrad-aufbauen', description: 'Brems- und Schaltleitungen durch einen voll integrierten Rahmen.' },
  { title: 'Carbon-Gabelschaft kürzen', group: 'fahrrad-aufbauen', description: 'Messen, Sägeführung, Expander einsetzen.' },
  { title: 'Hydraulische Bremsleitung kürzen', group: 'fahrrad-aufbauen', description: 'Leitung schneiden, Stützhülse und Olive einpressen.' },
  { title: 'Scheibenbremse entlüften (Mineralöl)', group: 'bremsen', description: 'Trichter-Methode Schritt für Schritt.' },
  { title: 'Kette kürzen und Kettenschloss schließen', group: 'antrieb-schaltung', description: 'Richtige Länge finden und die Kette verbinden.' },
  { title: 'Schaltwerk einstellen (mechanisch)', group: 'antrieb-schaltung', description: 'H/L-Anschläge, B-Schraube und Indexierung.' },
  { title: 'LTWOO ER7 einrichten', group: 'antrieb-schaltung', description: 'Koppeln, App verbinden und die Schaltung feinjustieren.' },
  { title: 'Tretlager einbauen (BSA / T47)', group: 'antrieb-schaltung', description: 'Gewinde vorbereiten, Lager einschrauben, Drehmoment.' },
  { title: 'Kassette montieren und wechseln', group: 'antrieb-schaltung', description: 'Kassetten-Werkzeug und Kettenpeitsche richtig einsetzen.' },
  { title: 'Reifen und Schlauch wechseln', group: 'laufraeder-reifen', description: 'Platten beheben ohne eingeklemmten Schlauch.' },
  { title: 'Lenkerband wickeln', group: 'cockpit', description: 'Sauber und straff – auch um den Bremshebel.' },
  { title: 'Sitzposition einstellen', group: 'cockpit', description: 'Sitzhöhe, Sattelposition und Cleats.' },
]
