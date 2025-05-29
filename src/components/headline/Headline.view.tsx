import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { create } from "@/helpers/bem"
import { AnimatedText } from "@/components/animatedText"

import styles from "./Headline.module.scss"
import { POSSIBLE_HIGHLIGHTS } from "./Headline.variants"

import type { HeadlineProps } from "./Headline.model"
import type {
  JSX,
  FC,
  HTMLAttributes,
  ReactNode,
  CSSProperties,
} from "react"

const bem = create(styles, "Headline")

export const HeadlineView: FC<HeadlineProps> = ({
  animated,
  animationProps = {},
  type = "h3",
  size = "md",
  highlight,
  schema = {},
  className,
  align,
  isRichtext = false,
  variant = "inherit",
  renderText,
  children,
  ...props
}) => {
  const isHighlighted =
    Boolean(highlight) && POSSIBLE_HIGHLIGHTS.includes(variant)
  const modifier = {
    [variant]: !!variant,
    "is-highlighted": isHighlighted,
    highlighted: isHighlighted,
    [`${variant}--highlighted`]: isHighlighted,
    [size]: typeof size === "string" && !!size,
    [`${align}`]: !!align,
  }

  const bemClass = bem(undefined, modifier, className)

  const customStyle: CSSProperties = typeof size === "number"
  ? { fontSize: `${size}em` }
  : {}

  const ariaLabel =
    typeof children === "string" ? children : undefined

  const baseProps = {
    "aria-label": ariaLabel,
    className: bemClass,
    style: customStyle,
    ...schema,
  }

  const animateText = (text: ReactNode) =>
    Boolean(animated) ? (
      <AnimatedText {...animationProps}>
        {text as ReactNode & string}
      </AnimatedText>
    ) : (
      text
    )

  const wrapText = (node: ReactNode) => {
    if (typeof node !== "string") return node
    if (renderText) return renderText(node)
    if (Boolean(animated)) return <span>{node}</span>
    return node
  }

  const renderHTag = (attr: HTMLAttributes<HTMLHeadingElement>) => {
    if (!/^h[1-6]$/.test(type)) return null // Only allow h1–h6
    const HTag = type as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    >
    return (
      <HTag {...attr} aria-level={parseInt(type[1] ?? "", 10)} {...baseProps}>
        {wrapText(animateText(children))}
      </HTag>
    )
  }

  if (isRichtext) {
    return (
      <ReactMarkdown
        className={bem("headline")}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: props => renderHTag(props as HTMLAttributes<HTMLHeadingElement>),
        }}
      >
        {children as string}
      </ReactMarkdown>
    )
  }

  return renderHTag(props as HTMLAttributes<HTMLHeadingElement>)
}
