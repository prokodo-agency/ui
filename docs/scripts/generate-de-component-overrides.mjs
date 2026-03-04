#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const EN_DIR = path.join(ROOT, "docs", "components")
const DE_DIR = path.join(
  ROOT,
  "i18n",
  "de",
  "docusaurus-plugin-content-docs",
  "current",
  "components",
)

const REPLACEMENTS = [
  ["## Overview", "## Übersicht"],
  ["## AIC Note", "## AIC-Hinweis"],
  ["## Source", "## Quellcode"],
  [
    "| Prop | Type | Default | Required | Description |",
    "| Prop | Typ | Standard | Pflicht | Beschreibung |",
  ],
  [
    "Use the standard import path in application code:",
    "Verwende im Anwendungscode immer den Standard-Importpfad:",
  ],
  [
    "No separate `/client` or `/lazy` import selection is required in consumer code.",
    "Eine separate Auswahl von `/client` oder `/lazy` ist im Consumer-Code nicht erforderlich.",
  ],
  [
    "AIC components also support a `priority` flag for critical above-the-fold elements.",
    "AIC-Komponenten unterstützen außerdem ein `priority`-Flag für kritische Above-the-fold-Elemente.",
  ],
  [
    'This is most visible on `Image` (`loading="eager"` + `fetchpriority="high"`).',
    'Am sichtbarsten ist das bei `Image` (`loading="eager"` + `fetchpriority="high"`).',
  ],
  ["for form submission.", "für das Formular-Submit."],
  ["Field name", "Feldname"],
  ["Array of ", "Array von "],
  ["Enable ", "Aktiviere "],
  ["Disable ", "Deaktiviere "],
  ["CSS class on root element.", "CSS-Klasse am Root-Element."],
  [
    "CSS class on root `<fieldset>` element.",
    "CSS-Klasse am Root-`<fieldset>`-Element.",
  ],
  ["CSS class on the root element.", "CSS-Klasse am Root-Element."],
  [
    "Called with serialised HTML on each change.",
    "Wird bei jeder Änderung mit serialisiertem HTML aufgerufen.",
  ],
  ["Controlled HTML content value.", "Kontrollierter HTML-Content-Wert."],
  [
    "Editor label shown above the toolbar.",
    "Editor-Label oberhalb der Toolbar.",
  ],
  [
    "Placeholder text shown in an empty editor.",
    "Placeholder-Text in einem leeren Editor.",
  ],
  ["Disable the editor.", "Deaktiviert den Editor."],
  [
    "Error message shown below the editor.",
    "Fehlermeldung unterhalb des Editors.",
  ],
  ["TypeScript types:", "TypeScript-Typen:"],
  [":::warning Beta", ":::warning Beta"],
  [
    "is currently in **beta**. API details and behavior may still change in upcoming releases.",
    "ist aktuell in **Beta**. API-Details und Verhalten können sich in kommenden Releases noch ändern.",
  ],
  [
    "description: Versatile text input with label, helper text, error feedback, start/end adornments, and all HTML input types.",
    "description: Vielseitige Texteingabe mit Label, Hilfetext, Fehlerhinweisen, Start-/End-Adornments und allen HTML-Input-Typen.",
  ],
  [
    "description: Typographic heading component mapping semantic levels (h1–h6) to the prokodo type scale.",
    "description: Typografische Überschriften-Komponente, die semantische Ebenen (h1–h6) auf die prokodo Typografie-Skala abbildet.",
  ],
  ["  Welcome to prokodo UI", "  Willkommen bei prokodo UI"],
  [
    "`Input` renders a styled `<input>` with an associated label, optional helper text below the field, error feedback, and support for leading/trailing adornments (icons or buttons).",
    "`Input` rendert ein gestyltes `<input>` mit zugehörigem Label, optionalem Hilfetext unter dem Feld, Fehlerfeedback und Unterstützung für führende/abschließende Adornments (Icons oder Buttons).",
  ],
  [
    '`Checkbox` renders an accessible `<input type="checkbox">` with an associated label, optional helper text, and error feedback. Works in controlled and uncontrolled modes.',
    '`Checkbox` rendert ein barrierefreies `<input type="checkbox">` mit zugehörigem Label, optionalem Hilfetext und Fehlerfeedback. Funktioniert in kontrollierten und unkontrollierten Modi.',
  ],
  [
    "`Avatar` rendert eine user profile picture with automatic fallback to initials when no image is provided. Unterstützt multiple shapes and sizes.",
    "`Avatar` rendert ein Profilbild mit automatischem Fallback auf Initialen, wenn kein Bild vorhanden ist. Unterstützt mehrere Formen und Größen.",
  ],
  [
    "`Carousel` rendert eine horizontal sliding view of items with optional autoplay, loop, navigation arrows, and pagination dots.",
    "`Carousel` rendert eine horizontal gleitende Ansicht von Inhalten mit optionalem Autoplay, Loop, Navigationspfeilen und Pagination-Punkten.",
  ],
  [
    "`Autocomplete` combines a text input with a filtered suggestion dropdown. Unterstützt static option arrays, async remote loading, free-form text entry, and multi-select with chip display.",
    "`Autocomplete` kombiniert ein Texteingabefeld mit einem gefilterten Vorschlags-Dropdown. Unterstützt statische Options-Arrays, asynchrones Laden aus Remote-Quellen, freie Texteingabe und Multi-Select mit Chip-Anzeige.",
  ],
  [
    "`ImageText` rendert eine two-column section with an image on one side and text content on the other. The layout direction (image-left vs image-right) is reversible and collapses to a single column on mobile.",
    "`ImageText` rendert einen zweispaltigen Abschnitt mit Bild auf der einen und Text auf der anderen Seite. Die Layout-Richtung (Bild links vs. Bild rechts) ist umkehrbar und bricht auf mobilen Geräten auf eine Spalte um.",
  ],
  [
    "`Link` is the presentational link component — builds on `BaseLink` and adds typography styling, optional leading/trailing icons, and variant support.",
    "`Link` ist die präsentationsorientierte Link-Komponente — sie baut auf `BaseLink` auf und ergänzt Typografie-Styling, optionale führende/trailing Icons und Varianten-Support.",
  ],
  [
    "`Tabs` rendert eine tabbed interface with accessible keyboard navigation (arrow keys), animated panel transitions, and correct ARIA `tablist`/`tab`/`tabpanel` roles.",
    "`Tabs` rendert eine Tab-Oberfläche mit barrierefreier Tastaturnavigation (Pfeiltasten), animierten Panel-Übergängen und korrekten ARIA-Rollen für `tablist`/`tab`/`tabpanel`.",
  ],
  [
    "`DatePicker` rendert eine text input that opens an accessible calendar popup for date selection. Unterstützt single date, range, and time selection modes with full localization.",
    "`DatePicker` rendert ein Texteingabefeld, das ein barrierefreies Kalender-Popup zur Datumsauswahl öffnet. Unterstützt Einzel-Datum, Bereichsauswahl und Zeitauswahl mit vollständiger Lokalisierung.",
  ],
  [
    "`Pagination` rendert eine page navigation strip. It handles large page counts by showing a configurable window of pages with ellipsis on either side.",
    "`Pagination` rendert eine Seitennavigations-Leiste. Sie unterstützt große Seitenzahlen über ein konfigurierbares Fenster von Seiten mit Auslassungspunkten auf beiden Seiten.",
  ],
  [
    "`PostTeaser` rendert eine vertical card-style teaser for blog or news content. Suited for grid-based article listings with a prominent cover image.",
    "`PostTeaser` rendert einen vertikalen Teaser im Kartenstil für Blog- oder News-Inhalte. Geeignet für rasterbasierte Artikel-Listings mit prominentem Coverbild.",
  ],
  [
    "`Quote` rendert eine semantically correct `<blockquote>` with optional author attribution and a decorative accent. Common use cases include testimonials, pull-quotes, and cited passages.",
    "`Quote` rendert ein semantisch korrektes `<blockquote>` mit optionaler Autorenangabe und dekorativem Akzent. Häufige Einsatzzwecke sind Testimonials, Pull-Quotes und zitierte Passagen.",
  ],
  [
    "`RTE` (Rich Text Editor) provides a WYSIWYG editing experience with a configurable toolbar. Unterstützt markdown shortcuts, inline formatting, lists, links, and optional image upload.",
    "`RTE` (Rich Text Editor) bietet eine WYSIWYG-Bearbeitung mit konfigurierbarer Toolbar. Unterstützt Markdown-Shortcuts, Inline-Formatierung, Listen, Links und optionalen Bild-Upload.",
  ],
  [
    "| `htmlFor` | `string` | — | — | Associates the label with a form control `id`. |",
    "| `htmlFor` | `string` | — | — | Verknüpft das Label mit der `id` eines Formularelements. |",
  ],
]

