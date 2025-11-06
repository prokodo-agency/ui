// RichText.client.tsx
"use client"

import { Marked } from "marked"
import {
  Children,
  isValidElement,
  createElement,
  Fragment,
  useRef,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
  type ReactElement,
  type JSX,
} from "react"
import { filterXSS, getDefaultWhiteList } from "xss"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { AnimatedText } from "../animatedText"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Link } from "../link"

import styles from "./RichText.module.scss"

import type { RichTextProps } from "./RichText.model"

const bem = create(styles, "RichText")

// XSS options: allow class attributes required by highlight.js (hljs, language-*)
// ───────────────────────────────────────────────────────────────────────────────
const xssOptions = (() => {
  const wl =
    typeof getDefaultWhiteList === "function" ? getDefaultWhiteList() : {}
  const add = (tag: string) => {
    wl[tag] = Array.from(new Set([...(wl[tag] ?? []), "class"]))
  }
  add("pre")
  add("code")
  add("span") // token wrappers (e.g., <span class="hljs-keyword">)
  // ⚠️ some xss versions only read `whiteList`, others read `allowList`
  return {
    whiteList: wl,
    allowList: wl,
  } as const
})()

// ───────────────────────────────────────────────────────────────────────────────
// Utilities
// ───────────────────────────────────────────────────────────────────────────────

const normalize = (nodes: React.ReactNode[]) => Children.toArray(nodes)

const withKey = (el: React.ReactNode, key: string) =>
  isValidElement(el) ? (el.key == null ? { ...el, key } : el) : el

// Very cheap check for fenced code blocks or pre/code tags
const hasCodeBlocks = (src: string) =>
  /(^|\n)```/.test(src) || /<pre|<code/i.test(src)

// Extract languages from code fences like ```ts or ```javascript
const extractFenceLangs = (src: string) => {
  const langs = new Set<string>()
  const re = /(^|\n)```([\w+-]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const lang = (m[2] ?? "").toLowerCase().trim()
    if (lang) langs.add(lang)
  }
  return langs
}

// Load the export-safe prebuilt "common" bundle (no deep imports)
async function prepareHljs(
  _langs: Set<string>,
  theme?: RichTextProps["codeTheme"],
) {
  const hljs = (await import("highlight.js/lib/common")).default
  const version = hljs?.versionString || "11.11.1"
  ensureHljsThemeLoaded(version, theme)
  return hljs
}

