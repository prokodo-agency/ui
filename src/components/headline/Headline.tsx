import { type FC, type ReactNode, type JSX } from "react"

import { create } from "@/helpers/bem"

import { AnimatedText } from "../animatedText"
import { RichText } from "../rich-text"

import styles from "./Headline.module.scss"
import { POSSIBLE_HIGHLIGHTS } from "./Headline.variants"

import type { HeadlineProps } from "./Headline.model"

const bem = create(styles, "Headline")

export const Headline: FC<HeadlineProps> = ({
  id,
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
  children,
  ...remainingProps
}) => {
  const isHighlighted =
    Boolean(highlight) && POSSIBLE_HIGHLIGHTS.includes(variant)
  // 1) Determine highlight state

  // 2) Build BEM modifier object
  const modifier = {
    [variant]: !!variant,
    "is-highlighted": isHighlighted,
    highlighted: isHighlighted,
    [`${variant}--highlighted`]: isHighlighted,
    [size]: typeof size === "string" && !!size,
    [`${align}`]: !!align,
  }

  // 3) Combine BEM classes + any passed-in className
  const bemClass = bem(undefined, modifier, className)

  // 4) Inline style if size is numeric
  const customStyle =
    typeof size === "number"
      ? { fontSize: `${size}em` }
      : /* istanbul ignore next */ {}

  // 5) Compute aria-label if children is plain text
  const ariaLabel = typeof children === "string" ? children : undefined

  // 6) Base props (className, style, aria-label, plus any schema attrs)
  const baseProps = {
    id,
    "aria-label": ariaLabel,
    className: bemClass,
    style: customStyle,
    ...schema,
  }

  // 7) Animation wrapper
  const animateText = (text: ReactNode) => {
    if (animated === false || animated === undefined) {
      return text
    }
    return <AnimatedText {...animationProps}>{text as string}</AnimatedText>
  }

  // 8) Helper: render a heading tag (h1…h6) with exactly the attributes it needs
  const renderHTag = ({
    children: headingChildren,
  }: {
    children?: ReactNode
  }) => {
    // Map type = "h2" → actual <h2>...<h2>
    const HTag = type as keyof JSX.IntrinsicElements
    const headingLevel = parseInt(type.charAt(1), 10)

    return (
      <>
        <HTag {...baseProps} aria-level={headingLevel}>
          {animateText(headingChildren)}
        </HTag>
      </>
    )
  }

  // 9) Rich‐text branch: wrap the raw markdown in <RichText>,
  //    and tell it to convert every <p>…</p> into our heading via overrideParagraph
  if (isRichtext) {
    return (
      <>
        <RichText
          animated={animated}
          animationProps={animationProps}
          className={bem("headline", undefined, className)}
          id={id}
          itemProp={undefined}
          linkComponent={undefined}
          schema={schema}
          variant={variant}
          {...remainingProps}
          overrideParagraph={
            /* istanbul ignore next */ (textContent: string) =>
              renderHTag({ children: textContent })
          }
        >
          {children as string}
        </RichText>
      </>
    )
  }

  // 10) Non‐rich mode: render exactly one heading with our animations
  return renderHTag({ children })
}

Headline.displayName = "Headline"
