import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import styles from './StorybookEmbed.module.css';
import { STORYBOOK_URL } from '../constants';
import { withStorybookTheme } from '../utils/storybookThemeUrl';

interface StorybookEmbedProps {
  /** Full Storybook story ID, e.g. "prokodo-common-button--default" */
  id: string;
  /** iframe height in pixels (default 300) */
  height?: number;
  /** Accessible title for the iframe */
  title?: string;
}

/**
 * Embeds a live Storybook story as an iframe directly inside a doc page.
 * Automatically mirrors the current docs theme (light/dark) into the iframe
 * via Storybook's globals API: &globals=theme:dark / &globals=theme:light
 */
export function StorybookEmbed({
  id,
  height = 300,
  title = 'Live component preview',
}: StorybookEmbedProps): ReactNode {
  // Start with 'light'; useEffect corrects from DOM and tracks changes.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const src = `${STORYBOOK_URL}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
  const storyUrl = withStorybookTheme(`${STORYBOOK_URL}/?path=/story/${id}`, theme);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.label}>Live Preview</span>
        <a
          href={storyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label="Open in Storybook"
        >
          Open in Storybook ↗
        </a>
      </div>
      <iframe
        key={`${id}-${theme}`}
        src={src}
        title={title}
        className={styles.frame}
        style={{ height }}
        loading="lazy"
        allow="clipboard-write"
      />
    </div>
  );
}
