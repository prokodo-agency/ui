"use client"

import {
  type JSX,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
} from "react"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { AnimatedText } from "@/components/animatedText"
import { create } from "@/helpers/bem"

import styles from "./Headline.module.scss"

import type { HeadlineProps, HeadlineVariant } from "./Headline.model"

const bem = create(styles, "Headline")

export const POSSIBLE_HIGHLIGHTS: HeadlineVariant[] = [
  "inherit",
  "primary",
  "secondary",
  "white",
]

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

  const customStyle = useMemo(() => {
    if (typeof size === "number") {
      return {
        fontSize: `${size}em`,
      }
    }
    return {}
  }, [size])

  const ariaLabel =
    typeof props.children === "string" ? props.children : undefined

  const baseProps = useMemo(
    () => ({
      "aria-label": ariaLabel,
      className: bemClass,
      style: customStyle,
      node: undefined,
      ...schema,
    }),
    [ariaLabel, bemClass, customStyle, schema],
  )

  const animateText = useCallback(
    (children: ReactNode) =>
      animated ? (
        <AnimatedText {...animationProps}>{children as string}</AnimatedText>
      ) : (
        children
      ),
    [animated, animationProps],
  )

  const renderHTag = useCallback(
    (attr: HTMLAttributes<HTMLHeadingElement>) => {
      if (!/^h[1-6]$/.test(type)) return null // Only allow h1–h6
      const children = attr.children as ReactNode
      const HTag = type as keyof Pick<
        JSX.IntrinsicElements,
        "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      >
      return (
        <HTag {...attr} aria-level={parseInt(type[1] ?? "", 10)} {...baseProps}>
          {animateText(children)}
        </HTag>
      )
    },
    [type, baseProps, animateText],
  )

  if (isRichtext) {
    return (
      <ReactMarkdown
        className={bem("headline")}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: props => renderHTag(props as HTMLAttributes<HTMLHeadingElement>),
        }}
      >
        {props.children as string}
      </ReactMarkdown>
    )
  }

  return renderHTag(props as HTMLAttributes<HTMLHeadingElement>)
}
