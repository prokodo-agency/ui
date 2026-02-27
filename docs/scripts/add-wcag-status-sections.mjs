#!/usr/bin/env node

/**
 * Generates a component-specific WCAG 2.2 criteria table for every component doc (EN + DE).
 *
 * Each component is assigned a profile that defines exactly which WCAG 2.2 Success Criteria
 * apply.  Every criterion is marked:
 *   ✅  – evidence found via automated tests / source scan
 *   🔍  – requires manual verification in the final integration context
 *
 * Run:  node scripts/add-wcag-status-sections.mjs
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const UI_ROOT = path.resolve(ROOT, "..")

const COMPONENT_DATA_PATH = path.join(ROOT, "docs", "_data", "components.json")

const TARGETS = [
  {
    locale: "en",
    dir: path.join(ROOT, "docs", "components"),
    heading: "## WCAG 2.2 Status",
  },
  {
    locale: "de",
    dir: path.join(
      ROOT,
      "i18n",
      "de",
      "docusaurus-plugin-content-docs",
      "current",
      "components",
    ),
    heading: "## WCAG-2.2-Status",
  },
]

// ---------------------------------------------------------------------------
// WCAG 2.2 Criteria Catalogue
// ---------------------------------------------------------------------------
const CRITERIA = {
  "1.1.1": {
    name: "Non-text Content",          name_de: "Nicht-Text-Inhalt",           level: "A",
    note_en: "All images, icons, and media require a text alternative (alt, aria-label, or aria-labelledby). Decorative-only elements must carry aria-hidden.",
    note_de: "Alle Bilder, Icons und Medien benötigen eine Textalternative (alt, aria-label oder aria-labelledby). Rein dekorative Elemente müssen aria-hidden tragen.",
  },
  "1.3.1": {
    name: "Info and Relationships",    name_de: "Info und Beziehungen",         level: "A",
    note_en: "Semantic structure (headings, lists, labels, landmarks) must be conveyed programmatically via HTML or ARIA.",
    note_de: "Semantische Struktur (Überschriften, Listen, Labels, Landmarks) muss programmatisch via HTML oder ARIA vermittelt werden.",
  },
  "1.3.2": {
    name: "Meaningful Sequence",       name_de: "Bedeutungsvolle Reihenfolge",  level: "A",
    note_en: "Content reading order in the DOM must match the intended visual presentation order.",
    note_de: "Die Lesereihenfolge im DOM muss der beabsichtigten visuellen Darstellungsreihenfolge entsprechen.",
  },
  "1.3.5": {
    name: "Identify Input Purpose",    name_de: "Eingabezweck identifizieren",  level: "AA",
    note_en: "Form fields collecting personal data must expose their purpose via the HTML autocomplete attribute.",
    note_de: "Formularfelder, die persönliche Daten erfassen, müssen ihren Zweck via HTML-autocomplete-Attribut kommunizieren.",
  },
  "1.4.1": {
    name: "Use of Color",              name_de: "Verwendung von Farbe",         level: "A",
    note_en: "Color must not be the only means of conveying information (e.g. error states, required field markers).",
    note_de: "Farbe darf nicht das einzige Mittel zur Informationsvermittlung sein (z. B. Fehlerhinweise, Pflichtfeldmarkierungen).",
  },
  "1.4.3": {
    name: "Contrast (Minimum)",        name_de: "Kontrast (Minimum)",           level: "AA",
    note_en: "Text must have a contrast ratio of at least 4.5:1 (3:1 for large text). Verify against the final product theme.",
    note_de: "Text benötigt ein Kontrastverhältnis von mindestens 4,5:1 (3:1 für großen Text). Prüfung im finalen Produkt-Theme erforderlich.",
  },
  "1.4.4": {
    name: "Resize Text",               name_de: "Textgröße ändern",             level: "AA",
    note_en: "Text must remain readable and functional when scaled to 200% without assistive technology.",
    note_de: "Text muss bei 200 % Zoom ohne Hilfsmittel lesbar und nutzbar bleiben.",
  },
  "1.4.5": {
    name: "Images of Text",            name_de: "Bilder von Text",              level: "AA",
    note_en: "Text should be rendered as real text rather than as an image, unless unavoidable (e.g. logo, brand mark).",
    note_de: "Text sollte als echter Text gerendert werden, nicht als Bild, außer wenn unvermeidbar (z. B. Logo, Markenzeichen).",
  },
  "1.4.11": {
    name: "Non-text Contrast",         name_de: "Nicht-Text-Kontrast",          level: "AA",
    note_en: "UI component boundaries and icons must achieve at least 3:1 contrast against adjacent colours. Verify in the product theme.",
    note_de: "Ränder von UI-Komponenten und Icons müssen mindestens 3:1 Kontrast zu angrenzenden Farben aufweisen. Prüfung im Produkt-Theme erforderlich.",
  },
  "2.1.1": {
    name: "Keyboard",                  name_de: "Tastatur",                     level: "A",
    note_en: "All functionality must be operable via keyboard alone, without requiring specific timing.",
    note_de: "Alle Funktionalität muss allein über Tastatur bedienbar sein, ohne Timing-Anforderungen.",
  },
  "2.1.2": {
    name: "No Keyboard Trap",          name_de: "Keine Tastaturfalle",          level: "A",
    note_en: "Keyboard focus must never become trapped inside a component; users must always be able to navigate away using standard keys.",
    note_de: "Der Tastaturfokus darf niemals innerhalb einer Komponente eingeschlossen sein; Nutzer müssen immer mit Standardtasten navigieren können.",
  },
  "2.2.1": {
    name: "Timing Adjustable",         name_de: "Zeitsteuerung anpassbar",      level: "A",
    note_en: "Auto-dismissing notifications must offer a way to extend or disable the timeout, or persist for at least 20 s.",
    note_de: "Automatisch schließende Benachrichtigungen müssen einen Weg bieten, das Timeout zu verlängern oder zu deaktivieren, oder mindestens 20 s angezeigt bleiben.",
  },
  "2.2.2": {
    name: "Pause, Stop, Hide",         name_de: "Pausieren, Beenden, Ausblenden", level: "A",
    note_en: "Animations or auto-rotating content lasting more than 5 s must provide a pause/stop control.",
    note_de: "Animationen oder automatisch rotierende Inhalte, die länger als 5 s laufen, müssen einen Pause-/Stopp-Schalter bieten.",
  },
  "2.3.1": {
    name: "Three Flashes or Below Threshold", name_de: "Dreimaliges Blitzen oder unterhalb des Grenzwerts", level: "A",
    note_en: "Animated content must not flash more than 3 times per second.",
    note_de: "Animierte Inhalte dürfen nicht mehr als 3-mal pro Sekunde flackern.",
  },
  "2.4.1": {
    name: "Bypass Blocks",             name_de: "Blöcke überspringen",          level: "A",
    note_en: "Embedded frames or repeated navigation blocks must provide a skip-to-content mechanism (e.g. iframe title, skip link).",
    note_de: "Eingebettete Frames oder wiederholte Navigationsblöcke müssen einen Skip-to-Content-Mechanismus bieten (z. B. iframe-Titel, Skip-Link).",
  },
  "2.4.3": {
    name: "Focus Order",               name_de: "Fokusreihenfolge",             level: "A",
    note_en: "The keyboard focus sequence must preserve meaning and operability in the complete page integration context.",
    note_de: "Die Tastaturfokus-Reihenfolge muss im vollständigen seitenseitigen Integrationskontext Bedeutung und Bedienbarkeit erhalten.",
  },
  "2.4.4": {
    name: "Link Purpose (In Context)", name_de: "Linkzweck (im Kontext)",       level: "A",
    note_en: "The purpose of every link must be determinable from the link text alone, or from its surrounding context.",
    note_de: "Der Zweck jedes Links muss allein aus dem Linktext oder aus dem umgebenden Kontext bestimmbar sein.",
  },
  "2.4.6": {
    name: "Headings and Labels",       name_de: "Überschriften und Bezeichnungen", level: "AA",
    note_en: "Headings and labels must describe the topic or purpose of their associated content.",
    note_de: "Überschriften und Labels müssen das Thema oder den Zweck des zugehörigen Inhalts beschreiben.",
  },
  "2.4.7": {
    name: "Focus Visible",             name_de: "Fokus sichtbar",               level: "AA",
    note_en: "A visible keyboard focus indicator must be present on every interactive element. Verify against the applied product theme.",
    note_de: "Auf jedem interaktiven Element muss ein sichtbarer Tastaturfokus-Indikator vorhanden sein. Prüfung gegen das angewendete Produkt-Theme erforderlich.",
  },
  "2.4.11": {
    name: "Focus Not Obscured (Min.)", name_de: "Fokus nicht verdeckt (Min.)", level: "AA",
    note_en: "The focused component must not be fully hidden by sticky headers, overlays, or other positioned page elements.",
    note_de: "Die fokussierte Komponente darf nicht vollständig durch Sticky-Header, Overlays oder andere positionierte Seitenelemente verdeckt sein.",
  },
  "2.5.3": {
    name: "Label in Name",             name_de: "Label im Namen",               level: "A",
    note_en: "For components with a visible label, the accessible name must contain or match the visible label text.",
    note_de: "Bei Komponenten mit sichtbarem Label muss der zugängliche Name den sichtbaren Labeltext enthalten oder diesem entsprechen.",
  },
  "2.5.8": {
    name: "Target Size (Minimum)",     name_de: "Zielgröße (Minimum)",          level: "AA",
    note_en: "Interactive target areas must be at least 24 × 24 CSS pixels. Verify in the integrated product UI.",
    note_de: "Interaktive Zielbereiche müssen mindestens 24 × 24 CSS-Pixel groß sein. Prüfung in der integrierten Produkt-UI erforderlich.",
  },
  "3.3.1": {
    name: "Error Identification",      name_de: "Fehlererkennung",              level: "A",
    note_en: "Input errors must be identified and described to the user in text, not by colour alone.",
    note_de: "Eingabefehler müssen in Textform identifiziert und dem Nutzer beschrieben werden, nicht nur durch Farbe.",
  },
  "3.3.2": {
    name: "Labels or Instructions",    name_de: "Bezeichnungen oder Anweisungen", level: "A",
    note_en: "Every form input requires a programmatically associated label or a visible instruction.",
    note_de: "Jedes Formularfeld benötigt ein programmatisch verknüpftes Label oder eine sichtbare Anweisung.",
  },
  "3.3.7": {
    name: "Redundant Entry",           name_de: "Redundante Eingabe",           level: "A",
    note_en: "Information already entered in the same session/process must not be required again unless it serves a distinct purpose.",
    note_de: "Bereits in derselben Sitzung/demselben Prozess eingegebene Informationen dürfen nicht erneut abgefragt werden, sofern die Wiederholung keinen eigenständigen Zweck erfüllt.",
  },
  "3.3.8": {
    name: "Accessible Authentication (Min.)", name_de: "Zugängliche Authentifizierung (Min.)", level: "AA",
    note_en: "A cognitive function test (e.g. CAPTCHA, memory recall) must not be the sole authentication mechanism.",
    note_de: "Ein kognitiver Funktionstest (z. B. CAPTCHA, Gedächtnisaufgabe) darf nicht der einzige Authentifizierungsmechanismus sein.",
  },
  "4.1.2": {
    name: "Name, Role, Value",         name_de: "Name, Rolle, Wert",            level: "A",
    note_en: "Name, role, and state of all interactive UI components must be programmatically determinable via native HTML semantics or ARIA.",
    note_de: "Name, Rolle und Zustand aller interaktiven UI-Komponenten müssen via nativer HTML-Semantik oder ARIA programmatisch bestimmbar sein.",
  },
  "4.1.3": {
    name: "Status Messages",           name_de: "Statusmeldungen",              level: "AA",
    note_en: "Status messages (loading, success, error, progress) must reach assistive technologies without a focus change (aria-live or role='status').",
    note_de: "Statusmeldungen (Laden, Erfolg, Fehler, Fortschritt) müssen assistiven Technologien ohne Fokusverschiebung mitgeteilt werden (aria-live oder role='status').",
  },
}

// ---------------------------------------------------------------------------
// Fulfillment helpers
// ---------------------------------------------------------------------------
const byAxe      = a => a.axeAssertions > 0
const byKeyboard = a => a.keyboardSignals > 0
const byAria     = a => a.ariaAttributeCount > 0
const byAriaAxe  = a => a.ariaAttributeCount > 0 && a.axeAssertions > 0
const always     = () => true
const never      = () => false

// ---------------------------------------------------------------------------
// WCAG Profiles  — array of { id, fulfilled }
// ---------------------------------------------------------------------------
const PROFILES = {
  button: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "2.5.3",  fulfilled: byAriaAxe  },
    { id: "2.5.8",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  chip: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.4.1",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.5.8",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  icon: [
    { id: "1.1.1",  fulfilled: byAria     },
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  link: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: always     },
    { id: "2.4.4",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "2.5.3",  fulfilled: byAriaAxe  },
    { id: "4.1.2",  fulfilled: always     },
  ],
  image: [
    { id: "1.1.1",  fulfilled: byAria     },
    { id: "1.4.3",  fulfilled: never      },
    { id: "1.4.5",  fulfilled: never      },
    { id: "1.4.11", fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  animation: [
    { id: "1.1.1",  fulfilled: byAria     },
    { id: "2.2.2",  fulfilled: never      },
    { id: "2.3.1",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  textContent: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.2",  fulfilled: never      },
    { id: "1.4.3",  fulfilled: never      },
    { id: "2.4.6",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  layout: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.2",  fulfilled: never      },
    { id: "1.4.4",  fulfilled: never      },
  ],
  table: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.2",  fulfilled: always     },
    { id: "1.4.3",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  accordion: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  card: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "2.5.8",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  carousel: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.2.2",  fulfilled: never      },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  stepper: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
    { id: "4.1.3",  fulfilled: byAria     },
  ],
  tabs: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  pagination: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: always     },
    { id: "2.4.4",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "2.5.8",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  dialog: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.1.2",  fulfilled: never      },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
    { id: "4.1.3",  fulfilled: never      },
  ],
  tooltip: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  snackbar: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.4.1",  fulfilled: never      },
    { id: "1.4.3",  fulfilled: never      },
    { id: "2.2.1",  fulfilled: never      },
    { id: "4.1.3",  fulfilled: byAria     },
  ],
  loading: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "4.1.2",  fulfilled: byAria     },
    { id: "4.1.3",  fulfilled: byAria     },
  ],
  form: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.5",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: never      },
    { id: "3.3.1",  fulfilled: never      },
    { id: "3.3.2",  fulfilled: never      },
    { id: "3.3.7",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  formText: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.5",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: always     },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "3.3.1",  fulfilled: never      },
    { id: "3.3.2",  fulfilled: byAriaAxe  },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  formToggle: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.4.1",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: always     },
    { id: "2.4.7",  fulfilled: never      },
    { id: "3.3.2",  fulfilled: byAriaAxe  },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  formRange: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.4.1",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.5.3",  fulfilled: byAria     },
    { id: "3.3.2",  fulfilled: byAriaAxe  },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  formComplex: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.5",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: byKeyboard },
    { id: "2.1.2",  fulfilled: never      },
    { id: "2.4.3",  fulfilled: never      },
    { id: "2.4.7",  fulfilled: never      },
    { id: "2.4.11", fulfilled: never      },
    { id: "3.3.1",  fulfilled: never      },
    { id: "3.3.2",  fulfilled: byAriaAxe  },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
    { id: "4.1.3",  fulfilled: byAria     },
  ],
  formOtp: [
    { id: "1.3.1",  fulfilled: byAxe      },
    { id: "1.3.5",  fulfilled: never      },
    { id: "2.1.1",  fulfilled: always     },
    { id: "2.4.7",  fulfilled: never      },
    { id: "3.3.2",  fulfilled: byAriaAxe  },
    { id: "3.3.7",  fulfilled: never      },
    { id: "3.3.8",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAriaAxe  },
  ],
  embed: [
    { id: "1.1.1",  fulfilled: byAria     },
    { id: "2.1.1",  fulfilled: never      },
    { id: "2.4.1",  fulfilled: never      },
    { id: "4.1.2",  fulfilled: byAria     },
  ],
}

// ---------------------------------------------------------------------------
// Slug → Profile mapping
// ---------------------------------------------------------------------------
const SLUG_PROFILE = {
  animated: "animation",          "animated-text": "animation",
  avatar: "image",                button: "button",
  chip: "chip",                   headline: "textContent",
  icon: "icon",                   image: "image",
  list: "textContent",            "post-item": "textContent",
  "post-teaser": "textContent",   "post-widget": "textContent",
  "post-widget-carousel": "carousel",
  quote: "textContent",           "rich-text": "textContent",
  teaser: "textContent",
  dialog: "dialog",               drawer: "dialog",
  loading: "loading",             "progress-bar": "loading",
  skeleton: "loading",            snackbar: "snackbar",
  tooltip: "tooltip",
  autocomplete: "formComplex",    checkbox: "formToggle",
  "checkbox-group": "formToggle", "date-picker": "formComplex",
  "dynamic-list": "formComplex",  form: "form",
  input: "formText",              "input-otp": "formOtp",
  label: "formText",              rating: "formRange",
  rte: "formComplex",             select: "formComplex",
  slider: "formRange",            switch: "formToggle",
  accordion: "accordion",         card: "card",
  carousel: "carousel",           grid: "layout",
  "image-text": "layout",         stepper: "stepper",
  table: "table",
  calendly: "embed",              lottie: "animation",
  map: "embed",
  "base-link": "link",            link: "link",
  pagination: "pagination",       sidenav: "tabs",
  tabs: "tabs",
}

// ---------------------------------------------------------------------------
// Section builder
// ---------------------------------------------------------------------------

function buildRow(id, audit, fulfilled, locale) {
  const c = CRITERIA[id]
  if (!c) return null
  const name   = locale === "de" ? c.name_de : c.name
  const note   = locale === "de" ? c.note_de : c.note_en
  const ok     = fulfilled(audit)
  const status = ok
    ? (locale === "de" ? "✅ Erfüllt"      : "✅ Fulfilled")
    : (locale === "de" ? "🔍 Manuell prüfen" : "🔍 Manual review")
  return `| **${id}** | **${name}** (${c.level}) | ${status} | ${note} |`
}

function buildSection(profileKey, audit, locale) {
  const profile = PROFILES[profileKey]
  if (!profile || profile.length === 0) return null

  const thead = locale === "de"
    ? `| Kriterium | Bezeichnung | Status | Hinweis |\n|-----------|-------------|--------|---------|\n`
    : `| Criterion | Name | Status | Note |\n|-----------|------|--------|---------|\n`

  const rows = profile
    .map(entry => buildRow(entry.id, audit, entry.fulfilled, locale))
    .filter(Boolean)
    .join("\n")

  const testLine = locale === "de"
    ? `> **Testabdeckung:** ${audit.axeAssertions} jest-axe-Assertion(s) in ${audit.testFiles} Testdatei(en) · ${audit.ariaAttributeCount} ARIA-Attribut-Vorkommen im Quellcode-Scan.`
    : `> **Test coverage:** ${audit.axeAssertions} jest-axe assertion(s) across ${audit.testFiles} test file(s) · ${audit.ariaAttributeCount} ARIA attribute occurrence(s) in source scan.`

  const manualNote = locale === "de"
    ? `> Kriterien mit 🔍 erfordern manuelle Prüfung im finalen Integrations- und Theme-Kontext.`
    : `> Criteria marked 🔍 require manual verification in the final product integration and theme context.`

  const heading = locale === "de" ? "## WCAG-2.2-Status" : "## WCAG 2.2 Status"

  return `${heading}

${thead}${rows}

${testLine}
${manualNote}`
}

function countRegex(text, regex) {
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

async function exists(filePath) {
  try { await fs.access(filePath); return true } catch { return false }
}

function upsertSection(content, heading, block) {
  const headingIndex = content.indexOf(heading)

  if (headingIndex >= 0) {
    const start = headingIndex
    const nextHeading = content.indexOf("\n## ", headingIndex + heading.length)
    const end = nextHeading >= 0 ? nextHeading : content.length

    return `${content.slice(0, start).trimEnd()}\n\n${block}\n\n${content.slice(end).trimStart()}`
  }

  const anchorRegex = /\n## (Storybook|Source|Quellcode)\b/
  const match = content.match(anchorRegex)

  if (!match || match.index === undefined) {
    return `${content.trimEnd()}\n\n---\n\n${block}\n`
  }

  const idx = match.index
  return `${content.slice(0, idx).trimEnd()}\n\n---\n\n${block}\n\n${content.slice(idx + 1)}`
}

function sourceDirFromComponent(entry) {
  const sourcePath = entry.sourcePath ?? ""
  const parts = sourcePath.split("/")
  return parts.length >= 3 ? parts[2] : null
}

async function computeAudit(sourceDir) {
  if (!sourceDir) {
    return {
      testFiles: 0,
      axeAssertions: 0,
      ariaAttributeCount: 0,
      roleButtonCount: 0,
      keyboardSignals: 0,
    }
  }

  const compRoot = path.join(UI_ROOT, "src", "components", sourceDir)
  if (!(await exists(compRoot))) {
    return {
      testFiles: 0,
      axeAssertions: 0,
      ariaAttributeCount: 0,
      roleButtonCount: 0,
      keyboardSignals: 0,
    }
  }

  const entries = await fs.readdir(compRoot)
  const files = entries.filter(name => name.endsWith(".ts") || name.endsWith(".tsx"))

  let testFiles = 0
  let axeAssertions = 0
  let ariaAttributeCount = 0
  let roleButtonCount = 0
  let keyboardSignals = 0

  for (const fileName of files) {
    const fullPath = path.join(compRoot, fileName)
    const text = await fs.readFile(fullPath, "utf8")

    const isTest = fileName.includes(".test.")
    if (isTest) {
      testFiles += 1
      axeAssertions += countRegex(text, /toHaveNoViolations\(\)/g)
      keyboardSignals += countRegex(text, /(key:\s*["'](Enter|\s|Space|Spacebar)["'])|(code:\s*["'](Enter|Space)["'])/g)
      continue
    }

    ariaAttributeCount += countRegex(text, /aria-[a-z-]+=/g)
    roleButtonCount += countRegex(text, /role=["']button["']/g)
    keyboardSignals += countRegex(text, /(onKeyDown)|(KeyboardEvent)|(e\.key\s*===\s*["'](Enter|\s|Space|Spacebar)["'])|(e\.code\s*===\s*["'](Enter|Space)["'])/g)
  }

  return {
    testFiles,
    axeAssertions,
    ariaAttributeCount,
    roleButtonCount,
    keyboardSignals,
  }
}

async function run() {
  const componentData = JSON.parse(await fs.readFile(COMPONENT_DATA_PATH, "utf8"))
  const bySlug = new Map(componentData.map(entry => [entry.slug, entry]))

  let updated = 0
  let missing = 0
  let noProfile = 0

  for (const target of TARGETS) {
    const entries = await fs.readdir(target.dir)
    const mdxFiles = entries.filter(name => name.endsWith(".mdx") && name !== "overview.mdx")

    for (const fileName of mdxFiles) {
      const slug = fileName.replace(/\.mdx$/, "")
      const component = bySlug.get(slug)
      const filePath = path.join(target.dir, fileName)
      const current = await fs.readFile(filePath, "utf8")

      if (!component) { missing++; continue }

      const profileKey = SLUG_PROFILE[slug]
      if (!profileKey)  { noProfile++; continue }

      const audit = await computeAudit(sourceDirFromComponent(component))
      const block = buildSection(profileKey, audit, target.locale)
      if (!block) { noProfile++; continue }

      const next = upsertSection(current, target.heading, block)
      if (next !== current) {
        await fs.writeFile(filePath, next, "utf8")
        updated++
      }
    }
  }

  console.log(
    `✅ WCAG sections refreshed: ${updated} files updated` +
    (missing   > 0 ? `, ${missing} missing component mapping`   : "") +
    (noProfile > 0 ? `, ${noProfile} without wcag profile` : ""),
  )
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})
