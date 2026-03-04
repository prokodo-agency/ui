import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Card, type CardProps } from "../card"
import { Carousel } from "../carousel"
import { Headline, type HeadlineProps } from "../headline"
import { Image, type ImageProps } from "../image"
import { Link } from "../link"

import styles from "./PostWidgetCarousel.module.scss"

import type {
  PostWidgetCarouselProps,
  PostWidgetCarouselItem,
} from "./PostWidgetCarousel.model"
import type { JSX } from "react"

const bem = create(styles, "PostWidgetCarousel")

export function PostWidgetCarouselView(
  props: PostWidgetCarouselProps,
): JSX.Element {
  const {
    autoplay = 5000,
    className,
    title,
    items = [],
    classes,
    componentsProps,
    structuredData = true,
    color,
    ...rest
  } = props

  const cardMerged = {
    animated: true,
    enableShadow: true,
    ...(componentsProps?.card as Partial<CardProps>),
    ...(rest as Partial<CardProps>),
    color: (componentsProps?.card?.color ??
      (rest as Partial<CardProps>)?.color ??
      color ??
      "white") as CardProps["color"],
  }

  return (
    <section
      itemScope
      itemType="https://schema.org/ItemList"
      className={bem(
        undefined,
        undefined,
        [className, classes?.root].filter(Boolean).join(" "),
      )}
    >
      <Card
        {...cardMerged}
        className={bem("card__container", undefined, classes?.cardContainer)}
        contentClassName={bem("card", undefined, classes?.card)}
      >
        {title && (
          <Headline
            highlight
            {...{ ...title, ...(componentsProps?.title ?? {}) }}
            itemProp="headline"
            size="md"
            type="h2"
            className={bem(
              "title",
              undefined,
              [title?.className, classes?.title].filter(Boolean).join(" "),
            )}
            color={
              title?.color ??
              componentsProps?.title?.color ??
              (color && color !== "white"
                ? (color as HeadlineProps["color"])
                : /* istanbul ignore next */ undefined) ??
              "inherit"
            }
          >
            {title?.content}
          </Headline>
        )}

        {items.length > 0 && (
          <Carousel
            enableControl
            autoplay={autoplay}
            className={bem("carousel", undefined, classes?.carousel)}
            enableDots={false}
            itemsToShow={1}
            classNameButtons={bem(
              "carousel__button",
              undefined,
              classes?.carouselButton,
            )}
            classNameControls={bem(
              "carousel__buttons",
              undefined,
              classes?.carouselButtons,
            )}
            classNameDots={bem(
              "carousel__dots",
              undefined,
              classes?.carouselDots,
            )}
            classNameItem={bem(
              "carousel__item",
              undefined,
              classes?.carouselItem,
            )}
            classNameWrapper={bem(
              "carousel__wrapper",
              undefined,
              classes?.carouselWrapper,
            )}
            nextButton={{
              variant: "contained",
              color: ((color && color !== "white"
                ? color
                : /* istanbul ignore next */ undefined) ??
                "primary") as "primary",
              ...componentsProps?.nextButton,
              iconProps: {
                size: "sm",
                ...componentsProps?.nextButton?.iconProps,
              },
            }}
            prevButton={{
              variant: "contained",
              color: ((color && color !== "white"
                ? color
                : /* istanbul ignore next */ undefined) ??
                "primary") as "primary",
              ...componentsProps?.prevButton,
              iconProps: {
                size: "sm",
                ...componentsProps?.prevButton?.iconProps,
              },
            }}
          >
            {items.map((item: PostWidgetCarouselItem, idx: number) => {
              const key = `carousel-item-${item.title?.content ?? /* istanbul ignore next */ idx}`

              const imgBase = item.image as ImageProps | undefined
              /* istanbul ignore next */
              const imgMerged: ImageProps | undefined = imgBase
                ? ({
                    ...imgBase,
                    ...(componentsProps?.image ?? {}),
                    ...(item.componentsProps?.image ?? {}),
                    className: bem(
                      "carousel__item__image",
                      undefined,
                      [
                        imgBase.className,
                        classes?.carouselItemImage,
                        item.classes?.image,
                      ]
                        .filter(Boolean)
                        .join(" "),
                    ),
                    containerClassName: bem("carousel__item__image__container"),
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
                      "(max-width: 960px) 100vw, 100vw",
                  } as ImageProps)
                : undefined

              const linkMerged = {
                ...(componentsProps?.link ?? {}),
                ...(item.componentsProps?.link ?? {}),
                ...item.redirect,
                className: bem(
                  "carousel__item__image__link",
                  undefined,
                  [
                    item.redirect?.className,
                    classes?.carouselItemImageLink,
                    item.classes?.imageLink,
                  ]
                    .filter(Boolean)
                    .join(" "),
                ),
                "aria-label": `Read more about ${item.title.content}`,
              } as const

              return (
                <div key={key}>
                  {imgMerged && (
                    <Link {...linkMerged}>
                      <Image
                        {...imgMerged}
                        className={bem(
                          "carousel__item__image",
                          undefined,
                          classes?.carouselItemImage,
                        )}
                        containerClassName={bem(
                          "carousel__item__image__container",
                        )}
                      />
                    </Link>
                  )}
                  <Link
                    {...(componentsProps?.link ?? {})}
                    {...(item.componentsProps?.link ?? {})}
                    {...item.redirect}
                    aria-label={`Read more about ${item.title.content}`}
                    className={bem(
                      "carousel__item__link",
                      undefined,
                      [classes?.carouselItemLink, item.classes?.link]
                        .filter(Boolean)
                        .join(" "),
                    )}
                  >
                    <Headline
                      size="md"
                      type="h3"
                      {...item.title}
                      {...(componentsProps?.title ?? {})}
                      {...(item.componentsProps?.headline ?? {})}
                      itemProp="headline"
                      className={bem(
                        "headline",
                        undefined,
                        [
                          item.title?.className,
                          classes?.carouselItem,
                          item.classes?.headline,
                        ]
                          .filter(Boolean)
                          .join(" "),
                      )}
                      color={
                        item.title?.color ??
                        componentsProps?.title?.color ??
                        (color && color !== "white"
                          ? (color as HeadlineProps["color"])
                          : /* istanbul ignore next */ undefined) ??
                        "inherit"
                      }
                    >
                      {item.title?.content}
                    </Headline>
                  </Link>
                </div>
              )
            })}
          </Carousel>
        )}
      </Card>

      {structuredData && items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "BlogPosting",
                  headline: item.title?.content,
                  image: isString(
                    (item.image as ImageProps | undefined)?.src as string,
                  )
                    ? [(item.image as ImageProps).src]
                    : undefined,
                },
              })),
            }),
          }}
        />
      )}
    </section>
  )
}
