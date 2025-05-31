import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Avatar } from "../avatar"
import { Card } from "../card"
import { Headline } from "../headline"
import { RichText } from "../rich-text"

import styles from "./Quote.module.scss"

import type { QuoteProps } from "./Quote.model"
import type { FC } from "react"

const bem = create(styles, "Quote")

export const Quote: FC<QuoteProps> = ({
  className,
  variant = "primary",
  title,
  subTitle,
  content,
  author,
}) => (
  <figure
    itemScope
    className={bem(undefined, undefined, className)}
    itemType="https://schema.org/Quotation"
  >
    {subTitle && (
      <Headline
        highlight
        className={bem("sub_headline", undefined, subTitle?.className)}
        size="sm"
        type="h3"
        {...subTitle}
        variant={subTitle.variant ?? variant}
      >
        {subTitle?.content}
      </Headline>
    )}
    {title && (
      <Headline
        className={bem("headline", undefined, title?.className)}
        size="lg"
        type="h2"
        {...title}
      >
        {title.content}
      </Headline>
    )}
    <Card
      animated
      highlight
      className={bem("card__container")}
      contentClassName={bem("card")}
      customAnimation="left-right"
      variant="white"
    >
      <blockquote className={bem("quote")}>
        <RichText className={bem("quote__content")} itemProp="text">
          {content}
        </RichText>
      </blockquote>
      {author && (
        <figcaption>
          <div
            itemScope
            className={bem("caption")}
            itemType="https://schema.org/Person"
          >
            {author?.avatar && (
              <Avatar
                className={bem("caption__avatar")}
                {...author.avatar}
                variant={variant}
              />
            )}
            <div className={bem("caption__author")}>
              <span className={bem("caption__author__name")} itemProp="name">
                {author.name}
              </span>
              {isString(author?.position) && (
                <span
                  className={bem("caption__author__position")}
                  itemProp="jobTitle"
                >
                  {author.position}
                </span>
              )}
            </div>
          </div>
        </figcaption>
      )}
    </Card>
  </figure>
)

Quote.displayName = "Quote"
