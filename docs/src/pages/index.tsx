import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import DocLink from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import { Headline } from '@prokodo/ui/headline';
import { Button } from '@prokodo/ui/button';

import { Icon } from '@prokodo/ui/icon';
import type { IconName } from '@prokodo/ui/icon';

import styles from './index.module.css';
import { STORYBOOK_URL, NPM_URL } from '../constants';
import {
  readDocsThemeFromDom,
  withStorybookTheme,
  type DocsTheme,
} from '../utils/storybookThemeUrl';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'form' | 'display' | 'navigation' | 'feedback' | 'content' | 'service';

interface ComponentItem {
  slug: string;
  label: string;
  category: Category;
  icon: IconName;
  hoverIcon: IconName;
}

interface Feature {
  icon: IconName;
  hoverIcon: IconName;
  title: string;
  description: string;
  href: string;
}

// ─── Component data ───────────────────────────────────────────────────────────

const COMPONENTS: ComponentItem[] = [
  // ── Form ──────────────────────────────────────────────────────────────
  { slug: 'input',                label: 'Input',                 category: 'form',       icon: 'Edit01Icon',                hoverIcon: 'PencilEdit01Icon'            },
  { slug: 'select',               label: 'Select',                category: 'form',       icon: 'Select01Icon',              hoverIcon: 'ArrowDown01Icon'             },
  { slug: 'checkbox',             label: 'Checkbox',              category: 'form',       icon: 'CheckmarkSquare01Icon',     hoverIcon: 'Tick01Icon'                  },
  { slug: 'checkbox-group',       label: 'Checkbox Group',        category: 'form',       icon: 'CheckListIcon',             hoverIcon: 'CheckmarkBadge01Icon'        },
  { slug: 'switch',               label: 'Switch',                category: 'form',       icon: 'ToggleOnIcon',              hoverIcon: 'ToggleOffIcon'               },
  { slug: 'date-picker',          label: 'Date Picker',           category: 'form',       icon: 'Calendar01Icon',            hoverIcon: 'DateTimeIcon'                },
  { slug: 'slider',               label: 'Slider',                category: 'form',       icon: 'SlidersHorizontalIcon',     hoverIcon: 'SlidersVerticalIcon'         },
  { slug: 'autocomplete',         label: 'Autocomplete',          category: 'form',       icon: 'Search01Icon',              hoverIcon: 'SearchFocusIcon'             },
  { slug: 'dynamic-list',         label: 'Dynamic List',          category: 'form',       icon: 'DragDropIcon',              hoverIcon: 'Drag01Icon'                  },
  { slug: 'input-otp',            label: 'Input OTP',             category: 'form',       icon: 'PinCodeIcon',               hoverIcon: 'Key01Icon'                   },
  { slug: 'label',                label: 'Label',                 category: 'form',       icon: 'LabelIcon',                 hoverIcon: 'Tag01Icon'                   },
  { slug: 'form',                 label: 'Form',                  category: 'form',       icon: 'FileEditIcon',              hoverIcon: 'FileValidationIcon'          },
  { slug: 'rating',               label: 'Rating',                category: 'form',       icon: 'StarIcon',                  hoverIcon: 'StarHalfIcon'                },
  // ── Display ───────────────────────────────────────────────────────────
  { slug: 'button',               label: 'Button',                category: 'display',    icon: 'CursorPointer01Icon',       hoverIcon: 'CursorMagicSelection01Icon'  },
  { slug: 'card',                 label: 'Card',                  category: 'display',    icon: 'Cards01Icon',               hoverIcon: 'Cards02Icon'                 },
  { slug: 'chip',                 label: 'Chip',                  category: 'display',    icon: 'ChipIcon',                  hoverIcon: 'Chip02Icon'                  },
  { slug: 'avatar',               label: 'Avatar',                category: 'display',    icon: 'User02Icon',                hoverIcon: 'ProfileIcon'                 },
  { slug: 'icon',                 label: 'Icon',                  category: 'display',    icon: 'SparklesIcon',              hoverIcon: 'MagicWand01Icon'             },
  { slug: 'headline',             label: 'Headline',              category: 'display',    icon: 'Heading01Icon',             hoverIcon: 'TextBoldIcon'                },
  { slug: 'image',                label: 'Image',                 category: 'display',    icon: 'Image01Icon',               hoverIcon: 'ImageAdd01Icon'              },
  { slug: 'image-text',           label: 'Image + Text',          category: 'display',    icon: 'ImageCompositionIcon',      hoverIcon: 'Layout01Icon'                },
  { slug: 'animated',             label: 'Animated',              category: 'display',    icon: 'PlayCircleIcon',            hoverIcon: 'MagicWand02Icon'             },
  { slug: 'animated-text',        label: 'Animated Text',         category: 'display',    icon: 'TextSelectionIcon',         hoverIcon: 'TextVariableFrontIcon'       },
  { slug: 'lottie',               label: 'Lottie',                category: 'display',    icon: 'LottiefilesIcon',           hoverIcon: 'VideoAiIcon'                 },
  { slug: 'quote',                label: 'Quote',                 category: 'display',    icon: 'QuoteUpIcon',               hoverIcon: 'QuoteDownIcon'               },
  { slug: 'teaser',               label: 'Teaser',                category: 'display',    icon: 'Layers01Icon',              hoverIcon: 'ImageCompositionOvalIcon'    },
  // ── Navigation ────────────────────────────────────────────────────────
  { slug: 'accordion',            label: 'Accordion',             category: 'navigation', icon: 'ExpanderIcon',              hoverIcon: 'ArrowExpand01Icon'           },
  { slug: 'base-link',            label: 'Base Link',             category: 'navigation', icon: 'Link01Icon',                hoverIcon: 'LinkForwardIcon'             },
  { slug: 'link',                 label: 'Link',                  category: 'navigation', icon: 'Link02Icon',                hoverIcon: 'LinkCircleIcon'              },
  { slug: 'sidenav',              label: 'Sidenav',               category: 'navigation', icon: 'SidebarLeftIcon',           hoverIcon: 'SidebarLeft01Icon'           },
  { slug: 'carousel',             label: 'Carousel',              category: 'navigation', icon: 'CarouselHorizontalIcon',    hoverIcon: 'CarouselVerticalIcon'        },
  { slug: 'stepper',              label: 'Stepper',               category: 'navigation', icon: 'StepIntoIcon',              hoverIcon: 'Progress03Icon'              },
  { slug: 'tabs',                 label: 'Tabs',                  category: 'navigation', icon: 'LayoutTopIcon',             hoverIcon: 'LayoutBottomIcon'            },
  { slug: 'grid',                 label: 'Grid',                  category: 'navigation', icon: 'GridIcon',                  hoverIcon: 'GridViewIcon'                },
  // ── Feedback ──────────────────────────────────────────────────────────
  { slug: 'dialog',               label: 'Dialog',                category: 'feedback',   icon: 'Comment01Icon',             hoverIcon: 'BubbleChatIcon'              },
  { slug: 'drawer',               label: 'Drawer',                category: 'feedback',   icon: 'SidebarBottomIcon',         hoverIcon: 'SidebarRightIcon'            },
  { slug: 'loading',              label: 'Loading',               category: 'feedback',   icon: 'Loading01Icon',             hoverIcon: 'Loading02Icon'               },
  { slug: 'progress-bar',         label: 'Progress Bar',          category: 'feedback',   icon: 'Progress01Icon',            hoverIcon: 'Progress02Icon'              },
  { slug: 'snackbar',             label: 'Snackbar',              category: 'feedback',   icon: 'Notification01Icon',        hoverIcon: 'NotificationBubbleIcon'      },
  { slug: 'tooltip',              label: 'Tooltip',               category: 'feedback',   icon: 'CursorInfo01Icon',          hoverIcon: 'ChatDone01Icon'              },
  { slug: 'skeleton',             label: 'Skeleton',              category: 'feedback',   icon: 'LayerIcon',                 hoverIcon: 'StackStarIcon'               },
  // ── Content ───────────────────────────────────────────────────────────
  { slug: 'list',                 label: 'List',                  category: 'content',    icon: 'ListViewIcon',              hoverIcon: 'ParagraphBulletsPoint01Icon' },
  { slug: 'pagination',           label: 'Pagination',            category: 'content',    icon: 'ArrowHorizontalIcon',       hoverIcon: 'ArrowLeftRightIcon'          },
  { slug: 'post-item',            label: 'Post Item',             category: 'content',    icon: 'News01Icon',                hoverIcon: 'BookmarkAdd01Icon'           },
  { slug: 'post-teaser',          label: 'Post Teaser',           category: 'content',    icon: 'NewsIcon',                  hoverIcon: 'Note01Icon'                  },
  { slug: 'post-widget',          label: 'Post Widget',           category: 'content',    icon: 'GridTableIcon',             hoverIcon: 'LayoutTable01Icon'           },
  { slug: 'post-widget-carousel', label: 'Post Widget Carousel',  category: 'content',    icon: 'ScrollHorizontalIcon',      hoverIcon: 'RefreshIcon'                 },
  { slug: 'rich-text',            label: 'Rich Text',             category: 'content',    icon: 'ParagraphIcon',             hoverIcon: 'TextAlignLeftIcon'           },
  { slug: 'rte',                  label: 'RTE',                   category: 'content',    icon: 'PenTool01Icon',             hoverIcon: 'EditTableIcon'               },
  { slug: 'table',                label: 'Table',                 category: 'content',    icon: 'Table01Icon',               hoverIcon: 'Table02Icon'                 },
  // ── Service ───────────────────────────────────────────────────────────
  { slug: 'calendly',             label: 'Calendly',              category: 'service',    icon: 'Calendar03Icon',            hoverIcon: 'CalendarAdd01Icon'           },
  { slug: 'map',                  label: 'Map',                   category: 'service',    icon: 'MapsIcon',                  hoverIcon: 'MapPinIcon'                  },
];

