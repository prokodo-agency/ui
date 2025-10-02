"use client"

import { type FC, memo, useState, useEffect } from "react"

import { create } from "@/helpers/bem"
import { calculateWordCount } from "@/helpers/calculation"
import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Button } from "../button"
import { Card } from "../card"
import { Grid, GridRow } from "../grid"
import { Headline } from "../headline"
import { RichText } from "../rich-text"
import { Skeleton } from "../skeleton"

import styles from "./PostItem.module.scss"
import { PostItemAuthor } from "./PostItemAuthor"

import type { PostItemProps } from "./PostItem.model"

const bem = create(styles, "PostItem")

export const PostItem: FC<PostItemProps> = memo(
  ({
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
    imageComponent: ImageComponent,
  }) => {
    const wordCount = calculateWordCount(content)
    const [imageLoaded, setImageLoaded] = useState(!ImageComponent)

    useEffect(() => {
      if (!ImageComponent) setImageLoaded(true)
    }, [ImageComponent])

    return (
      <article
        itemScope
        className={bem(undefined, undefined, className)}
        itemType="http://schema.org/BlogPosting"
      >
        <Grid className={bem("grid")}>
          <GridRow className={bem("content")} md={image ? 8 : 12} xs={12}>
            <Animated className={bem("animation")}>
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
                      aria-label={`Published at ${date}`}
                      className={bem("date")}
                      itemProp="datePublished"
                    >
                      &#128197;&nbsp;&nbsp;
                      <time dateTime={metaDate} itemProp="datePublished">
                        {date}
                      </time>
                    </p>
                  )}
                  {readCount > 0 && (
                    <div
                      itemScope
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
            </Animated>
          </GridRow>

          <GridRow md={4} xs={12}>
            <Card
              enableShadow
              background={image?.src as string}
              className={bem("image__wrapper")}
              contentClassName={bem("image__content__wrapper")}
              redirect={button?.redirect}
            >
              {!imageLoaded && <Skeleton height="275px" />}
              {ImageComponent !== undefined &&
                isString(image?.src as string) && (
                  <ImageComponent
                    {...image}
                    className={bem("image")}
                    sizes="(max-width: 960px) 100vw, 25vw"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
            </Card>
          </GridRow>
        </Grid>

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

PostItem.displayName = "PostItem"
