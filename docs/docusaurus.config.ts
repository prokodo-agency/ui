import { themes as prismThemes } from 'prism-react-renderer';
import webpack from 'webpack';
import path from 'node:path';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const STORYBOOK_DOCS_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:6006'
    : 'https://ui.prokodo.com/storybook';

const config: Config = {
  title: 'prokodo UI',
  tagline: 'A fully typed, AIC-ready React component library for prokodo projects.',
  favicon: 'img/favicon.ico',

  url: 'https://ui.prokodo.com',
  baseUrl: '/',

  organizationName: 'prokodo-agency',
  projectName: 'ui',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr', htmlLang: 'en' },
      de: { label: 'Deutsch', direction: 'ltr', htmlLang: 'de' },
    },
  },

  // Load brand fonts from Google Fonts
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&family=Open+Sans:wght@400;500;700&display=swap',
      },
    },
  ],

  plugins: [
    function defineProcessEnv() {
      return {
        name: 'define-process-env',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        configureWebpack(_config: any) {
          return {
            plugins: [
              new webpack.DefinePlugin({
                // @prokodo/ui uses process.env.MODE for environment detection.
                // Force 'production' so Icon always loads SVGs from the jsDelivr CDN
                // rather than a local /assets/icons/ path that doesn't exist in Docusaurus.
                'process.env': JSON.stringify({ MODE: 'production' }),
              }),
              // Replace the dist createIsland helper with a Docusaurus-safe shim
              // that skips the server-side loadLazy() preload call.  The preload
              // tries to require('./Foo.lazy.js') inside the SSG server bundle
              // (a path that doesn't exist there) and breaks the build.
              new webpack.NormalModuleReplacementPlugin(
                /dist[/\\]helpers[/\\]createIsland\.js$/,
                path.resolve(__dirname, 'src/_shims/createIsland.js'),
              ),
            ],
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './src/sidebars.ts',
          editUrl: 'https://github.com/prokodo-agency/ui/edit/main/docs/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'latest',
              badge: true,
              banner: 'none',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/prokodo-og.png',

    metadata: [
      {
        name: 'keywords',
        content:
          'prokodo UI, React component library, TypeScript, design system, AIC pattern, Next.js, Storybook',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@prokodo_agency' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'prokodo UI Docs' },
    ],

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'prokodo UI',
      logo: {
        alt: 'prokodo logo',
        src: 'img/prokodo-logo-icon.webp',
        srcDark: 'img/prokodo-logo-icon.webp',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'uiSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: STORYBOOK_DOCS_URL,
          label: 'Storybook',
          position: 'right',
        },
        {
          href: 'https://github.com/prokodo-agency/ui',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started/installation' },
            { label: 'Components', to: '/docs/components/overview' },
            { label: 'Design Tokens', to: '/docs/design-tokens' },
            { label: 'AIC Pattern', to: '/docs/aic-pattern' },
          ],
        },
        {
          title: 'Components',
          items: [
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
          title: 'prokodo',
          items: [
            { label: 'Storybook', href: STORYBOOK_DOCS_URL },
            { label: 'npm', href: 'https://www.npmjs.com/package/@prokodo/ui' },
            { label: 'Website', href: 'https://www.prokodo.com' },
            { label: 'GitHub', href: 'https://github.com/prokodo-agency' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} prokodo. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript'],
    },

    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