const CATEGORY_META: Record<Category, {
  label: string;
  icon: IconName;
  hoverIcon: IconName;
  tagline: string;
}> = {
  form: {
    label: translate({ id: 'prokodo.homepage.category.form.label', message: 'Form' }),
    icon: 'FilterIcon',
    hoverIcon: 'Edit01Icon',
    tagline: translate({
      id: 'prokodo.homepage.category.form.tagline',
      message: 'Inputs, selects, pickers and more',
    }),
  },
  display: {
    label: translate({ id: 'prokodo.homepage.category.display.label', message: 'Display' }),
    icon: 'Layers01Icon',
    hoverIcon: 'Cards01Icon',
    tagline: translate({
      id: 'prokodo.homepage.category.display.tagline',
      message: 'Buttons, cards, chips, avatars and visual elements',
    }),
  },
  navigation: {
    label: translate({ id: 'prokodo.homepage.category.navigation.label', message: 'Navigation' }),
    icon: 'Menu01Icon',
    hoverIcon: 'LayoutLeftIcon',
    tagline: translate({
      id: 'prokodo.homepage.category.navigation.tagline',
      message: 'Tabs, accordions, carousels and routing',
    }),
  },
  feedback: {
    label: translate({ id: 'prokodo.homepage.category.feedback.label', message: 'Feedback' }),
    icon: 'Notification01Icon',
    hoverIcon: 'Alert01Icon',
    tagline: translate({
      id: 'prokodo.homepage.category.feedback.tagline',
      message: 'Dialogs, toasts, loaders and status indicators',
    }),
  },
  content: {
    label: translate({ id: 'prokodo.homepage.category.content.label', message: 'Content' }),
    icon: 'File01Icon',
    hoverIcon: 'CheckListIcon',
    tagline: translate({
      id: 'prokodo.homepage.category.content.tagline',
      message: 'Lists, tables, posts and rich content',
    }),
  },
  service: {
    label: translate({ id: 'prokodo.homepage.category.service.label', message: 'Service' }),
    icon: 'GlobeIcon',
    hoverIcon: 'CloudServerIcon',
    tagline: translate({
      id: 'prokodo.homepage.category.service.tagline',
      message: 'Third-party integrations and maps',
    }),
  },
};

