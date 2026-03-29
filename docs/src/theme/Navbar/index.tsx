import type { ChangeEvent, ReactNode } from "react"
import { useState, useEffect } from "react"
import clsx from "clsx"
import BrowserOnly from "@docusaurus/BrowserOnly"
import DocLink from "@docusaurus/Link"
import { useLocation } from "@docusaurus/router"
import useBaseUrl from "@docusaurus/useBaseUrl"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Translate, { translate } from "@docusaurus/Translate"
import { Icon } from "@prokodo/ui/icon"
import styles from "./index.module.css"
import { STORYBOOK_URL, GITHUB_UI_URL } from "../../constants"
import {
  readDocsThemeFromDom,
  withStorybookTheme,
  type DocsTheme,
} from "../../utils/storybookThemeUrl"

type NavItem = { label: string } & (
  | { to: string; href?: never }
  | { href: string; to?: never }
)

// Docusaurus localStorage key for persisting color mode
const DOCUSAURUS_COLOR_MODE_KEY = "@docusaurus/color-mode"

/**
 * Reads and toggles Docusaurus theme via DOM + localStorage directly — no
 * useColorMode() hook, so it works safely inside BrowserOnly without needing
 * the ColorModeProvider React context to be present on SSR.
 */
function ThemeToggle(): ReactNode {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    setIsDark(root.getAttribute("data-theme") === "dark")
    const observer = new MutationObserver(() => {
      setIsDark(root.getAttribute("data-theme") === "dark")
    })
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    const next = isDark ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    try {
      localStorage.setItem(
        DOCUSAURUS_COLOR_MODE_KEY,
        JSON.stringify({ colorMode: next }),
      )
    } catch {
      // storage unavailable — ignore
    }
    setIsDark(!isDark)
  }

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={translate({
        id: "prokodo.navbar.themeToggle.ariaLabel",
        message: isDark ? "Switch to light mode" : "Switch to dark mode",
      })}
    >
      <Icon name={isDark ? "Sun01Icon" : "Moon02Icon"} size="sm" />
    </button>
  )
}

type DocLeaf = { label: string; to: string }
type DocCategory = {
  label: string
  id: string
  to?: string
  children: { label: string; to: string }[]
}
type DocEntry = DocLeaf | DocCategory

