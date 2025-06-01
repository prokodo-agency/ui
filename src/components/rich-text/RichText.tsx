import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { create } from "@/helpers/bem"

import { AnimatedText } from "../animatedText"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Link } from "../link"

import styles from "./RichText.module.scss"

import type { RichTextProps } from "./RichText.model"
import type { FC, ReactNode } from "react"

const bem = create(styles, "RichText")

export const RichText: FC<RichTextProps> = ({
  className,
  animated,
  animationProps = {},
  variant = "primary",
  schema = {},
  itemProp,
  linkComponent,
  children,
  ...props
}) => {
  const baseProps = {
    animated,
    className: className ?? undefined,
    ...schema,
  }
  const headlineProps = {
    animationProps,
  }
  const renderAnimation = (children: ReactNode) => {
    if (animated === false || animated === undefined) return children
    return (
      <AnimatedText {...animationProps}>
        {children as ReactNode & string}
      </AnimatedText>
    )
  }
  return (
    <Markdown
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
            className={bem("p", undefined, className ?? undefined)}
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
            linkComponent={linkComponent}
          >
            {renderAnimation(props?.children)}
          </Link>
        ),
        pre: props => (
          <pre
            {...baseProps}
            className={bem("pre", undefined, className ?? undefined)}
          >
            {renderAnimation(props?.children)}
          </pre>
        ),
        ul: props => (
          <ul
            {...baseProps}
            className={bem("ul", undefined, className ?? undefined)}
          >
            {renderAnimation(props?.children)}
          </ul>
        ),
        ol: props => (
          <ol
            {...baseProps}
            className={bem("ol", undefined, className ?? undefined)}
          >
            {renderAnimation(props?.children)}
          </ol>
        ),
        li: props => (
          <li
            {...baseProps}
            className={bem("li", undefined, className ?? undefined)}
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
    </Markdown>
  )
}

RichText.displayName = "RichText"