const CATEGORY_ORDER: Category[] = [
  'form', 'display', 'navigation', 'feedback', 'content', 'service',
];

function getFeatures(): Feature[] {
  return [
    {
      icon: 'Rocket01Icon',
      hoverIcon: 'CheckmarkCircle01Icon',
      title: translate({ id: 'prokodo.homepage.feature.ready.title', message: 'Drop-in Ready' }),
      description: translate({
        id: 'prokodo.homepage.feature.ready.description',
        message:
          'Install one package and ship production-ready React UI components for Next.js, Vite, and Remix with minimal setup.',
      }),
      href: '/docs/getting-started/installation',
    },
    {
      icon: 'PaintBrush01Icon',
      hoverIcon: 'Sun01Icon',
      title: translate({
        id: 'prokodo.homepage.feature.tokens.title',
        message: 'Dark Mode & Theming',
      }),
      description: translate({
        id: 'prokodo.homepage.feature.tokens.description',
        message:
          'One CSS import enables consistent light/dark theming across your design system, powered by scalable design tokens.',
      }),
      href: '/docs/design-tokens',
    },
    {
      icon: 'CodeFolderIcon',
      hoverIcon: 'FirstBracketIcon',
      title: translate({
        id: 'prokodo.homepage.feature.typescript.title',
        message: 'Fully Typed',
      }),
      description: translate({
        id: 'prokodo.homepage.feature.typescript.description',
        message:
          'Typed props, variants, and refs deliver reliable autocomplete and safer refactoring in large TypeScript codebases.',
      }),
      href: '/docs/getting-started/installation',
    },
    {
      icon: 'Layers01Icon',
      hoverIcon: 'BrowserIcon',
      title: translate({
        id: 'prokodo.homepage.feature.storybook.title',
        message: 'Live Previews',
      }),
      description: translate({
        id: 'prokodo.homepage.feature.storybook.description',
        message:
          'Interactive Storybook previews accelerate evaluation, QA, and stakeholder alignment before implementation starts.',
      }),
      href: '/docs/components/overview',
    },
    {
      icon: 'CheckmarkCircle01Icon',
      hoverIcon: 'CursorMagicSelection01Icon',
      title: translate({
        id: 'prokodo.homepage.feature.accessible.title',
        message: 'Accessible',
      }),
      description: translate({
        id: 'prokodo.homepage.feature.accessible.description',
        message:
          'Built-in accessibility patterns include ARIA support, keyboard navigation, and robust focus management by default.',
      }),
      href: '/docs/getting-started/quick-start',
    },
    {
      icon: 'CloudServerIcon',
      hoverIcon: 'ApiIcon',
      title: translate({
        id: 'prokodo.homepage.feature.nextjs.title',
        message: 'Next.js Optimized',
      }),
      description: translate({
        id: 'prokodo.homepage.feature.nextjs.description',
        message:
          'AIC-first architecture with server, client, and lazy variants helps optimize bundle size and runtime performance.',
      }),
      href: '/docs/aic-pattern',
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComponentCard({ slug, label, category, icon, hoverIcon }: ComponentItem): ReactNode {
  return (
    <DocLink
      to={`/docs/components/${slug}`}
      className={clsx(styles.compCard, styles[`compCat-${category}`])}
    >
      <div className={clsx(styles.compPreview, styles[`compBg-${category}`])}>
        <span className={styles.iconDefault}>
          <Icon name={icon} size="lg" />
        </span>
        <span className={styles.iconHover}>
          <Icon name={hoverIcon} size="lg" />
        </span>
      </div>
      <div className={styles.compMeta}>
        <span className={styles.compName}>{label}</span>
      </div>
    </DocLink>
  );
}

function CategorySection({ category }: { category: Category }): ReactNode {
  const meta = CATEGORY_META[category];
  const items = COMPONENTS.filter((c) => c.category === category);
  return (
    <div className={clsx(styles.catSection, styles[`catSection-${category}`])}>
      <div className={styles.catHeader}>
        <span className={clsx(styles.catIconWrap, styles[`catIconWrap-${category}`])}>
          <Icon name={meta.icon} size="md" />
        </span>
        <div>
          <Headline type="h3" className={styles.catHeadline} animated={false}>
            {meta.label}
          </Headline>
          <p className={styles.catTagline}>{meta.tagline}</p>
        </div>
        <span className={clsx(styles.catCount, styles[`catCount-${category}`])}>
          {items.length}
        </span>
      </div>
      <div className={styles.compGrid}>
        {items.map((c) => (
          <ComponentCard key={c.slug} {...c} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, hoverIcon, title, description, href, featureIdx }: Feature & { featureIdx: number }): ReactNode {
  return (
    <DocLink to={href} className={styles.featureCardLink}>
      <div className={styles.featureCard} data-fi={featureIdx}>
        <div className={styles.featureIconBadge}>
          <span className={styles.iconDefault}>
            <Icon name={icon} size="lg" />
          </span>
          <span className={styles.iconHover}>
            <Icon name={hoverIcon} size="lg" />
          </span>
        </div>
        <div className={styles.featureTitle}>{title}</div>
        <p className={styles.featureDesc}>{description}</p>
      </div>
    </DocLink>
  );
}

function HeroSection(): ReactNode {
  const logoSrc = useBaseUrl('/img/prokodo-logo-white.webp');
  const [theme, setTheme] = useState<DocsTheme>('light');

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(readDocsThemeFromDom());
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <header className={clsx('hero hero--prokodo', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>
          <img src={logoSrc} alt="" aria-hidden="true" className={styles.heroWordmark} />
          <span className={styles.heroSrOnly}>
            <Translate id="prokodo.homepage.hero.srOnly">prokodo UI React Component Library</Translate>
          </span>
          {' UI'}
        </h1>
        <p className={styles.heroTagline}>
          <Translate id="prokodo.homepage.hero.tagline">
            AIC-ready, high-performance React UI components for Next.js and Vite — built for fast Core Web Vitals and scalable product teams.
          </Translate>
        </p>
        <div className={styles.heroStats}>
          <span>
            <Translate id="prokodo.homepage.hero.stats.components">52 production-ready components</Translate>
          </span>
          <span className={styles.heroStatsDot}>·</span>
          <span>
            <Translate id="prokodo.homepage.hero.stats.darkMode">AIC-ready architecture</Translate>
          </span>
          <span className={styles.heroStatsDot}>·</span>
          <span>
            <Translate id="prokodo.homepage.hero.stats.typescript">High performance</Translate>
          </span>
          <span className={styles.heroStatsDot}>·</span>
          <span>
            <Translate id="prokodo.homepage.hero.stats.accessible">Accessible by default</Translate>
          </span>
        </div>
        <div className={clsx(styles.heroCtas, 'prokodo-docs--hero-cta')}>
          <Button
            color="primary"
            variant="contained"
            title={translate({
              id: 'prokodo.homepage.hero.browseComponents',
              message: 'Browse Components →',
            })}
            redirect={{ href: '/docs/components/overview' }}
          />
          <Button
            color="primary"
            variant="outlined"
            title={translate({
              id: 'prokodo.homepage.hero.openStorybook',
              message: 'Open Storybook ↗',
            })}
            redirect={{ href: withStorybookTheme(STORYBOOK_URL, theme) }}
          />
        </div>
        <div className={styles.heroInstall}>
          <code>pnpm add @prokodo/ui</code>
          <span className={styles.heroInstallAlts}>
            <Translate id="prokodo.homepage.hero.alsoAvailable">Also available via</Translate>{' '}
            <a href={NPM_URL} target="_blank" rel="noopener noreferrer">npm</a>
          </span>
        </div>
      </div>
    </header>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'prokodo.homepage.layout.title',
        message: 'prokodo UI — AIC-ready React Component Library for Next.js & Vite',
      })}
      description={translate({
        id: 'prokodo.homepage.layout.description',
        message:
          'AIC-ready, high-performance React component library for Next.js and Vite with accessible UI components, TypeScript APIs, design tokens, and live Storybook docs.',
      })}
    >
      <HeroSection />

      <main>
        {/* ─── Component showcase ─── */}
        <section className={styles.components}>
          <div className="container">
            <div className={styles.componentsSectionHead}>
              <Headline type="h2" className={styles.sectionHeading} animated={false}>
                <Translate id="prokodo.homepage.components.heading">
                  52 production-ready React UI components
                </Translate>
              </Headline>
              <p className={styles.sectionSubtitle}>
                <Translate id="prokodo.homepage.components.subtitle">
                  Explore prokodo's UI component documentation with implementation guidance, API references, and production-ready usage examples.
                </Translate>
              </p>
            </div>

            {CATEGORY_ORDER.map((cat) => (
              <CategorySection key={cat} category={cat} />
            ))}

            <div className={styles.componentsFooter}>
              <DocLink to="/docs/components/overview" className={styles.viewAllLink}>
                <Translate id="prokodo.homepage.components.viewAll">
                  View full component overview →
                </Translate>
              </DocLink>
            </div>
          </div>
        </section>

        {/* ─── Why prokodo UI ─── */}
        <section className={styles.features}>
          <div className="container">
            <Headline type="h2" className={styles.sectionHeading} animated={false}>
              <Translate id="prokodo.homepage.features.heading">
                AIC-ready architecture and high performance
              </Translate>
            </Headline>
            <p className={styles.sectionSubtitle}>
              <Translate id="prokodo.homepage.features.subtitle">
                Built for modern product teams that need fast rendering, scalable architecture, and consistent UX across apps.
              </Translate>
            </p>
            <div className={styles.featuresGrid}>
              {getFeatures().map((f, i) => (
                <FeatureCard key={f.href} {...f} featureIdx={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Quick start ─── */}
        <section className={styles.quickStart}>
          <div className="container">
            <Headline type="h2" className={styles.sectionHeading} animated={false}>
              <Translate id="prokodo.homepage.quickstart.heading">
                Quick start for Next.js and Vite in 3 steps
              </Translate>
            </Headline>
            <p className={styles.sectionSubtitle}>
              <Translate id="prokodo.homepage.quickstart.subtitle">
                Integrate an AIC-ready, high-performance component stack into your React app in just a few steps.
              </Translate>
            </p>
            <div className={styles.quickGrid}>
              <DocLink to="/docs/getting-started/installation" className={styles.codeStep}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>1</span>
                  <span className={styles.stepLabel}>
                    <Translate id="prokodo.homepage.quickstart.step.install">Install</Translate>
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  <Translate id="prokodo.homepage.quickstart.step.install.desc">
                    Add the library to your React project and start with production-grade UI foundations.
                  </Translate>
                </p>
                <div className={styles.stepCode}>
                  <span className={styles.stepCodePrefix}>$</span>
                  <code>pnpm add @prokodo/ui</code>
                </div>
              </DocLink>
              <DocLink to="/docs/getting-started/theming" className={styles.codeStep}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>2</span>
                  <span className={styles.stepLabel}>
                    <Translate id="prokodo.homepage.quickstart.step.theme">Import theme</Translate>
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  <Translate id="prokodo.homepage.quickstart.step.theme.desc">
                    Enable token-driven theming for consistent light and dark experiences across all components.
                  </Translate>
                </p>
                <div className={styles.stepCode}>
                  <code>{"import '@prokodo/ui/theme.css'"}</code>
                </div>
              </DocLink>
              <DocLink to="/docs/components/button" className={styles.codeStep}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>3</span>
                  <span className={styles.stepLabel}>
                    <Translate id="prokodo.homepage.quickstart.step.use">Use</Translate>
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  <Translate id="prokodo.homepage.quickstart.step.use.desc">
                    Import typed, tree-shakable components optimized for performance and accessibility.
                  </Translate>
                </p>
                <div className={styles.stepCode}>
                  <code>{"import { Button } from '@prokodo/ui/button'"}</code>
                </div>
              </DocLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