// Inject (or swap) the highlight.js CSS theme using props (href OR name+version)
function ensureHljsThemeLoaded(
  version: string,
  theme?: RichTextProps["codeTheme"],
) {
  const id = "hljs-theme"
  const existing = document.getElementById(id) as HTMLLinkElement | null
  const {
    href: customHref,
    name: themeName,
    version: themeVersion,
  } = theme ?? {}

  // Compute target href
  let href: string
  if (typeof customHref === "string" && customHref.trim().length > 0) {
    href = customHref
  } else {
    const name = (themeName ?? "github-dark-dimmed").replace(/\.css$/i, "")
    const ver =
      themeVersion === "auto" || !isString(themeVersion)
        ? version
        : themeVersion
    href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${encodeURIComponent(
      ver as string,
    )}/styles/${name}.min.css`
  }

  if (existing) {
    if (existing.href !== href) existing.href = href
    return
  }

  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = href
  document.head.appendChild(link)
}

// ───────────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────────

export function RichTextClient({
  children,
  animated,
  animationProps = {},
  variant = "primary",
  schema = {},
  itemProp,
  linkComponent,
  className,
  overrideParagraph,
  codeTheme,
  ...props
}: RichTextProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const baseProps = {
    animated,
    className: className ?? undefined,
    ...schema,
  }

  const headlineProps = { animationProps }

  const renderAnimation = (content: React.ReactNode) => {
    if (!Boolean(animated)) return content
    return typeof content === "string" ? (
      <AnimatedText {...animationProps}>{content}</AnimatedText>
    ) : (
      content
    )
  }

  const src = String(children ?? "")

  // Fast path: parse markdown without highlight for first paint
  const fastHtml = useMemo(() => {
    const parser = new Marked({ gfm: true, breaks: true })
    return filterXSS(parser.parse(src) as string, xssOptions)
  }, [src])

  // State that upgrades to highlighted HTML only if needed
  const [html, setHtml] = useState<string>("")

  useEffect(() => {
    let cancelled = false

    void (async () => {
      if (!hasCodeBlocks(src)) {
        if (!cancelled) setHtml(fastHtml)
        return
      }

      // Dynamically load marked-highlight + hljs only when code exists
      const [mhMod, hljs] = await Promise.all([
        import("marked-highlight"),
        prepareHljs(extractFenceLangs(src), codeTheme),
      ])
      const markedHighlight =
        // support both module shapes
        mhMod.markedHighlight ?? mhMod.default

      if (typeof markedHighlight !== "function") {
        // Hard fail loudly so we notice immediately in dev
        console.error(
          "[RichText] marked-highlight not resolved; no code styling will be applied.",
        )
      }

      // ⚠️ Follow the docs exactly: pass the extension into the constructor
      const parser = new Marked(
        markedHighlight({
          emptyLangClass: "hljs",
          langPrefix: "hljs language-",
          highlight(code: string, lang?: string) {
            try {
              if (isString(lang) && hljs.getLanguage(lang as string)) {
                return hljs.highlight(code, { language: lang as string }).value
              }
              return hljs.highlightAuto(code).value
            } catch {
              return code
            }
          },
        }),
        { gfm: true, breaks: true },
      )

      // markdown → HTML (+highlight for fenced code)
      const step1 = filterXSS(parser.parse(src) as string, xssOptions)

      // STEP 2: also handle pre-existing HTML <pre><code> by upgrading in a DETACHED DOM
      // (never mutate the mounted DOM; avoids React removeChild errors)
      const hasRawBlocks =
        /<pre[^>]*>\s*<code[^>]*>/.test(step1) &&
        !/<span[^>]+class="[^"]*hljs-/.test(step1)
      if (!hasRawBlocks) {
        if (!cancelled) setHtml(step1)
        return
      }

      const doc = new DOMParser().parseFromString(step1, "text/html")
      doc.querySelectorAll("pre code").forEach(codeEl => {
        try {
          // preserve any language-xxx class if present
          const cls = codeEl.getAttribute("class") ?? ""
          const m = cls.match(/language-([\w+-]+)/)
          const lang = m?.[1]
          const text = codeEl.textContent ?? ""
          const html =
            isString(lang) && hljs.getLanguage(lang as string)
              ? hljs.highlight(text, { language: lang as string }).value
              : hljs.highlightAuto(text).value
          codeEl.innerHTML = html
          // ensure theme base classes
          codeEl.classList.add("hljs")
          codeEl.closest("pre")?.classList.add("hljs")
        } catch {}
      })
      const step2 = doc.body.innerHTML
      if (!cancelled) setHtml(step2)
    })()

    return () => {
      cancelled = true
    }
  }, [src, fastHtml, codeTheme])

  // ⬅️ define safeHtml before using it below
  const safeHtml = html || fastHtml

  const VOID_TAGS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ])

  // Recursively walk a DOM Node and return a React node.
  function domNodeToReact(node: ChildNode, path = "r"): React.ReactNode {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const elem = node as Element
    const tagName = elem.tagName.toLowerCase()
    const childReactNodes = Array.from(elem.childNodes).map((child, i) =>
      domNodeToReact(child, `${path}.${i}`),
    )
    const keyedChildren = normalize(
      childReactNodes.map((c, i) =>
        isValidElement(c) ? withKey(c, `${path}.c${i}`) : c,
      ),
    )

    switch (tagName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const level = parseInt(tagName.charAt(1), 10)
        let size: "xxl" | "xl" | "lg" | "md" | "sm" | "xs"
        let type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
        switch (level) {
          case 1:
            size = "xxl"
            type = "h1"
            break
          case 2:
            size = "xl"
            type = "h2"
            break
          case 3:
            size = "lg"
            type = "h3"
            break
          case 4:
            size = "md"
            type = "h4"
            break
          case 5:
            size = "sm"
            type = "h5"
            break
          default:
            size = "xs"
            type = "h6"
        }
        return (
          <Headline {...baseProps} {...headlineProps} size={size} type={type}>
            {keyedChildren}
          </Headline>
        )
      }

      case "p": {
        const cls = bem("p")
        return (
          <p className={cls} itemProp={itemProp}>
            {normalize(keyedChildren.map(renderAnimation))}
          </p>
        )
      }

      case "a": {
        const cls = bem("a")
        const href = elem.getAttribute("href") ?? "#"
        const title = elem.getAttribute("title") ?? undefined
        const linkText = normalize(keyedChildren.map(renderAnimation))

        return (
          <Link
            {...baseProps}
            aria-label={childReactNodes.map(extractText).join("")}
            className={cls}
            href={href}
            linkComponent={linkComponent}
            title={title}
            variant="primary"
          >
            {linkText}
          </Link>
        )
      }

      case "pre": {
        const existing = elem.getAttribute("class")
        return (
          <pre className={[bem("pre"), existing].filter(Boolean).join(" ")}>
            {keyedChildren}
          </pre>
        )
      }

      case "code": {
        const existing = elem.getAttribute("class")
        return (
          <code className={[bem("code"), existing].filter(Boolean).join(" ")}>
            {keyedChildren}
          </code>
        )
      }

      case "blockquote": {
        const existing = elem.getAttribute("class")
        return (
          <blockquote
            className={[bem("blockquote"), existing].filter(Boolean).join(" ")}
          >
            {keyedChildren}
          </blockquote>
        )
      }

      case "ul": {
        const cls = bem("ul")
        return <ul className={cls}>{keyedChildren}</ul>
      }

      case "ol": {
        // Custom numbered layout like before: <i class="ol__decimal">N</i> + content
        const cls = bem("ol")
        const startAttr = elem.getAttribute("start")
        const start = isString(startAttr)
          ? parseInt(startAttr as string, 10) || 1
          : 1
        const liElems = Array.from(elem.children).filter(
          (e): e is Element => e.tagName.toLowerCase() === "li",
        )

        return (
          <ol className={cls}>
            {liElems.map((liEl, index) => {
              const contentNodes = Array.from(liEl.childNodes).map((child, i) =>
                domNodeToReact(child, `${path}.li${index}.${i}`),
              )
              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={`ol-li-${index}`} className={bem("li")}>
                  <i className={bem("ol__decimal")}>{start + index}</i>
                  <span className={bem("li__content")}>
                    {normalize(contentNodes.map(renderAnimation))}
                  </span>
                </li>
              )
            })}
          </ol>
        )
      }

      case "li": {
        const cls = bem("li")
        return (
          <li className={cls}>
            <Icon
              key={`${path}.icon`}
              className={bem("li__icon")}
              color={variant}
              name="ArrowRight01Icon"
              size={18}
            />
            <span className={bem("li__content")}>
              {normalize(keyedChildren.map(renderAnimation))}
            </span>
          </li>
        )
      }

      default: {
        // merge any existing class (e.g., hljs token spans) with BEM class
        const existing = elem.getAttribute("class")
        const props: Record<string, unknown> = {
          className: [bem(tagName), existing].filter(Boolean).join(" "),
        }

        if (tagName === "img") {
          props.src = elem.getAttribute("src") ?? ""
          props.alt = elem.getAttribute("alt") ?? ""
          props.loading = "lazy"
        }

        if (VOID_TAGS.has(tagName)) {
          return createElement(tagName, { ...props, key: path })
        }

        return keyedChildren.length
          ? createElement(tagName, { ...props, key: path }, keyedChildren)
          : createElement(tagName, { ...props, key: path })
      }
    }
  }

  // If overrideParagraph is provided, split on <p>…</p> and let it handle each chunk:
  if (overrideParagraph) {
    const segments = safeHtml
      .split(/<\/?p>/g)
      .filter(seg => seg.trim().length > 0)

    return (
      <div
        className={bem(undefined, undefined, className)}
        {...schema}
        {...props}
      >
        {segments.map((segment, idx) => {
          // robust: parse HTML and read textContent
          const doc = new DOMParser().parseFromString(segment, "text/html")
          const plainText = (doc.body.textContent ?? "").trim()
          // eslint-disable-next-line react/no-array-index-key
          return <Fragment key={idx}>{overrideParagraph(plainText)}</Fragment>
        })}
      </div>
    )
  }

  // Convert the sanitized HTML to DOM nodes, then to React nodes
  const parser = new DOMParser()
  const doc = parser.parseFromString(safeHtml, "text/html")
  const topLevelChildren = Array.from(doc.body.childNodes)

  return (
    <div
      ref={containerRef}
      className={bem(undefined, undefined, className)}
      {...schema}
      {...props}
    >
      {topLevelChildren.map((n, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`top-level-${i}`}>{domNodeToReact(n)}</Fragment>
      ))}
    </div>
  )
}

RichTextClient.displayName = "RichTextClient"

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("")
  }
  if (isValidElement(node)) {
    // @ts-ignore
    return extractText((node as ReactElement).props.children)
  }
  return ""
}
