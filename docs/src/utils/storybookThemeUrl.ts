export type DocsTheme = 'light' | 'dark';

const STORYBOOK_PREFIXES = [
  '/storybook',
  'https://ui.prokodo.com/storybook',
  'http://localhost:6006',
];

export function readDocsThemeFromDom(): DocsTheme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function withStorybookTheme(url: string, theme: DocsTheme): string {
  if (!STORYBOOK_PREFIXES.some((prefix) => url.startsWith(prefix))) {
    return url;
  }

  const [withoutHash, hash = ''] = url.split('#');
  let next = withoutHash;

  if (/[?&]globals=/.test(next)) {
    next = next.replace(/([?&])globals=[^&]*/g, `$1globals=theme:${theme}`);
  } else {
    next = `${next}${next.includes('?') ? '&' : '?'}globals=theme:${theme}`;
  }

  return hash ? `${next}#${hash}` : next;
}