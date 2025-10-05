import { isValidElement, type JSX } from "react"

import { create } from "@/helpers/bem"
import { localizeDate, type LocalizedDate } from "@/helpers/date"
import { isString } from "@/helpers/validations"

import { Card, type CardProps } from "../card"
import { Headline, type HeadlineProps } from "../headline"
import { Image, type ImageProps } from "../image"
import { Link } from "../link"

import styles from "./PostWidget.module.scss"

import type { PostWidgetProps, PostWidgetItem } from "./PostWidget.model"

const bem = create(styles, "PostWidget")

export function PostWidgetView({
  fullWidth,
  className,
  title,
  listClassName, // legacy
  contentClassName, // legacy
  items = [],
  classes,
  componentsProps,
  structuredData = true,
  ...rest
}: PostWidgetProps): JSX.Element {
  const cardMerged = {
    animated: true,
    enableShadow: true,
    ...(componentsProps?.card as Partial<CardProps>),
    ...(rest as Partial<CardProps>),
    variant: (componentsProps?.card?.variant ??
      (rest as Partial<CardProps>)?.variant ??
      undefined) as CardProps["variant"],
  }
  return (
    <section
      itemScope
      className={bem(
        undefined,
        undefined,
        [className, classes?.root].filter(Boolean).join(" "),
      )}
      itemType="https://schema.org/ItemList
"
    >
      <Card
        {...cardMerged}
        className={bem("card__container", undefined, classes?.cardContainer)}
        contentClassName={bem(
          "card",
          undefined,
          [contentClassName, classes?.card].filter(Boolean).join(" "),
        )}
      >
        {title && (
          <Headline
            highlight
            size="md"
            type="h2"
            {...{ ...title, ...(componentsProps?.title ?? {}) }}
            itemProp="headline"
            className={bem(
              "title",
              undefined,
              [title?.className, classes?.title].filter(Boolean).join(" "),
            )}
            variant={
              title?.variant ?? componentsProps?.title?.variant ?? "secondary"
            }
          >
            {title?.content}
          </Headline>
        )}

        <ul
          className={bem(
            "list",
            { "has-fullWidth": Boolean(fullWidth) },
            [listClassName, classes?.list].filter(Boolean).join(" "),
          )}
        >
          {items.map((item: PostWidgetItem, i: number) => {
            const imgBase = item.image as ImageProps | undefined
            const imgMerged: ImageProps | undefined = imgBase
              ? ({
                  ...imgBase,
                  ...(componentsProps?.image ?? {}),
                  ...(item.componentsProps?.image ?? {}),
                  className: bem(
                    "image",
                    undefined,
                    [imgBase.className, classes?.image, item.classes?.image]
                      .filter(Boolean)
                      .join(" "),
                  ),
                  containerClassName: bem(
                    "image__container",
                    undefined,
                    classes?.imageContainer,
                  ),
                  decoding:
                    item.componentsProps?.image?.decoding ??
                    componentsProps?.image?.decoding ??
                    imgBase.decoding ??
                    "async",
                  loading:
                    item.componentsProps?.image?.loading ??
                    componentsProps?.image?.loading ??
                    imgBase.loading ??
                    "lazy",
                  sizes:
                    item.componentsProps?.image?.sizes ??
                    componentsProps?.image?.sizes ??
                    imgBase.sizes ??
                    "(max-width: 960px) 100vw, 20vw",
                  ...(isValidElement(imgBase?.imageComponent)
                    ? { imageComponent: imgBase.imageComponent }
                    : {}),
                } as ImageProps)
              : undefined

            const linkMerged = {
              ...(componentsProps?.link ?? {}),
              ...(item.componentsProps?.link ?? {}),
              ...item.redirect,
              className: bem(
                "image__link",
                undefined,
                [
                  item.redirect?.className,
                  classes?.imageLink,
                  item.classes?.imageLink,
                ]
                  .filter(Boolean)
                  .join(" "),
              ),
              "aria-label": `Read more about ${item.title.content}`,
            } as const

            const headlineMerged: HeadlineProps = {
              size: "sm",
              type: "h3",
              variant: "inherit" as const,
              ...(item.title ?? {}),
              ...(componentsProps?.title ?? {}),
              ...(item.componentsProps?.headline ?? {}),
              className: bem(
                "headline",
                undefined,
                [
                  item.title?.className,
                  classes?.headline,
                  item.classes?.headline,
                ]
                  .filter(Boolean)
                  .join(" "),
              ),
            }
            let formattedDate: LocalizedDate | undefined
            if (isString(item?.date)) {
              formattedDate = localizeDate(item?.locale ?? "en-GB", item?.date)
            }
            return (
              <li
                key={`post-widget-item-${item.title?.content ?? i}`}
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
                className={bem(
                  "list__item",
                  { "has-fullWidth": Boolean(fullWidth) },
                  [classes?.listItem, item.classes?.li]
                    .filter(Boolean)
                    .join(" "),
                )}
              >
                <article
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                  className={bem(
                    "list__item__content",
                    undefined,
                    item.classes?.article ?? classes?.listItemContent,
                  )}
                >
                  {imgMerged && (
                    <header className={item.classes?.header}>
                      <Link {...linkMerged}>
                        <Image {...imgMerged} itemProp="image" />
                      </Link>
                    </header>
                  )}

                  <div
                    className={bem(
                      "content",
                      undefined,
                      [classes?.content, item.classes?.content]
                        .filter(Boolean)
                        .join(" "),
                    )}
                  >
                    <Link
                      {...(componentsProps?.link ?? {})}
                      {...(item.componentsProps?.link ?? {})}
                      {...item.redirect}
                      aria-label={`Read more about ${item.title.content}`}
                    >
                      <Headline {...headlineMerged} itemProp="headline">
                        {item.title?.content}
                      </Headline>
                    </Link>

                    {isString(formattedDate?.locale) && (
                      <p
                        aria-label={`Published at ${formattedDate?.locale}`}
                        className={bem(
                          "date",
                          undefined,
                          [classes?.date, item.classes?.date]
                            .filter(Boolean)
                            .join(" "),
                        )}
                      >
                        <time
                          aria-label={`Published at ${formattedDate?.locale}`}
                          className={bem("date")}
                          itemProp="datePublished"
                          {...item?.dateProps}
                        >
                          {formattedDate?.meta}
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
            )
          })}
        </ul>
      </Card>

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: items.map((item, index) => {
                let formattedDate: LocalizedDate | undefined
                if (isString(item?.date)) {
                  formattedDate = localizeDate(
                    item?.locale ?? "en-GB",
                    item?.date,
                  )
                }
                return {
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "BlogPosting",
                    headline: item.title?.content,
                    datePublished: isString(formattedDate?.meta)
                      ? formattedDate?.meta
                      : undefined,
                    articleSection: item.category,
                    image: isString(
                      (item.image as ImageProps | undefined)?.src as string,
                    )
                      ? [(item.image as ImageProps).src]
                      : undefined,
                  },
                }
              }),
            }),
          }}
        />
      )}
    </section>
  )
}
