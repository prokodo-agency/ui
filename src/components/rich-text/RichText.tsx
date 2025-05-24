"use client"

import { type FC, type ReactNode, memo, useCallback, useMemo } from "react"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import ReactMarkdown from "react-markdown"

import { AnimatedText } from "@/components/animatedText"
import { Headline } from "@/components/headline"
import { Icon } from "@/components/icon"
import { Link } from "@/components/link"
import { create } from "@/helpers/bem"
import { isNull } from "@/helpers/validations"

import styles from "./RichText.module.scss"

import type { RichTextProps } from "./RichText.model"
import type { ElementContent, Element, Text } from "hast"

const bem = create(styles, "RichText")

function isElement(node: ElementContent): node is Element {
  return isNull(node) && "tagName" in node
}

function isText(node?: ElementContent): node is Text {
  return !isNull(node) && node?.type === "text" && "value" in node
}

export const RichText: FC<RichTextProps> = memo(
  ({
    className,
    animated,
    animationProps = {},
    variant = "primary",
    schema = {},
    itemProp,
    children,
    ...props
  }) => {
    const baseProps = useMemo(
      () => ({
        animated,
        className: className ?? undefined,
        ...schema,
      }),
      [animated, schema, className],
    )

    const headlineProps = useMemo(
      () => ({
        animationProps,
      }),
      [animationProps],
    )

    const renderAnimation = useCallback(
      (children: ReactNode) => {
        if (animated === false || animated === undefined) return children
        return (
          <AnimatedText {...animationProps}>
            {children as ReactNode & string}
          </AnimatedText>
        )
      },
      [animated, animationProps],
    )

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: props => (
            <Headline {...baseProps} {...headlineProps} size="xxl" type="h1">
              {props?.children}
            </Headline>
          ),
          h2: props => (
            <Headline {...baseProps} {...headlineProps} size="xl" type="h2">
              {props?.children}
            </Headline>
          ),
          h3: props => (
            <Headline {...baseProps} {...headlineProps} size="lg" type="h3">
              {props?.children}
            </Headline>
          ),
          h4: props => (
            <Headline {...baseProps} {...headlineProps} size="md" type="h4">
              {props?.children}
            </Headline>
          ),
          h5: props => (
            <Headline {...baseProps} {...headlineProps} size="sm" type="h5">
              {props?.children}
            </Headline>
          ),
          h6: props => (
            <Headline {...baseProps} {...headlineProps} size="xs" type="h6">
              {props?.children}
            </Headline>
          ),
          p: props => (
            <p
              {...baseProps}
              className={bem("p", undefined, baseProps?.className)}
              itemProp={itemProp}
            >
              {renderAnimation(props?.children)}
            </p>
          ),
          a: props => (
            <Link
              {...baseProps}
              aria-label={props?.children?.toString()}
              href={props?.href ?? "#"}
            >
              {renderAnimation(props?.children)}
            </Link>
          ),
          pre: props => (
            <pre
              {...baseProps}
              className={bem("pre", undefined, baseProps?.className)}
            >
              {renderAnimation(props?.children)}
            </pre>
          ),
          ul: props => (
            <ul
              {...baseProps}
              className={bem("ul", undefined, baseProps?.className)}
            >
              {renderAnimation(props?.children)}
            </ul>
          ),
          ol: ({ node }) => (
            <ol
              {...baseProps}
              className={bem("ol", undefined, baseProps?.className)}
            >
              {node?.children.map((e: ElementContent, index: number) => {
                if (
                  isElement(e) &&
                  e.children.length > 0 &&
                  isText(e.children[0])
                ) {
                  return (
                    <li
                      key={`item-${e.children[0].value}`}
                      {...baseProps}
                      className={bem("li", undefined, baseProps?.className)}
                    >
                      <i className={bem("ol__decimal")}>{index + 1}</i>
                      {renderAnimation(<span>{e.children[0].value}</span>)}
                    </li>
                  )
                }
                return null
              })}
            </ol>
          ),
          li: props => (
            <li
              {...baseProps}
              className={bem("li", undefined, baseProps?.className)}
            >
              <Icon
                className={bem("li__icon")}
                color={variant}
                name="ArrowRight01Icon"
                size={18}
              />
              {renderAnimation(<span>{props?.children}</span>)}
            </li>
          ),
        }}
        {...props}
      >
        {children}
      </ReactMarkdown>
    )
  },
)

RichText.displayName = "RichText"
