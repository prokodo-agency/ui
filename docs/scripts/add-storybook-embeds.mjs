/**
 * Inserts <StorybookEmbed id="..." /> into every component MDX page,
 * right after the first closing code fence that follows ## Overview.
 *
 * Run from prokodo-ui root:  node docs/scripts/add-storybook-embeds.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dir, '../docs/components');

// ──────────────────────────────────────────────────────────
// Filename (without .mdx) → Storybook story ID
// ──────────────────────────────────────────────────────────
const STORY_IDS = {
  'accordion':             'prokodo-common-accordion--default',
  'animated-text':         'prokodo-common-animatedtext--default',
  'animated':              'prokodo-common-animated--default',
  'autocomplete':          'prokodo-form-autocomplete--default',
  'avatar':                'prokodo-common-avatar--default',
  'base-link':             'prokodo-common-baselink--default',
  'button':                'prokodo-common-button--default',
  'calendly':              'prokodo-service-calendly--default',
  'card':                  'prokodo-common-card--default',
  'carousel':              'prokodo-common-carousel--default',
  'checkbox-group':        'prokodo-form-checkboxgroup--default',
  'checkbox':              'prokodo-form-checkbox--default',
  'chip':                  'prokodo-common-chip--default',
  'date-picker':           'prokodo-form-datepicker--default',
  'dialog':                'prokodo-common-dialog--default',
  'drawer':                'prokodo-common-drawer--default',
  'dynamic-list':          'prokodo-form-dynamiclist--default',
  'form':                  'prokodo-form-form--default',
  'grid':                  'prokodo-common-grid--default',
  'headline':              'prokodo-common-headline--default',
  'icon':                  'prokodo-common-icon--default',
  'image-text':            'prokodo-common-imagetext--default',
  'image':                 'prokodo-common-image--default',
  'input-otp':             'prokodo-form-inputotp--default',
  'input':                 'prokodo-form-input--default',
  'label':                 'prokodo-form-label--default',
  'link':                  'prokodo-common-link--default',
  'list':                  'prokodo-common-list--default',
  'loading':               'prokodo-common-loading--default',
  'lottie':                'prokodo-common-lottie--default',
  'map':                   'prokodo-service-map--default',
  'pagination':            'prokodo-navigation-pagination--default',
  'post-item':             'prokodo-blog-postitem--default',
  'post-teaser':           'prokodo-blog-postteaser--default',
  'post-widget-carousel':  'prokodo-blog-postwidgetcarousel--default',
  'post-widget':           'prokodo-blog-postwidget--default',
  'progress-bar':          'prokodo-common-progressbar--default',
  'quote':                 'prokodo-common-quote--default',
  'rating':                'prokodo-form-rating--default',
  'rich-text':             'prokodo-common-richtext--default',
  'rte':                   'prokodo-form-rte--default',
  'select':                'prokodo-form-select--default',
  'sidenav':               'prokodo-navigation-sidenav--default',
  'skeleton':              'prokodo-common-skeleton--default',
  'slider':                'prokodo-form-slider--default',
  'snackbar':              'prokodo-feedback-snackbar--default',
  'stepper':               'prokodo-common-stepper--default',
  'switch':                'prokodo-form-switch--default',
  'table':                 'prokodo-common-table--default',
  'tabs':                  'prokodo-navigation-tabs--default',
  'teaser':                'prokodo-common-teaser--default',
  'tooltip':               'prokodo-feedback-tooltip--default',
};

// Heights that diverge from the 300px default
const CUSTOM_HEIGHTS = {
  'calendly':             520,
  'carousel':             380,
  'dialog':               380,
  'drawer':               420,
  'form':                 420,
  'image':                340,
  'image-text':           380,
  'lottie':               340,
  'map':                  460,
  'post-teaser':          380,
  'post-widget':          340,
  'post-widget-carousel': 380,
  'rte':                  380,
  'sidenav':              380,
  'slider':               240,
  'stepper':              260,
  'table':                320,
  'teaser':               380,
};

let updated = 0;
let skipped = 0;

for (const [slug, storyId] of Object.entries(STORY_IDS)) {
  const filePath = join(COMPONENTS_DIR, `${slug}.mdx`);

  let src;
  try {
    src = readFileSync(filePath, 'utf8');
  } catch {
    console.warn(`  SKIP (not found): ${slug}.mdx`);
    skipped++;
    continue;
  }

  // Already patched?
  if (src.includes('<StorybookEmbed')) {
    console.log(`  ALREADY: ${slug}.mdx`);
    skipped++;
    continue;
  }

  // ── Find the closing ``` that ends the first code block after ## Overview ──
  const overviewIdx = src.indexOf('## Overview');
  if (overviewIdx === -1) {
    console.warn(`  SKIP (no Overview): ${slug}.mdx`);
    skipped++;
    continue;
  }

  // Find the opening fence start after ## Overview
  const firstFenceOpen = src.indexOf('\n```', overviewIdx);
  if (firstFenceOpen === -1) {
    console.warn(`  SKIP (no code fence): ${slug}.mdx`);
    skipped++;
    continue;
  }

  // Skip past the opening fence line to find the closing one
  const afterOpenFence = firstFenceOpen + 1; // skip the \n
  const closingFenceIdx = src.indexOf('\n```\n', afterOpenFence);
  if (closingFenceIdx === -1) {
    console.warn(`  SKIP (no closing fence): ${slug}.mdx`);
    skipped++;
    continue;
  }

  // Insert point = right after the closing fence line (closingFenceIdx + "\n```\n".length - 1)
  const insertAt = closingFenceIdx + '\n```'.length; // point at the \n after ```

  const height = CUSTOM_HEIGHTS[slug];
  const heightAttr = height ? ` height={${height}}` : '';
  const embedTag = `\n\n<StorybookEmbed id="${storyId}"${heightAttr} />\n`;

  const newSrc = src.slice(0, insertAt) + embedTag + src.slice(insertAt);
  writeFileSync(filePath, newSrc, 'utf8');
  console.log(`  PATCHED: ${slug}.mdx  →  ${storyId}`);
  updated++;
}

console.log(`\nDone: ${updated} patched, ${skipped} skipped.`);
