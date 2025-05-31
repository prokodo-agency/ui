import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { create } from "@/helpers/bem"

import { AnimatedText } from "../animatedText"

import { POSSIBLE_HIGHLIGHTS } from "./Headline.variants"

import styles from "./Headline.module.scss"

import type { HeadlineProps } from "./Headline.model"
import type { FC, HTMLAttributes, ReactNode, JSX } from "react"

const bem = create(styles, "Headline")

export const Headline: FC<HeadlineProps> = ({
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
  const customStyle =
    typeof size === "number"
      ? {
          fontSize: `${size}em`,
        }
      : {}
  const ariaLabel =
    typeof props.children === "string" ? props.children : undefined
  const baseProps = {
    "aria-label": ariaLabel,
    className: bemClass,
    style: customStyle,
    node: undefined,
    ...schema,
  }
  const animateText = (children: ReactNode) => {
    if (animated === false || animated === undefined) return children
    return (
      <AnimatedText {...animationProps}>
        {children as ReactNode & string}
      </AnimatedText>
    )
  }
  const renderHTag = (attr: HTMLAttributes<HTMLHeadingElement>) => {
    if (type[1] === undefined) return null
    const children = attr.children as ReactNode
    // Map the `type` prop to appropriate heading tags
    const HTag: keyof JSX.IntrinsicElements = type
    return (
      <HTag {...attr} aria-level={parseInt(type[1], 10)} {...baseProps}>
        {animateText(children)}
      </HTag>
    )
  }
  if (isRichtext) {
    return (
      <Markdown
        className={bem("headline")}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: (props: HTMLAttributes<HTMLParagraphElement>) =>
            renderHTag(props as HTMLAttributes<HTMLHeadingElement>),
        }}
      >
        {props?.children as string}
      </Markdown>
    )
  }
  return renderHTag(props as HTMLAttributes<HTMLHeadingElement>)
}
