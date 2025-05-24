"use client"
import { type FC, useCallback, useState, memo } from "react"

import { create } from "@/helpers/bem"
import { calculateWordCount } from "@/helpers/calculation"
import { isString } from "@/helpers/validations"

import { Card } from "../card"
import { Chip } from "../chip"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Image, type ImageProps } from "../image"
import { RichText } from "../rich-text"

import styles from "./PostTeaser.module.scss"

import type { PostTeaserProps } from "./PostTeaser.model"

const bem = create(styles, "PostTeaser")

export const PostTeaser: FC<PostTeaserProps> = memo(
  ({
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
    ...props
  }) => {
    const wordCount = calculateWordCount(content)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false)
    }, [])

    return (
      <article
        itemScope
        className={bem(undefined, undefined, className)}
        itemType="http://schema.org/BlogPosting"
      >
        <Card
          variant="white"
          {...props}
          className={bem("card__container")}
          contentClassName={bem("card")}
          highlight={isHovered}
          redirect={redirect}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <header>
            {isString(image?.src as string) && (
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
                  {readCount !== undefined && (
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
                          <span itemProp="userInteractionCount">
                            {readCount}
                          </span>
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
              </p>
            )}
            {redirect?.label !== undefined && isString(redirect?.label) && (
              <span
                className={bem("link", {
                  "is-hovered": isHovered,
                })}
              >
                <Icon
                  name="ArrowRight01Icon"
                  size="xs"
                  {...redirect?.icon}
                  color="primary"
                  className={bem(
                    "link__icon",
                    {
                      "is-hovered": isHovered,
                    },
                    redirect?.icon?.className,
                  )}
                />
                {redirect.label}
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
      </article>
    )
  },
)

PostTeaser.displayName = "PostTeaser"
