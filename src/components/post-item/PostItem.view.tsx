import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Button } from "../button"
import { Card } from "../card"
import { Headline } from "../headline"
import { RichText } from "../rich-text"
import { Skeleton } from "../skeleton"

import styles from "./PostItem.module.scss"
import { PostItemAuthor } from "./PostItemAuthor"

import type { PostItemProps, PostItemViewPrivateProps } from "./PostItem.model"
import type { JSX } from "react"

const bem = create(styles, "PostItem")

export function PostItemView(
  props: PostItemProps & PostItemViewPrivateProps,
): JSX.Element {
  const {
    className,
    readCount = 0,
    title,
    content,
    category,
    author,
    date,
    metaDate,
    image,
    button,
    ImageComponent,

    // private from client/server wrappers
    isClient,
    hasImage,
    imageLoaded,
    onImageLoad,
    wordCount,
    readMinutes,

    // public opts
    structuredData = true,
    animate = true,
  } = props

  const ArticleWrapper = animate
    ? Animated
    : ({
        children,
        className,
      }: {
        children: React.ReactNode
        className?: string
      }) => <div className={className}>{children}</div>
  return (
    <article
      itemScope
      className={bem(undefined, undefined, className)}
      itemType="https://schema.org/BlogPosting"
    >
      <div className={bem("grid")}>
        <div className={bem("main")}>
          <ArticleWrapper className={bem("animation")}>
            <header>
              <Headline
                className={bem("headline", undefined, title?.className)}
                size="lg"
                type="h2"
                {...title}
              >
                {title.content}
              </Headline>

              <div className={bem("info")}>
                {author && (
                  <PostItemAuthor avatar={author.avatar} name={author.name} />
                )}

                {isString(date) && (
                  <p
                    aria-label={`Published on ${date}`}
                    className={bem("date")}
                  >
                    <time dateTime={metaDate} itemProp="datePublished">
                      {date}
                    </time>
                  </p>
                )}

                {readMinutes > 0 && (
                  <p
                    aria-label={`${readMinutes} min read`}
                    className={bem("reading__time")}
                  >
                    · {readMinutes} min read
                  </p>
                )}

                {readCount > 0 && (
                  <div
                    itemScope
                    aria-label={`${readCount} reads`}
                    className={bem("read__count")}
                    itemProp="interactionStatistic"
                    itemType="https://schema.org/InteractionCounter"
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
                <RichText className={bem("content__paragraph")}>
                  {content}
                </RichText>
              </div>
            )}

            {button && (
              <Button
                variant="outlined"
                {...button}
                className={bem("button", undefined, button?.className)}
                contentClassName={bem(
                  "button__content",
                  undefined,
                  button?.contentClassName,
                )}
              />
            )}
          </ArticleWrapper>
        </div>

        {(Boolean(hasImage) ||
          (!Boolean(isClient) && isString(image?.src as string))) && (
          <aside className={bem("media")}>
            <Card
              enableShadow
              background={image?.src as string}
              className={bem("image__wrapper")}
              contentClassName={bem("image__content__wrapper")}
              redirect={button?.redirect}
            >
              {Boolean(isClient) && !Boolean(imageLoaded) && (
                <Skeleton
                  aria-busy={!Boolean(imageLoaded)}
                  aria-live="polite"
                  height="275px"
                />
              )}
              {Boolean(isClient) &&
                Boolean(hasImage) &&
                ImageComponent &&
                isString(image?.src as string) && (
                  <ImageComponent
                    {...image}
                    className={bem("image")}
                    decoding={image?.decoding ?? "async"}
                    fetchPriority={image?.fetchPriority}
                    loading={image?.loading ?? "lazy"}
                    sizes={image?.sizes ?? "(max-width: 960px) 100vw, 25vw"}
                    onLoad={onImageLoad}
                  />
                )}
            </Card>
          </aside>
        )}
      </div>

      {wordCount > 0 && (
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
              datePublished: metaDate,
              articleSection: category,
              wordCount,
              author: isString(author?.name)
                ? { "@type": "Person", name: author?.name }
                : undefined,
              image: isString(image?.src as string) ? [image?.src] : undefined,
            }),
          }}
        />
      )}
    </article>
  )
}