const INTRO_TRANSLATIONS = [
  [
    "Input",
    "`Input` rendert ein gestyltes `<input>` mit zugehörigem Label, optionalem Hilfetext unter dem Feld, Fehlerfeedback und Unterstützung für führende/abschließende Adornments (Icons oder Buttons).",
  ],
  [
    "Checkbox",
    '`Checkbox` rendert ein barrierefreies `<input type="checkbox">` mit zugehörigem Label, optionalem Hilfetext und Fehlerfeedback. Funktioniert in kontrollierten und unkontrollierten Modi.',
  ],
  [
    "Autocomplete",
    "`Autocomplete` kombiniert ein Texteingabefeld mit einem gefilterten Vorschlags-Dropdown. Unterstützt statische Options-Arrays, asynchrones Laden aus Remote-Quellen, freie Texteingabe und Multi-Select mit Chip-Anzeige.",
  ],
  [
    "AnimatedText",
    "`AnimatedText` rendert Text mit gestaffelten Einblend-Animationen auf Zeichen- oder Wortebene, umgesetzt mit CSS-Transitions und prokodo Design-Tokens.",
  ],
  [
    "Animated",
    "`Animated` rendert einzelne Inhalte mit konfigurierbaren Einblend- und Übergangsanimationen. Ideal für dezente Motion-Effekte in Content-Bereichen.",
  ],
  [
    "Button",
    "`Button` ist das zentrale interaktive UI-Element in `@prokodo/ui`. Unterstützt Text- und Icon-Varianten, Loading-/Disabled-States, Full-Width-Layout und Redirect-Nutzung.",
  ],
  [
    "Icon",
    "`Icon` rendert skalierbare Symbolgrafiken aus dem prokodo-Iconset mit konsistenter Größe, Farbe und Zugänglichkeit.",
  ],
  [
    "Image",
    "`Image` rendert optimierte Bilder mit responsiven Größen, Lazy-Loading und optionaler Priority für Above-the-fold-Inhalte.",
  ],
  [
    "InputOTP",
    "`InputOTP` rendert eine OTP-Eingabe mit separaten Eingabefeldern pro Stelle, automatischem Fokus-Handling und sauberer Tastaturnavigation.",
  ],
  [
    "Label",
    "`Label` rendert ein semantisches Formular-Label mit optionalem Required-Indikator und konsistenter Typografie für Form Controls.",
  ],
  [
    "Rating",
    "`Rating` rendert eine Bewertungs-Eingabe mit Sternen (oder Symbolen), inklusive Hover-Vorschau, Teilwerten und kontrollierter Nutzung.",
  ],
  [
    "Switch",
    "`Switch` rendert einen barrierefreien Toggle-Schalter mit Label, Disabled-State und semantisch korrekter ARIA-Rolle.",
  ],
  [
    "Accordion",
    "`Accordion` rendert auf- und zuklappbare Inhaltsbereiche mit animierten Übergängen und sauberem ARIA-Disclosure-Pattern.",
  ],
  [
    "Card",
    "`Card` rendert einen flexiblen Content-Container für Teaser, Listen und Landing-Sections mit konsistentem Spacing und optionalen Interaktionszuständen.",
  ],
  [
    "Grid",
    "`Grid` rendert ein responsives Rasterlayout zur strukturierten Platzierung von Inhalten über verschiedene Breakpoints hinweg.",
  ],
  [
    "Stepper",
    "`Stepper` rendert eine mehrstufige Navigation für lineare oder nicht-lineare Prozesse mit Statusanzeige und Fortschrittskontext.",
  ],
  [
    "SideNav",
    "`SideNav` rendert eine seitliche Navigation mit klarer Hierarchie, aktivem Zustand und optionalen Untereinträgen.",
  ],
  [
    "PostItem",
    "`PostItem` rendert einen kompakten Blog-/News-Eintrag mit Bild, Metadaten und Link-Ziel für Listen- oder Feed-Ansichten.",
  ],
  [
    "PostWidget",
    "`PostWidget` rendert ein kompaktes Sidebar-Widget mit aktuellen oder verwandten Beiträgen inklusive Thumbnail und Datum.",
  ],
  [
    "PostWidgetCarousel",
    "`PostWidgetCarousel` rendert Beiträge als horizontalen Slider und kombiniert Post-Teaser mit Carousel-Navigation.",
  ],
  [
    "RichText",
    "`RichText` rendert aufbereiteten Rich-Text/HTML-Content mit prokodo-Typografie, semantischen Elementen und sicheren Standard-Styles.",
  ],
  [
    "Dialog",
    "`Dialog` rendert einen modalen Overlay-Dialog mit Focus-Trap, ESC-Close und flexiblen Größen-/Layout-Optionen.",
  ],
  [
    "Drawer",
    "`Drawer` rendert ein seitlich einfahrendes Panel für Navigation, Filter oder sekundäre Aktionen mit kontrolliertem Open-State.",
  ],
  [
    "Loading",
    "`Loading` rendert visuelle Ladezustände für asynchrone Prozesse, inklusive Spinner-/Indikatorvarianten und konsistentem Motion-Verhalten.",
  ],
  [
    "ProgressBar",
    "`ProgressBar` rendert linearen Fortschritt in determinierten oder indeterminierten Modi mit klarer Statusvisualisierung.",
  ],
  [
    "Skeleton",
    "`Skeleton` rendert Platzhalter-Elemente für Ladezustände, um Layout-Stabilität und wahrgenommene Performance zu verbessern.",
  ],
  [
    "Snackbar",
    "`Snackbar` rendert temporäre Benachrichtigungen (Toast) mit Varianten, Actions und optionalem Auto-Dismiss.",
  ],
  [
    "Tooltip",
    "`Tooltip` rendert kontextbezogene Hinweise bei Hover/Fokus und verbessert die Verständlichkeit kompakter UI-Elemente.",
  ],
  [
    "Calendly",
    "`Calendly` bindet Calendly-Buchungsflows als Komponente ein und ermöglicht Terminvereinbarungen direkt im UI-Kontext.",
  ],
  [
    "Lottie",
    "`Lottie` rendert JSON-basierte Lottie-Animationen performant im UI und unterstützt kontrollierte Wiedergabeoptionen.",
  ],
  [
    "Map",
    "`Map` rendert interaktive Kartenansichten mit Marker-/Standortdarstellung und eignet sich für Kontakt- und Standortseiten.",
  ],
  [
    "Avatar",
    "`Avatar` rendert ein Profilbild mit automatischem Fallback auf Initialen, wenn kein Bild vorhanden ist. Unterstützt mehrere Formen und Größen.",
  ],
  [
    "BaseLink",
    "`BaseLink` ist das grundlegende Link-Primitive in `@prokodo/ui`. Es rendert in Server-Kontexten als `<a>` und unterstützt interne sowie externe Navigation. Wird intern von `Button`, `Card` und weiteren Komponenten mit `redirect`-Props verwendet.",
  ],
  [
    "Carousel",
    "`Carousel` rendert eine horizontal gleitende Ansicht von Inhalten mit optionalem Autoplay, Loop, Navigationspfeilen und Pagination-Punkten.",
  ],
  [
    "Chip",
    "`Chip` rendert ein kompaktes Inline-Label. Häufige Einsatzzwecke sind Tags, Status-Badges, Filter-Pills und ausgewählte Werte in Formular-Komponenten.",
  ],
  [
    "DatePicker",
    "`DatePicker` rendert ein Texteingabefeld, das ein barrierefreies Kalender-Popup zur Datumsauswahl öffnet. Unterstützt Einzel-Datum, Bereichsauswahl und Zeitauswahl mit vollständiger Lokalisierung.",
  ],
  [
    "Headline",
    "`Headline` rendert eine typografische Überschrift (`h1`–`h6`) mit angewendeter Design-Token-Typografie. Unterstützt visuelle Größen-Overrides, die die visuelle Darstellung von der semantischen Ebene entkoppeln.",
  ],
  [
    "ImageText",
    "`ImageText` rendert einen zweispaltigen Abschnitt mit Bild auf der einen und Text auf der anderen Seite. Die Layout-Richtung (Bild links vs. Bild rechts) ist umkehrbar und bricht auf mobilen Geräten auf eine Spalte um.",
  ],
  [
    "Link",
    "`Link` ist die präsentationsorientierte Link-Komponente — sie baut auf `BaseLink` auf und ergänzt Typografie-Styling, optionale führende/trailing Icons und Varianten-Support.",
  ],
  [
    "List",
    "`List` rendert semantische `<ul>`- oder `<ol>`-Listen mit optionalen Icon-Bullets und Unterstützung für verschachtelte Unterlisten.",
  ],
  [
    "Pagination",
    "`Pagination` rendert eine Seitennavigations-Leiste. Sie unterstützt große Seitenzahlen über ein konfigurierbares Fenster von Seiten mit Auslassungspunkten auf beiden Seiten.",
  ],
  [
    "PostTeaser",
    "`PostTeaser` rendert einen vertikalen Teaser im Kartenstil für Blog- oder News-Inhalte. Geeignet für rasterbasierte Artikel-Listings mit prominentem Coverbild.",
  ],
  [
    "Quote",
    "`Quote` rendert ein semantisch korrektes `<blockquote>` mit optionaler Autorenangabe und dekorativem Akzent. Häufige Einsatzzwecke sind Testimonials, Pull-Quotes und zitierte Passagen.",
  ],
  [
    "RTE",
    "`RTE` (Rich Text Editor) bietet eine WYSIWYG-Bearbeitung mit konfigurierbarer Toolbar. Unterstützt Markdown-Shortcuts, Inline-Formatierung, Listen, Links und optionalen Bild-Upload.",
  ],
  [
    "Select",
    "`Select` rendert ein barrierefreies Dropdown mit optionaler Suchfilterung, gruppierten Optionen, Multi-Select und asynchronem Laden externer Optionen.",
  ],
  [
    "Slider",
    '`Slider` rendert ein mit prokodo Design-Tokens gestyltes `<input type="range">`. Unterstützt Single-Thumb- und Dual-Thumb-Bereichsmodi.',
  ],
  [
    "Table",
    "`Table` rendert barrierefreie tabellarische Daten mit Unterstützung für sortierbare Spalten, optionalen Sticky-Header, Zebra-Streifen und horizontalen Scroll-Container für responsive Layouts.",
  ],
  [
    "Tabs",
    "`Tabs` rendert eine Tab-Oberfläche mit barrierefreier Tastaturnavigation (Pfeiltasten), animierten Panel-Übergängen und korrekten ARIA-Rollen für `tablist`/`tab`/`tabpanel`.",
  ],
  [
    "Teaser",
    "`Teaser` ist die primäre Marketing-Karten-Komponente. Sie kombiniert Bild, Kategorien-Label, Überschrift, Beschreibungstext und Call-to-Action-Link in einer einzigen, flexibel kombinierbaren Einheit. Wird häufig in Landingpages und Section-Grids verwendet.",
  ],
]

