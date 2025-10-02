import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Card } from "../card"
import { Chip } from "../chip"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Image, type ImageProps } from "../image"
import { RichText } from "../rich-text"

import styles from "./PostTeaser.module.scss"

import type {
  PostTeaserProps,
  PostTeaserViewPrivateProps,
} from "./PostTeaser.model"
import type { JSX } from "react"

const bem = create(styles, "PostTeaser")

export function PostTeaserView(
  props: PostTeaserProps &
    PostTeaserViewPrivateProps & {
      onMouseEnter?: () => void
      onMouseLeave?: () => void
    },
): JSX.Element {
  const {
    className,
    image,
    readCount,
    title,
    date,
    metaDate,
    hideCategory,
    category,
    content,
    onClick,
    redirect,
    structuredData = true,

    // private
    isHovered,
    wordCount,
    readMinutes,

    // passthrough hover
    onMouseEnter,
    onMouseLeave,
    ...cardProps
  } = props

  return (
    <article
      itemScope
      className={bem(undefined, undefined, className)}
      itemType="https://schema.org/BlogPosting
"
    >
      <Card
        variant="white"
        {...cardProps}
        className={bem("card__container")}
        contentClassName={bem("card")}
        highlight={Boolean(isHovered)}
        redirect={redirect}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <header>
          {isString((image as ImageProps | undefined)?.src as string) && (
            <div className={bem("image__wrapper")}>
              <div className={bem("meta")}>
                {isString(category) && hideCategory === false && (
                  <Chip
                    aria-label={`Category ${category}`}
                    className={bem("meta__category")}
                    color="primary"
                    label={category}
                  />
                )}
                {typeof readCount === "number" && (
                  <Chip
                    aria-label={`Read ${readCount} times`}
                    color="white"
                    icon={<Icon name="EyeIcon" size="sm" />}
                    label={
                      <p
                        itemScope
                        itemProp="interactionStatistic"
                        itemType="https://schema.org/InteractionCounter"
                      >
                        <meta
                          content="https://schema.org/ReadAction"
                          itemProp="interactionType"
                        />
                        <span itemProp="userInteractionCount">{readCount}</span>
                      </p>
                    }
                  />
                )}
              </div>
              <Image
                {...(image as ImageProps)}
                captionClassName={bem("image__caption")}
                className={bem("image")}
                containerClassName={bem("image")}
                decoding={
                  (image as ImageProps | undefined)?.decoding ?? "async"
                }
                loading={(image as ImageProps | undefined)?.loading ?? "lazy"}
                sizes={
                  (image as ImageProps | undefined)?.sizes ??
                  "(max-width: 960px) 100vw, 33vw"
                }
              />
            </div>
          )}
          <Headline
            highlight
            size="md"
            type="h3"
            {...title}
            className={bem("headline", title?.className)}
            variant={title?.variant ?? "secondary"}
          >
            {title?.content}
          </Headline>
        </header>

        {isString(content) && (
          <div className={bem("card__content")} itemProp="articleBody">
            <RichText className={bem("content")}>{content}</RichText>
          </div>
        )}

        <div className={bem("card__footer")}>
          {isString(date) && (
            <p
              aria-label={`Published at ${date}`}
              className={bem("date")}
              itemProp="datePublished"
            >
              <time dateTime={metaDate} itemProp="datePublished">
                {date}
              </time>
              {readMinutes > 0 ? ` · ${readMinutes} min read` : null}
            </p>
          )}
          {isString(redirect?.label) && (
            <span className={bem("link", { "is-hovered": Boolean(isHovered) })}>
              <Icon
                name="ArrowRight01Icon"
                size="xs"
                {...redirect?.icon}
                color="primary"
                className={bem(
                  "link__icon",
                  { "is-hovered": Boolean(isHovered) },
                  redirect?.icon?.className,
                )}
              />
              {redirect?.label}
            </span>
          )}
        </div>
      </Card>

      {wordCount > 0 && (
        <meta content={String(wordCount)} itemProp="wordCount" />
      )}
      {isString(category) && (
        <meta content={category} itemProp="articleSection" />
      )}

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title?.content,
              datePublished: metaDate,
              articleSection: category,
              wordCount,
              interactionStatistic:
                typeof readCount === "number"
                  ? {
                      "@type": "InteractionCounter",
                      interactionType: { "@type": "ReadAction" },
                      userInteractionCount: readCount,
                    }
                  : undefined,
              image: isString((image as ImageProps | undefined)?.src as string)
                ? [(image as ImageProps).src]
                : undefined,
            }),
          }}
        />
      )}
    </article>
  )
}
