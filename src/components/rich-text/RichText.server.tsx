import MarkdownIt from "markdown-it"
import { filterXSS } from "xss"

import { create } from "@/helpers/bem"

import styles from "./RichText.module.scss"

import type { RichTextProps } from "./RichText.model"
import type { JSX } from "react"

const bem = create(styles, "RichText")
const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

/**
 * Server‐side fallback: turn Markdown → HTML using markdown-it (ESM),
 * then render that HTML in a <div>.  This ensures SEO‐friendly content
 * and no “empty” box on first paint.
 */
export function RichTextServer(props: RichTextProps): JSX.Element {
  const {
    children,
    className,
    schema = {},
    animated: _animated,
    animationProps: _animationProps,
    variant: _variant, // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    itemProp,
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    overrideParagraph,
    linkComponent: _linkComp, // omit on server (don’t pass to DOM)
    linkPolicy: _linkPolicy,
    ...restProps
  } = props

  // Dynamically import markdown-it (ESM) on the server:
  const rawHtml = md.render((children ?? "") as string)

  // Create a fake window/document via jsdom:
  const safeHtml = filterXSS(rawHtml)

  // If overrideParagraph was provided, we may want to transform each <p>…</p> into a custom <hN> or similar.
  // For a basic example, we’ll just output the raw HTML and let the client override later if needed.
  //
  // You could also parse rawHtml on the server (with an ESM HTML→React parser) and invoke overrideParagraph
  // for each <p>…</p>.  But simplest is just to dump raw HTML for SEO/readability.

  return (
    <div
      className={bem(undefined, undefined, className)}
      {...schema}
      {...restProps}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
