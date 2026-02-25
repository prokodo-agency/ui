import { create } from "@/helpers/bem"
import { localizeDate, type LocalizedDate } from "@/helpers/date"
import { isNumber, isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Button } from "../button"
import { Card, type CardProps } from "../card"
import { Headline } from "../headline"
import { RichText } from "../rich-text"

import styles from "./PostItem.module.scss"
import { PostItemAuthor } from "./PostItemAuthor"

import type { PostItemProps, PostItemViewPrivateProps } from "./PostItem.model"
import type { JSX } from "react"

const bem = create(styles, "PostItem")

export function PostItemView(
  props: PostItemProps & PostItemViewPrivateProps,
): JSX.Element {
  const {
    locale,
    className,
    classes,
    componentsProps,

    readCount = 0,
    title,
    content,
    category,
    author,
    date,
    image,
    button,

    // private from client/server wrappers
    wordCount,
    readMinutes,

    // public opts
    structuredData = true,
    animate = true,
    ...rest
  } = props

  // Merge Card props without widening variant to string
  const cardMerged = {
    ...(componentsProps?.card as Partial<CardProps>),
    ...(rest as Partial<CardProps>),
    // keep variant narrow; if none is provided, let Card default handle it
    variant: (componentsProps?.card?.variant ??
      (rest as Partial<CardProps>)?.variant ??
      undefined) as CardProps["variant"],
  }
  const ArticleWrapper = animate
    ? Animated
    : ({
        children,
        className,
      }: {
        children: React.ReactNode
        className?: string
      }) => <div className={className}>{children}</div>
  let formattedDate: LocalizedDate | undefined
  if (isString(date)) {
    /* istanbul ignore next */
    formattedDate = localizeDate(locale ?? "en-GB", date)
  }
  return (
    <article
      itemScope
      className={bem(
        undefined,
        undefined,
        [className, classes?.root].filter(Boolean).join(" "),
      )}
      itemType="https://schema.org/BlogPosting
"
    >
      <div className={bem("grid", undefined, classes?.grid)}>
        <div className={bem("main", undefined, classes?.main)}>
          <ArticleWrapper
            className={bem("animation", undefined, classes?.animation)}
          >
            <header>
              <Headline
                {...{ ...title, ...(componentsProps?.headline ?? {}) }}
                size={title?.size ?? componentsProps?.headline?.size ?? "md"}
                type={title?.type ?? componentsProps?.headline?.type ?? "h2"}
                className={bem(
                  "headline",
                  undefined,
                  [
                    title?.className,
                    componentsProps?.headline?.className,
                    classes?.headline,
                  ]
                    .filter(Boolean)
                    .join(" "),
                )}
              >
                {title.content}
              </Headline>

              <div className={bem("info", undefined, classes?.info)}>
                {author && (
                  <PostItemAuthor
                    {...author}
                    {...(componentsProps?.author ?? {})}
                    avatar={author.avatar}
                    name={author.name}
                  />
                )}

                {isString(formattedDate?.locale) && (
                  <p
                    aria-label={`Published on ${formattedDate?.locale}`}
                    className={bem("date", undefined, classes?.date)}
                  >
                    <time
                      dateTime={formattedDate?.meta}
                      itemProp="datePublished"
                    >
                      {formattedDate?.locale}
                    </time>
                  </p>
                )}

                {readMinutes > 0 && (
                  <p
                    aria-label={`${readMinutes} min read`}
                    className={bem(
                      "reading__time",
                      undefined,
                      classes?.readingTime,
                    )}
                  >
                    · {readMinutes} min read
                  </p>
                )}

                {readCount > 0 && (
                  <div
                    itemScope
                    aria-label={`${readCount} reads`}
                    itemProp="interactionStatistic"
                    itemType="https://schema.org/InteractionCounter"
                    className={bem(
                      "read__count",
                      undefined,
                      classes?.readCount,
                    )}
                  >
                    <meta
                      content="https://schema.org/ReadAction"
                      itemProp="interactionType"
                    />
                    <span itemProp="userInteractionCount">{readCount}</span>
                  </div>
                )}
              </div>
            </header>

            {isString(content) && (
              <div itemProp="articleBody">
                <RichText
                  className={bem(
                    "content__paragraph",
                    undefined,
                    classes?.contentParagraph,
                  )}
                >
                  {content}
                </RichText>
              </div>
            )}

            {button && (
              <Button
                {...{ ...button, ...(componentsProps?.button ?? {}) }}
                className={bem(
                  "button",
                  undefined,
                  [
                    button?.className,
                    componentsProps?.button?.className,
                    classes?.button,
                  ]
                    .filter(Boolean)
                    .join(" "),
                )}
                contentClassName={bem(
                  "button__content",
                  undefined,
                  [button?.contentClassName, classes?.buttonContent]
                    .filter(Boolean)
                    .join(" "),
                )}
                variant={
                  button?.variant ??
                  componentsProps?.button?.variant ??
                  "outlined"
                }
              />
            )}
          </ArticleWrapper>
        </div>

        {isString(image) && (
          <aside className={bem("media", undefined, classes?.media)}>
            <Card
              {...cardMerged}
              background={image}
              enableShadow={cardMerged.enableShadow ?? true}
              redirect={button?.redirect}
              className={bem(
                "image__wrapper",
                undefined,
                classes?.imageWrapper,
              )}
              contentClassName={bem(
                "image__content__wrapper",
                undefined,
                classes?.imageContentWrapper,
              )}
            >
              <></>
            </Card>
          </aside>
        )}
      </div>

      {isNumber(wordCount) && (wordCount as number) > 0 && (
        <meta content={String(wordCount)} itemProp="wordCount" />
      )}
      {isString(category) && (
        <meta content={category} itemProp="articleSection" />
      )}

      {Boolean(structuredData) && (
        <script
          type="application/ld+json"
          // Minimal JSON-LD to complement microdata (avoid duplicate keys)
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title?.content,
              datePublished: isString(formattedDate?.meta)
                ? formattedDate?.meta
                : undefined,
              articleSection: category,
              wordCount,
              author: isString(author?.name)
                ? { "@type": "Person", name: author?.name }
                : undefined,
              image: isString(image as string) ? [image] : undefined,
            }),
          }}
        />
      )}
    </article>
  )
}