function translateOutsideCodeBlocks(input) {
  const parts = input.split(/(```[\s\S]*?```)/g)
  const translated = parts
    .map((part, index) => {
      if (index % 2 === 1) {
        return part
      }

      let out = part
      for (const [from, to] of REPLACEMENTS) {
        out = out.replaceAll(from, to)
      }

      out = out
        .replace(
          /^> See \[(.+?)\]\((.+?)\) for the full `(.+?)` type\.$/gm,
          "> Siehe [$1]($2) für den vollständigen `$3`-Typ.",
        )
        .replace(
          /👉 \[Open\s+(.+?)\s+in Storybook\]\((.+?)\)/g,
          "👉 [$1 in Storybook öffnen]($2)",
        )
        .replace(/\brenders an\b/g, "rendert ein")
        .replace(/\brenders a\b/g, "rendert eine")
        .replace(/\brenders\b/g, "rendert")
        .replace(/\bSupports\b/g, "Unterstützt")
        .replace(/\bsupports\b/g, "unterstützt")
        .replace(
          /\bEach panel can be independently toggled or controlled\./g,
          "Jedes Panel kann unabhängig umgeschaltet oder gesteuert werden.",
        )
        .replace(
          /\bEach entry shows a thumbnail, title, and date\./g,
          "Jeder Eintrag zeigt ein Thumbnail, einen Titel und ein Datum.",
        )
        .replace(/\bEach component ships with:\b/g, "Jede Komponente enthält:")
        .replace(
          /\bAll \*\*(\d+) components\*\* in `@prokodo\/ui`, sorted by category then name\./g,
          "Alle **$1 Komponenten** in `@prokodo/ui`, sortiert nach Kategorie und Name.",
        )
        .replace(
          /\bExplore all (.+?) variants, controls, and a11y annotations live:\b/g,
          "Entdecke alle $1 Varianten, Controls und A11y-Hinweise live:",
        )
        .replace(/\bThe `([^`]+)` component\b/g, "Die `$1`-Komponente")
        .replace(/\bThe `([^`]+)`\b/g, "Die `$1`")
        .replace(/\bThe component\b/g, "Die Komponente")
        .replace(/\bDescription\b/g, "Beschreibung")

      for (const [componentName, intro] of INTRO_TRANSLATIONS) {
        const introLine = new RegExp(`^\`${componentName}\`.*$`, "m")
        out = out.replace(introLine, intro)
      }

      return out
    })
    .join("")

  return translated.replaceAll(
    "  Welcome to prokodo UI",
    "  Willkommen bei prokodo UI",
  )
}

async function main() {
  await fs.mkdir(DE_DIR, { recursive: true })

  const entries = await fs.readdir(EN_DIR, { withFileTypes: true })
  let created = 0
  let regenerated = 0

  for (const entry of entries) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".mdx") ||
      entry.name === "overview.mdx"
    ) {
      continue
    }

    const sourcePath = path.join(EN_DIR, entry.name)
    const targetPath = path.join(DE_DIR, entry.name)

    const source = await fs.readFile(sourcePath, "utf8")
    const translated = translateOutsideCodeBlocks(source)

    try {
      await fs.access(targetPath)
      regenerated += 1
    } catch {
      created += 1
    }

    await fs.writeFile(targetPath, translated, "utf8")
  }

  console.log(
    `✅ Created ${created} and regenerated ${regenerated} DE component pages from EN source.`,
  )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
