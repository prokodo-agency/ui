"use client"
import { type FC, memo } from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Card } from "../card"
import { Headline } from "../headline"
import { Image } from "../image"
import { Link } from "../link"

import styles from "./PostWidget.module.scss"

import type { PostWidgetProps, PostWidgetItem } from "./PostWidget.model"

const bem = create(styles, "PostWidget")

export const PostWidget: FC<PostWidgetProps> = memo(
  ({
    fullWidth,
    className,
    title,
    listClassName,
    contentClassName,
    items = [],
    ...props
  }) => (
    <section
      itemScope
      className={bem(undefined, undefined, className)}
      itemType="https://schema.org/ItemList"
    >
      <Card
        animated
        enableShadow
        {...props}
        className={bem("card__container")}
        contentClassName={bem("card", undefined, contentClassName)}
      >
        {title && (
          <Headline
            highlight
            size="md"
            type="h2"
            {...title}
            className={bem("title", title?.className)}
            itemProp="headline"
            variant="secondary"
          >
            {title?.content}
          </Headline>
        )}
        <ul
          className={bem(
            "list",
            {
              "has-fullWidth": Boolean(fullWidth),
            },
            listClassName,
          )}
        >
          {items.map((item: PostWidgetItem, i: number) => (
            <li
              key={`post-widget-item-${item.title}`}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
              className={bem("list__item", {
                "has-fullWidth": Boolean(fullWidth),
              })}
            >
              <article
                itemScope
                className={bem("list__item__content")}
                itemType="https://schema.org/BlogPosting"
              >
                {item?.image && (
                  <header>
                    <Link
                      {...item?.redirect}
                      aria-label={`Read more about ${item.title.content}`}
                      className={bem(
                        "image__link",
                        undefined,
                        item?.redirect?.className,
                      )}
                    >
                      <Image
                        {...item?.image}
                        itemProp="image"
                        className={bem(
                          "image",
                          undefined,
                          item?.image?.className,
                        )}
                      />
                    </Link>
                  </header>
                )}
                <div className={bem("content")}>
                  <Link
                    {...item?.redirect}
                    aria-label={`Read more about ${item.title.content}`}
                  >
                    <Headline
                      size="sm"
                      type="h3"
                      {...item.title}
                      className={bem("headline", item.title?.className)}
                      itemProp="headline"
                      variant="inherit"
                    >
                      {item.title?.content}
                    </Headline>
                  </Link>
                  {isString(item?.date) && item?.date !== "LL" && (
                    <p
                      aria-label={`Published at ${item.date}`}
                      className={bem("date")}
                      itemProp="datePublished"
                    >
                      <time
                        aria-label={`Published at ${item.date}`}
                        className={bem("date")}
                        itemProp="datePublished"
                        {...item?.dateProps}
                      >
                        {item.date}
                      </time>
                    </p>
                  )}
                </div>
                <meta content={(i + 1).toString()} itemProp="position" />
                {isString(item?.category) && (
                  <meta content={item.category} itemProp="articleSection" />
                )}
              </article>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  ),
)

PostWidget.displayName = "PostWidget"
