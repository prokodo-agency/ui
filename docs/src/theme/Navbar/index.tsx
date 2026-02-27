import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import BrowserOnly from '@docusaurus/BrowserOnly';
import DocLink from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';
import { Icon } from '@prokodo/ui/icon';
import styles from './index.module.css';
import { STORYBOOK_URL, GITHUB_UI_URL } from '../../constants';
import {
  readDocsThemeFromDom,
  withStorybookTheme,
  type DocsTheme,
} from '../../utils/storybookThemeUrl';

type NavItem = { label: string } & ({ to: string; href?: never } | { href: string; to?: never });

// Docusaurus localStorage key for persisting color mode
const DOCUSAURUS_COLOR_MODE_KEY = '@docusaurus/color-mode';

/**
 * Reads and toggles Docusaurus theme via DOM + localStorage directly — no
 * useColorMode() hook, so it works safely inside BrowserOnly without needing
 * the ColorModeProvider React context to be present on SSR.
 */
function ThemeToggle(): ReactNode {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.getAttribute('data-theme') === 'dark');
    const observer = new MutationObserver(() => {
      setIsDark(root.getAttribute('data-theme') === 'dark');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(DOCUSAURUS_COLOR_MODE_KEY, JSON.stringify({ colorMode: next }));
    } catch {
      // storage unavailable — ignore
    }
    setIsDark(!isDark);
  };

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={translate({
        id: 'prokodo.navbar.themeToggle.ariaLabel',
        message: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      })}
    >
      <Icon name={isDark ? 'Sun01Icon' : 'Moon02Icon'} size="sm" />
    </button>
  );
}

export default function Navbar(): ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<DocsTheme>('light');
  const {
    i18n: { currentLocale, locales },
  } = useDocusaurusContext();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(readDocsThemeFromDom());
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const otherLocale = locales.find((l) => l !== currentLocale);
  const pathWithoutLocale = (location.pathname || '/').replace(/^\/de(?=\/|$)/, '') || '/';
  const normalizedPath = pathWithoutLocale || '/';
  const otherLocalePath = otherLocale
    ? `${otherLocale === 'de' ? '/de' : ''}${normalizedPath}`
    : undefined;
  const otherLocaleUrl = otherLocalePath
    ? `${otherLocalePath}${location.search || ''}${location.hash || ''}`
    : undefined;

  const logoSrc = useBaseUrl('/img/prokodo-logo-icon.webp');

  const navLinks: NavItem[] = [
    { label: translate({ id: 'prokodo.navbar.link.docs', message: 'Docs' }), to: '/docs/' },
    {
      label: translate({ id: 'prokodo.navbar.link.storybook', message: 'Storybook' }),
      href: withStorybookTheme(STORYBOOK_URL, theme),
    },
  ];

  return (
    <nav className={clsx('navbar', styles.navbar)}>
      <div className={styles.inner}>
        {/* Brand + nav links */}
        <div className={styles.leftGroup}>
          <DocLink to="/" className={styles.brand}>
            <img src={logoSrc} alt="prokodo" className={styles.brandLogo} />
            <span className={styles.brandName}>UI</span>
          </DocLink>
          <ul className={styles.navLinks}>
            {navLinks.map((item) => (
              <li key={item.label}>
                <DocLink to={item.to} href={item.href} className={styles.navLink}>
                  {item.label}
                </DocLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          {otherLocale && otherLocaleUrl && (
            <a href={otherLocaleUrl} className={styles.localeToggle}>
              {otherLocale.toUpperCase()}
            </a>
          )}

          {/* BrowserOnly: prevents useColorMode SSG crash */}
          <BrowserOnly fallback={<span className={styles.themeToggle} />}>
            {() => <ThemeToggle />}
          </BrowserOnly>

          <a
            href={GITHUB_UI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.themeToggle}
            aria-label={translate({ id: 'prokodo.navbar.github.ariaLabel', message: 'GitHub' })}
          >
            <Icon name="GithubIcon" size="sm" />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <Icon name={mobileOpen ? 'Cancel01Icon' : 'Menu01Icon'} size="md" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((item) => (
            <DocLink
              key={item.label}
              to={item.to}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </DocLink>
          ))}
          <DocLink
            href={GITHUB_UI_URL}
            className={styles.mobileLink}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="GithubIcon" size="xs" />{' '}
            <Translate id="prokodo.navbar.mobile.github">GitHub</Translate>
          </DocLink>
          {otherLocale && otherLocaleUrl && (
            <a
              href={otherLocaleUrl}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {otherLocale === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
