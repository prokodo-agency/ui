"use client"
import { marked } from "marked"
import { isValidElement, createElement, Fragment, useMemo, type ReactNode, type ReactElement, type JSX } from "react"
import { filterXSS } from "xss"

import { create } from "@/helpers/bem"

import { AnimatedText } from "../animatedText"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Link } from "../link"

import styles from "./RichText.module.scss"

import type { RichTextProps } from "./RichText.model"

const bem = create(styles, "RichText")

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
  ...props
}: RichTextProps): JSX.Element {
  // Base props we’ll pass down to each element:
  const baseProps = {
    animated,
    className: className ?? undefined,
    ...schema,
  }

  const headlineProps = { animationProps }

  // Helper to wrap text in <AnimatedText> if animated=true
  const renderAnimation = (content: string | React.ReactNode) => {
    if (!Boolean(animated)) return content
    return <AnimatedText {...animationProps}>{content as string}</AnimatedText>
  }

  // 2) Convert markdown & Sanitize the HTML string with xss (works in the browser too)
  const safeHtml = useMemo(() => {
  marked.setOptions({ gfm: true, breaks: true });
  return filterXSS(marked.parse((children as string) ?? "") as string);
}, [children]);

  // 3) A utility that will recursively walk a DOM Node and return a React node.
  //    We rely on the browser’s DOMParser to create a Document from htmlString.
  function domNodeToReact(node: ChildNode): React.ReactNode {
    // Text node?
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    // Only handle element nodes from now on
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }

    const elem = node as Element
    const tagName = elem.tagName.toLowerCase()
    const childReactNodes = Array.from(elem.childNodes).map(domNodeToReact)

    switch (tagName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        // Map hN → size/type for our <Headline>
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
            {childReactNodes}
          </Headline>
        )
      }

      case "p": {
        const cls = bem("p")
        return (
          <p className={cls} itemProp={itemProp}>
            {childReactNodes.map(renderAnimation)}
          </p>
        )
      }

      case "a": {
        const cls = bem("a")
        const href = elem.getAttribute("href") ?? "#"
        const title = elem.getAttribute("title") ?? undefined
        const linkText = childReactNodes.map(renderAnimation)

        return (
          <Link
            {...baseProps}
            aria-label={childReactNodes.map(extractText).join("")}
            className={cls}
            href={href}
            linkComponent={linkComponent}
            title={title}
          >
            {linkText}
          </Link>
        )
      }

      case "pre": {
        const cls = bem("pre")
        return <pre className={cls}>{childReactNodes}</pre>
      }

      case "ul": {
        const cls = bem("ul")
        return <ul className={cls}>{childReactNodes}</ul>
      }

      case "ol": {
        const cls = bem("ol")
        return <ol className={cls}>{childReactNodes}</ol>
      }

      case "li": {
        const cls = bem("li")
        return (
          <li className={cls}>
            <Icon
              className={bem("li__icon")}
              color={variant}
              name="ArrowRight01Icon"
              size={18}
            />
            {childReactNodes.map((c, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={i}>{renderAnimation(c)}</span>
            ))}
          </li>
        )
      }

      default:
        // For any other tag (e.g. <strong>, <em>, etc.), just render the default element:
        return createElement(
          tagName,
          { key: Math.random().toString(), className: bem(tagName) },
          childReactNodes
        )
    }
  }

  // 4) If overrideParagraph is provided, split on <p>…</p> and let overrideParagraph handle each chunk:
  if (overrideParagraph) {
    // Split raw sanitized HTML on <p>…</p> ignoring empty lines:
    const segments = safeHtml.split(/<\/?p>/g).filter((seg) => seg.trim().length > 0)

    return (
      <div
        className={bem(undefined, undefined, className)}
        {...schema}
        {...(props)}
      >
        {segments.map((segment, idx) => {
          // Strip out any HTML tags – we only want the plain text inside <p>…</p>
          const plainText = segment.replace(/<[^>]+>/g, "")
          // eslint-disable-next-line react/no-array-index-key
          return <Fragment key={idx}>{overrideParagraph(plainText)}</Fragment>
        })}
      </div>
    )
  }

  // 5) Otherwise, use DOMParser to produce a DocumentFragment from the sanitized HTML:
  const parser = new DOMParser()
  const doc = parser.parseFromString(safeHtml, "text/html")
  const topLevelChildren = Array.from(doc.body.childNodes)

  // 6) Convert each top‐level node into a React node, then return them inside a <div>
  return (
    <div
      className={bem(undefined, undefined, className)}
      {...schema}
      {...(props)}
    >
      {/* eslint-disable-next-line react/no-array-index-key */}
      {topLevelChildren.map((n, i) => <Fragment key={i}>{domNodeToReact(n)}</Fragment>)}
    </div>
  )
}

RichTextClient.displayName = "RichTextClient"

// — Helpers —

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