export default function Navbar(): ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [theme, setTheme] = useState<DocsTheme>("light")
  const {
    i18n: { currentLocale, locales },
  } = useDocusaurusContext()
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    const read = () => setTheme(readDocsThemeFromDom())
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => observer.disconnect()
  }, [])

  const otherLocale = locales.find(l => l !== currentLocale)
  const pathWithoutLocale =
    (location.pathname || "/").replace(/^\/de(?=\/|$)/, "") || "/"
  const normalizedPath = pathWithoutLocale || "/"
  const otherLocalePath = otherLocale
    ? `${otherLocale === "de" ? "/de" : ""}${normalizedPath}`
    : undefined
  const otherLocaleUrl = otherLocalePath
    ? `${otherLocalePath}${location.search || ""}${location.hash || ""}`
    : undefined
  const docsBasePath = currentLocale === "de" ? "/de/docs" : "/docs"
  const isMigrationRoute = /\/docs\/migration(?:$|[/?#])/.test(
    location.pathname,
  )
  const currentDocsVersion = isMigrationRoute ? "v0" : "v1"

  const handleVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const target =
      event.target.value === "v0"
        ? `${docsBasePath}/migration#v0--v1`
        : `${docsBasePath}/intro`

    window.location.assign(target)
  }

  const toggleSection = (id: string) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const closeAll = () => {
    setMobileOpen(false)
    setDocsOpen(false)
    setOpenSections(new Set())
  }

  const logoSrc = useBaseUrl("/img/prokodo-logo-icon.webp")

  const navLinks: NavItem[] = [
    {
      label: translate({ id: "prokodo.navbar.link.docs", message: "Docs" }),
      to: "/docs/",
    },
    {
      label: translate({
        id: "prokodo.navbar.link.storybook",
        message: "Storybook",
      }),
      href: withStorybookTheme(STORYBOOK_URL, theme),
    },
  ]

  const docSections: DocEntry[] = [
    {
      label: translate({
        id: "prokodo.navbar.docs.intro",
        message: "👋 Introduction",
      }),
      to: "/docs/intro",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.gettingStarted",
        message: "Getting Started",
      }),
      id: "getting-started",
      children: [
        {
          label: translate({
            id: "prokodo.navbar.docs.installation",
            message: "Installation",
          }),
          to: "/docs/getting-started/installation",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.quickStart",
            message: "Quick Start",
          }),
          to: "/docs/getting-started/quick-start",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.theming",
            message: "Theming",
          }),
          to: "/docs/getting-started/theming",
        },
      ],
    },
    {
      label: translate({ id: "prokodo.navbar.docs.learn", message: "Learn" }),
      to: "/docs/learn",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.patterns",
        message: "Patterns",
      }),
      id: "patterns",
      children: [
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsDashboard",
            message: "Dashboard Layout",
          }),
          to: "/docs/patterns/dashboard-layout",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsDataTable",
            message: "Data Table",
          }),
          to: "/docs/patterns/react-data-table-pagination-sorting-filtering",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsSettings",
            message: "Settings Page",
          }),
          to: "/docs/patterns/settings-page-ui",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsLogin",
            message: "Login / OTP Form",
          }),
          to: "/docs/patterns/login-otp-form",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsBlog",
            message: "Blog Card Grid",
          }),
          to: "/docs/patterns/blog-card-grid",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.patternsSkeleton",
            message: "Loading & Empty States",
          }),
          to: "/docs/patterns/loading-skeleton-empty-states",
        },
      ],
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.components",
        message: "Components",
      }),
      id: "components",
      to: "/docs/components/overview",
      children: [
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsOverview",
            message: "Overview",
          }),
          to: "/docs/components/overview",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsForm",
            message: "Form",
          }),
          to: "/docs/components/overview#form",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsLayout",
            message: "Layout",
          }),
          to: "/docs/components/overview#layout",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsNavigation",
            message: "Navigation",
          }),
          to: "/docs/components/overview#navigation",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsContent",
            message: "Content",
          }),
          to: "/docs/components/overview#content",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsFeedback",
            message: "Feedback",
          }),
          to: "/docs/components/overview#feedback",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsMedia",
            message: "Media",
          }),
          to: "/docs/components/overview#media",
        },
        {
          label: translate({
            id: "prokodo.navbar.docs.componentsUtility",
            message: "Utility",
          }),
          to: "/docs/components/overview#utility",
        },
      ],
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.designTokens",
        message: "🎨 Design Tokens",
      }),
      to: "/docs/design-tokens",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.aicPattern",
        message: "⚡ AIC Pattern",
      }),
      to: "/docs/aic-pattern",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.migration",
        message: "🔄 Migration",
      }),
      to: "/docs/migration",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.versions",
        message: "🏷 Versions",
      }),
      to: "/docs/versions",
    },
    {
      label: translate({
        id: "prokodo.navbar.docs.changelog",
        message: "📋 Changelog",
      }),
      to: "/docs/changelog",
    },
  ]

  return (
    <nav className={clsx("navbar", styles.navbar)}>
      <div className={styles.inner}>
        {/* Brand + nav links */}
        <div className={styles.leftGroup}>
          <DocLink to="/" className={styles.brand}>
            <img src={logoSrc} alt="prokodo" className={styles.brandLogo} />
            <span className={styles.brandName}>UI</span>
          </DocLink>
          <ul className={styles.navLinks}>
            {navLinks.map(item => (
              <li key={item.label}>
                <DocLink
                  to={item.to}
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.label}
                </DocLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          <div className={styles.versionDropdown}>
            <select
              aria-label={translate({
                id: "prokodo.navbar.versionSwitcher.ariaLabel",
                message: "Switch documentation version",
              })}
              className={styles.versionSelect}
              onChange={handleVersionChange}
              value={currentDocsVersion}
            >
              <option value="v1">
                {translate({
                  id: "prokodo.navbar.versionSwitcher.v1",
                  message: "v1 (current)",
                })}
              </option>
              <option value="v0">
                {translate({
                  id: "prokodo.navbar.versionSwitcher.v0",
                  message: "v0 (legacy)",
                })}
              </option>
            </select>
          </div>

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
            aria-label={translate({
              id: "prokodo.navbar.github.ariaLabel",
              message: "GitHub",
            })}
          >
            <Icon name="GithubIcon" size="sm" />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <Icon name={mobileOpen ? "Cancel01Icon" : "Menu01Icon"} size="md" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {/* Docs collapsible section */}
          <div className={styles.mobileSection}>
            <button
              type="button"
              className={clsx(
                styles.mobileSectionHeader,
                docsOpen && styles.mobileSectionHeaderOpen,
              )}
              onClick={() => setDocsOpen(prev => !prev)}
              aria-expanded={docsOpen}
            >
              <Translate id="prokodo.navbar.link.docs">Docs</Translate>
              <Icon
                name={docsOpen ? "ArrowUp01Icon" : "ArrowDown01Icon"}
                size="xs"
              />
            </button>
            {docsOpen && (
              <div className={styles.mobileSectionLinks}>
                {docSections.map(entry => {
                  if (!("id" in entry)) {
                    // Direct link entry
                    return (
                      <DocLink
                        key={entry.to}
                        to={entry.to}
                        className={styles.mobileSectionLink}
                        onClick={closeAll}
                      >
                        {entry.label}
                      </DocLink>
                    )
                  }
                  // Category entry with children
                  const isOpen = openSections.has(entry.id)
                  return (
                    <div key={entry.id} className={styles.mobileSubSection}>
                      <button
                        type="button"
                        className={clsx(
                          styles.mobileSubSectionHeader,
                          isOpen && styles.mobileSubSectionHeaderOpen,
                        )}
                        onClick={() => toggleSection(entry.id)}
                        aria-expanded={isOpen}
                      >
                        <span>{entry.label}</span>
                        <Icon
                          name={isOpen ? "ArrowUp01Icon" : "ArrowDown01Icon"}
                          size="xs"
                        />
                      </button>
                      {isOpen && (
                        <div className={styles.mobileSubSectionLinks}>
                          {entry.children.map(child => (
                            <DocLink
                              key={child.to}
                              to={child.to}
                              className={styles.mobileSubSectionLink}
                              onClick={closeAll}
                            >
                              {child.label}
                            </DocLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Storybook */}
          <DocLink
            href={withStorybookTheme(STORYBOOK_URL, theme)}
            className={styles.mobileLink}
            onClick={closeAll}
          >
            <Translate id="prokodo.navbar.link.storybook">Storybook</Translate>
          </DocLink>

          {/* GitHub */}
          <DocLink
            href={GITHUB_UI_URL}
            className={styles.mobileLink}
            onClick={closeAll}
          >
            <Icon name="GithubIcon" size="xs" />{" "}
            <Translate id="prokodo.navbar.mobile.github">GitHub</Translate>
          </DocLink>

          {/* Bottom actions: locale switcher + dark mode toggle */}
          <div className={styles.mobileActions}>
            {otherLocale && otherLocaleUrl && (
              <a
                href={otherLocaleUrl}
                className={styles.mobileActionsLocale}
                onClick={closeAll}
              >
                {otherLocale === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
              </a>
            )}
            <BrowserOnly fallback={<span className={styles.themeToggle} />}>
              {() => <ThemeToggle />}
            </BrowserOnly>
          </div>
        </div>
      )}
    </nav>
  )
}
