"use client"
import {
  type JSX,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
} from "react"
import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { AnimatedText } from "@/components/animatedText"
import { create } from "@/helpers/bem"

import styles from "./Headline.module.scss"
import { POSSIBLE_HIGHLIGHTS } from "./Headline.variants"

import type { HeadlineProps } from "./Headline.model"

const bem = create(styles, "Headline")

export const HeadlineClient: FC<HeadlineProps> = ({
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
    if (typeof size === "number")
      return {
        fontSize: `${size}em`,
      }
    return {}
  }, [size])

  const ariaLabel =
    typeof children === "string" ? children : undefined
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
      Boolean(animated) ? (
        <AnimatedText {...animationProps}>
          {children as ReactNode & string}
        </AnimatedText>
      ) : (
        children
      ),
    [animated, animationProps],
  )

  const renderHTag = useCallback(
    (attr: HTMLAttributes<HTMLHeadingElement>) => {
      if (type[1] === undefined) return null
      // Map the `type` prop to appropriate heading tags
      const HTag: keyof JSX.IntrinsicElements = type
      return (
        <HTag {...attr} aria-level={parseInt(type[1], 10)} {...baseProps}>
          {animateText(children)}
        </HTag>
      )
    },
    [type, baseProps, animateText],
  )

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
        {children as string}
      </Markdown>
    )
  }
  return renderHTag(props as HTMLAttributes<HTMLHeadingElement>)
}