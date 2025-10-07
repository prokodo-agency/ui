import { isValidElement, type JSX } from "react"

import { create } from "@/helpers/bem"
import { localizeDate, type LocalizedDate } from "@/helpers/date"
import { isNumber, isString } from "@/helpers/validations"

import { Card, type CardProps } from "../card"
import { Chip } from "../chip"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Image, type ImageProps } from "../image"
import { RichText } from "../rich-text"

import styles from "./PostTeaser.module.scss"

import type { PostTeaserViewProps } from "./PostTeaser.model"

const bem = create(styles, "PostTeaser")

export function PostTeaserView(props: PostTeaserViewProps): JSX.Element {
  const {
    locale,
    className,
    classes,
    componentsProps,

    image,
    readCount,
    wordCount,
    title,
    date,
    hideCategory,
    category,
    content,
    onClick,
    redirect,
    structuredData = true,

    // private
    isHovered,
    readMinutes,

    // passthrough hover
    onMouseEnter,
    onMouseLeave,
    ...cardRest
  } = props

  const cardMerged = {
    ...(componentsProps?.card as Partial<CardProps>),
    ...(cardRest as Partial<CardProps>),
    variant: (componentsProps?.card?.variant ??
      (cardRest as Partial<CardProps>)?.variant ??
      "white") as CardProps["variant"],
  }

  // Prepare Image props; avoid triggering the imageComponent-required branch
  const baseImg = image as ImageProps | undefined
  const imageMerged = baseImg
    ? ({
        ...baseImg,
        // classes
        captionClassName: bem("image__caption"),
        className: bem("image", undefined, classes?.image),
        containerClassName: bem(
          "image__container",
          undefined,
          classes?.imageContainer,
        ),
        // perf defaults
        decoding: baseImg.decoding ?? "async",
        loading: baseImg.loading ?? "lazy",
        sizes: baseImg.sizes ?? "(max-width: 960px) 100vw, 33vw",
        // IMPORTANT: do not explicitly set imageComponent if it's falsy
        ...(isValidElement(baseImg.imageComponent)
          ? { imageComponent: baseImg.imageComponent }
          : {}),
      } as ImageProps)
    : undefined
  let formattedDate: LocalizedDate | undefined
  if (isString(date)) {
    formattedDate = localizeDate(locale ?? "en-GB", date)
  }
  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      className={bem(
        undefined,
        undefined,
        [className, classes?.root].filter(Boolean).join(" "),
      )}
    >
      <Card
        {...cardMerged}
        className={bem("card__container")}
        contentClassName={bem("card")}
        highlight={Boolean(isHovered)}
        redirect={redirect}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <header className={classes?.header}>
          {isString((image as ImageProps | undefined)?.src as string) && (
            <div
              className={bem(
                "image__wrapper",
                undefined,
                classes?.imageWrapper,
              )}
            >
              <div className={bem("meta", undefined, classes?.meta)}>
                {isString(category) && hideCategory === false && (
                  <Chip
                    aria-label={`Category ${category}`}
                    color="primary"
                    label={category}
                    className={bem(
                      "meta__category",
                      undefined,
                      classes?.metaCategory,
                    )}
                    {...componentsProps?.categoryChip}
                  />
                )}
                {typeof readCount === "number" && (
                  <Chip
                    aria-label={`Read ${readCount} times`}
                    className={bem("meta__readcount__wrapper")}
                    color="white"
                    icon={<Icon name="EyeIcon" size="sm" />}
                    label={
                      <p
                        itemScope
                        className={bem("meta__readcount")}
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
                    {...componentsProps?.readCountChip}
                  />
                )}
              </div>
              <Image {...imageMerged} />
            </div>
          )}
          <Headline
            highlight
            size="sm"
            type="h3"
            {...{ ...title, ...(componentsProps?.headline ?? {}) }}
            className={bem(
              "headline",
              undefined,
              [title?.className, classes?.headline].filter(Boolean).join(" "),
            )}
            variant={
              title?.variant ??
              componentsProps?.headline?.variant ??
              "secondary"
            }
          >
            {title?.content}
          </Headline>
        </header>

        {isString(content) && (
          <div
            className={bem("card__content", undefined, classes?.cardContent)}
            itemProp="articleBody"
          >
            <RichText className={bem("content", undefined, classes?.content)}>
              {content}
            </RichText>
          </div>
        )}

        <div className={bem("card__footer", undefined, classes?.cardFooter)}>
          {isString(formattedDate?.locale) && (
            <p
              aria-label={`Published at ${date}`}
              className={bem("date", undefined, classes?.date)}
              itemProp="datePublished"
            >
              <time dateTime={formattedDate?.meta} itemProp="datePublished">
                {formattedDate?.locale}
              </time>
              {readMinutes > 0 ? ` · ${readMinutes} min read` : null}
            </p>
          )}
          {isString(redirect?.label) && (
            <span
              className={bem(
                "link",
                { "is-hovered": Boolean(isHovered) },
                classes?.link,
              )}
            >
              <Icon
                color="primary"
                name="ArrowRight01Icon"
                size="xs"
                className={bem(
                  "link__icon",
                  { "is-hovered": Boolean(isHovered) },
                  classes?.linkIcon,
                )}
                {...componentsProps?.linkIcon}
                {...redirect?.icon}
              />
              {redirect?.label}
            </span>
          )}
        </div>
      </Card>

      {isNumber(wordCount) && (wordCount as number) > 0 && (
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
              datePublished: isString(formattedDate?.meta)
                ? formattedDate?.meta
                : undefined,
              articleSection: category,
              readCount,
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
