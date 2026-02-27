import { useEffect, useState, type ReactNode } from 'react';
import DocLink from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import { Icon, type IconName } from '@prokodo/ui/icon';
import { STORYBOOK_URL, PROKODO_URL, GITHUB_URL, GITHUB_UI_URL, NPM_URL, LINKEDIN_URL } from '../../constants';
import {
  readDocsThemeFromDom,
  withStorybookTheme,
  type DocsTheme,
} from '../../utils/storybookThemeUrl';

import styles from './index.module.css';

// ─── Footer data ──────────────────────────────────────────────────────────────

type FooterLink =
  | { label: string; to: string; href?: never }
  | { label: string; href: string; to?: never };

const SOCIALS: Array<{ name: IconName; href: string; labelId: string; defaultLabel: string }> = [
  {
    name: 'GithubIcon',
    href: GITHUB_UI_URL,
    labelId: 'prokodo.footer.social.github',
    defaultLabel: 'GitHub',
  },
  {
    name: 'Linkedin01Icon',
    href: LINKEDIN_URL,
    labelId: 'prokodo.footer.social.linkedin',
    defaultLabel: 'LinkedIn',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer(): ReactNode {
  const [theme, setTheme] = useState<DocsTheme>('light');

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(readDocsThemeFromDom());
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const sections: Array<{ titleId: string; defaultTitle: string; links: FooterLink[] }> = [
    {
      titleId: 'prokodo.footer.section.docs',
      defaultTitle: 'Docs',
      links: [
        {
          label: translate({
            id: 'prokodo.footer.link.gettingStarted',
            message: 'Getting Started',
          }),
          to: '/docs/getting-started/installation',
        },
        {
          label: translate({ id: 'prokodo.footer.link.components', message: 'Components' }),
          to: '/docs/components/overview',
        },
        {
          label: translate({ id: 'prokodo.footer.link.designTokens', message: 'Design Tokens' }),
          to: '/docs/design-tokens',
        },
        {
          label: translate({ id: 'prokodo.footer.link.aicPattern', message: 'AIC Pattern' }),
          to: '/docs/aic-pattern',
        },
        {
          label: translate({ id: 'prokodo.footer.link.changelog', message: 'Changelog' }),
          to: '/docs/changelog',
        },
      ],
    },
    {
      titleId: 'prokodo.footer.section.components',
      defaultTitle: 'Components',
      links: [
        { label: 'Button', to: '/docs/components/button' },
        { label: 'Card', to: '/docs/components/card' },
        { label: 'Input', to: '/docs/components/input' },
        { label: 'Dialog', to: '/docs/components/dialog' },
        { label: 'Headline', to: '/docs/components/headline' },
        { label: 'Icon', to: '/docs/components/icon' },
        { label: 'Chip', to: '/docs/components/chip' },
        { label: 'Snackbar', to: '/docs/components/snackbar' },
      ],
    },
    {
      titleId: 'prokodo.footer.section.prokodo',
      defaultTitle: 'prokodo',
      links: [
        {
          label: translate({ id: 'prokodo.footer.link.storybook', message: 'Storybook' }),
          href: withStorybookTheme(STORYBOOK_URL, theme),
        },
        {
          label: translate({ id: 'prokodo.footer.link.npm', message: 'npm' }),
          href: NPM_URL,
        },
        {
          label: translate({ id: 'prokodo.footer.link.website', message: 'Website' }),
          href: PROKODO_URL,
        },
        {
          label: translate({ id: 'prokodo.footer.link.github', message: 'GitHub' }),
          href: GITHUB_URL,
        },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brand}>
          <a
            href={PROKODO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.brandLogoLink}
          >
            <img src="/img/prokodo-logo.webp" alt="prokodo" className={styles.brandLogoLight} />
            <img
              src="/img/prokodo-logo-white.webp"
              alt="prokodo"
              className={styles.brandLogoDark}
            />
          </a>
          <p className={styles.tagline}>
            <Translate id="prokodo.footer.tagline">
              A fully typed, AIC-ready React component library for prokodo projects.
            </Translate>
          </p>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={translate({ id: s.labelId, message: s.defaultLabel })}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name={s.name} size="md" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className={styles.linkGroups}>
          {sections.map((section) => (
            <div key={section.titleId} className={styles.section}>
              <div className={styles.sectionTitle}>
                <Translate id={section.titleId}>{section.defaultTitle}</Translate>
              </div>
              <ul className={styles.linkList}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <DocLink to={link.to} href={link.href} className={styles.footerLink}>
                      {link.label}
                    </DocLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          {translate(
            { id: 'prokodo.footer.copyright', message: 'Copyright © {year} prokodo.' },
            { year: String(new Date().getFullYear()) },
          )}
        </p>
        <div className={styles.bottomLinks}>
          <DocLink href={`${PROKODO_URL}/en/legal/`} className={styles.bottomLink}>
            <Translate id="prokodo.footer.link.legal">Legal</Translate>
          </DocLink>
          <DocLink href={`${PROKODO_URL}/en/legal/imprint/`} className={styles.bottomLink}>
            <Translate id="prokodo.footer.link.imprint">Imprint</Translate>
          </DocLink>
        </div>
      </div>
    </footer>
  );
}
