#!/usr/bin/env node
/**
 * generate-overview.mjs
 *
 * Generates docs/docs/components/overview.mdx from docs/docs/_data/components.json.
 * Plain ESM — no ts-node, no --loader flags, no import assertions.
 *
 * Usage:
 *   node scripts/generate-overview.mjs
 *   pnpm generate
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Load data ────────────────────────────────────────────────────────────────

const data = JSON.parse(
  await fs.readFile(
    new URL('../docs/_data/components.json', import.meta.url),
    'utf8',
  ),
);

// ─── Validate storybookPath for every entry ───────────────────────────────────

for (const entry of data) {
  const { slug, storybookPath: p } = entry;

  if (!/^\/(docs|story)\//.test(p))
    throw new Error(`${slug}: storybookPath must start with /docs/ or /story/ — got: ${p}`);

  if (/\s/.test(p))
    throw new Error(`${slug}: storybookPath must not contain whitespace — got: ${p}`);

  if (/#/.test(p))
    throw new Error(`${slug}: storybookPath must not contain # — got: ${p}`);

  if (/^https?:|\/\//.test(p))
    throw new Error(
      `${slug}: storybookPath must be a relative path, not an absolute URL — got: ${p}`,
    );

  // Structural check — throws if p makes the URL invalid
  new URL('https://ui.prokodo.com/?path=' + p);
}

// ─── Category order ───────────────────────────────────────────────────────────

const CATEGORY_ORDER = ['form', 'layout', 'navigation', 'content', 'feedback', 'media', 'utility'];

const sorted = [...data].sort((a, b) => {
  const catDiff = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
  return catDiff !== 0 ? catDiff : a.name.localeCompare(b.name);
});

// ─── Badge helpers ────────────────────────────────────────────────────────────

function typeBadge(component) {
  if (component.slug === 'lottie' || component.slug === 'map') {
    return '`Client`';
  }

  switch (component.aic) {
    case 'server':
    case 'client':
    case 'lazy':
      return '`AIC`';
    case 'none':
      return '`RSC`';
    default:
      return '`RSC`';
  }
}

function cssBadge(css) {
  switch (css) {
    case 'module':
      return '`module`';
    case 'tokens':
      return '`tokens`';
    default:
      return '—';
  }
}

// ─── Table rows ───────────────────────────────────────────────────────────────

function categoryLabel(category, locale) {
  if (locale !== 'de') {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  const deMap = {
    form: 'Form',
    layout: 'Layout',
    navigation: 'Navigation',
    content: 'Inhalt',
    feedback: 'Feedback',
    media: 'Media',
    utility: 'Utility',
  };

  return deMap[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

function buildRows(entries, locale = 'en') {
  return entries
    .map((c) => {
      const sbUrl = `https://ui.prokodo.com/?path=${c.storybookPath}`;
      const catLabel = categoryLabel(c.category, locale);
      const propsLabel = c.hasPropsType ? '✅' : '—';
      return (
        `<tr class="docs-table__tr">` +
        `<td class="docs-table__td"><a href="/docs/components/${c.slug}">\`${c.name}\`</a></td>` +
        `<td class="docs-table__td">${catLabel}</td>` +
        `<td class="docs-table__td">${typeBadge(c)}</td>` +
        `<td class="docs-table__td">${cssBadge(c.css)}</td>` +
        `<td class="docs-table__td">${propsLabel}</td>` +
        `<td class="docs-table__td"><a href="${sbUrl}" target="_blank" rel="noopener noreferrer">↗ Storybook</a></td>` +
        `</tr>`
      );
    })
    .join('\n');
}

// ─── MDX output ───────────────────────────────────────────────────────────────

const rowsEn = buildRows(sorted, 'en');
const rowsDe = buildRows(sorted, 'de');
const total = sorted.length;

const mdxEn = `---
id: overview
title: Component Overview
sidebar_label: Overview
description: Full matrix of all ${total} prokodo UI components — category, type, CSS approach, and Storybook links.
---

# Component Overview

All **${total} components** in \`@prokodo/ui\`, sorted by category then name.

Each component ships with:
- **Full TypeScript types** via \`*.model.ts\`
- **Type** column indicates the runtime model for each component
- **CSS via SCSS modules** or **design tokens**
- **Storybook** story with autodocs

---

<div class="docs-table">
  <div class="docs-table__scroll">
    <table class="docs-table__el">
      <thead class="docs-table__head">
        <tr class="docs-table__head-tr">
          <th class="docs-table__th">Component</th>
          <th class="docs-table__th">Category</th>
          <th class="docs-table__th">Type</th>
          <th class="docs-table__th">CSS</th>
          <th class="docs-table__th">Props</th>
          <th class="docs-table__th">Storybook</th>
        </tr>
      </thead>
      <tbody class="docs-table__body">
${rowsEn}
      </tbody>
    </table>
  </div>
</div>
`;

const mdxDe = `---
id: overview
title: Komponentenübersicht
sidebar_label: Übersicht
description: Vollständige Matrix aller ${total} prokodo UI-Komponenten — Kategorie, Type, CSS-Ansatz und Storybook-Links.
---

# Komponentenübersicht

Alle **${total} Komponenten** in \`@prokodo/ui\`, sortiert nach Kategorie und Name.

Jede Komponente enthält:
- **Vollständige TypeScript-Typen** über \`*.model.ts\`
- **Spalte Type** zeigt das Laufzeitmodell pro Komponente
- **CSS über SCSS-Module** oder **Design-Tokens**
- **Storybook**-Story mit Autodocs

---

<div class="docs-table">
  <div class="docs-table__scroll">
    <table class="docs-table__el">
      <thead class="docs-table__head">
        <tr class="docs-table__head-tr">
          <th class="docs-table__th">Komponente</th>
          <th class="docs-table__th">Kategorie</th>
          <th class="docs-table__th">Type</th>
          <th class="docs-table__th">CSS</th>
          <th class="docs-table__th">Props</th>
          <th class="docs-table__th">Storybook</th>
        </tr>
      </thead>
      <tbody class="docs-table__body">
${rowsDe}
      </tbody>
    </table>
  </div>
</div>
`;

// ─── Write output ─────────────────────────────────────────────────────────────

const outPathEn = path.resolve(ROOT, 'docs', 'components', 'overview.mdx');
const outPathDe = path.resolve(
  ROOT,
  'i18n',
  'de',
  'docusaurus-plugin-content-docs',
  'current',
  'components',
  'overview.mdx',
);

await fs.mkdir(path.dirname(outPathEn), { recursive: true });
await fs.mkdir(path.dirname(outPathDe), { recursive: true });
await fs.writeFile(outPathEn, mdxEn, 'utf8');
await fs.writeFile(outPathDe, mdxDe, 'utf8');

console.log(`✅  Generated ${outPathEn} (${total} components)`);
console.log(`✅  Generated ${outPathDe} (${total} components)`);
