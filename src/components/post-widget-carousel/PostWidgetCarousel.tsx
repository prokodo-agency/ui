"use client"
import {
  type FC,
  Fragment,
  memo,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { create } from "@/helpers/bem"

import { Button } from "../button"
import { Card } from "../card"
import { Carousel, type CarouselRef } from "../carousel"
import { Headline } from "../headline"
import { Image } from "../image"
import { Link } from "../link"

import styles from "./PostWidgetCarousel.module.scss"

import type {
  PostWidgetCarouselProps,
  PostWidgetCarouselItem,
} from "./PostWidgetCarousel.model"

const bem = create(styles, "PostWidgetCarousel")

export const PostWidgetCarousel: FC<PostWidgetCarouselProps> = memo(
  ({ autoplay, className, title, items = [], ...props }) => {
    const ref = useRef<CarouselRef>(null)
    const [carouselWidth, setCarouselWidth] = useState(0)
    useLayoutEffect(() => {
      const containerWidth = ref?.current?.carouselContainer?.offsetWidth ?? 0
      setCarouselWidth(containerWidth)
      const handleResize = () => {
        setCarouselWidth(containerWidth)
      }
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [ref])
    return (
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
          contentClassName={bem("card")}
          variant="white"
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
          {items.length > 0 && (
            <Fragment>
              <Carousel
                ref={ref}
                autoplay={autoplay}
                className={bem("carousel")}
                classNameDots={bem("carousel__dots")}
                classNameItem={bem("carousel__item")}
                itemsToShow={1}
              >
                {items.map((item: PostWidgetCarouselItem) => {
                  const key = `carousel-item-${item.title}`
                  return (
                    <Fragment key={key}>
                      {item?.image && (
                        <Link
                          aria-label={`Read more about ${item.title.content}`}
                          {...item?.redirect}
                          className={bem(
                            "carousel__item__image__link",
                            undefined,
                            item?.redirect?.className,
                          )}
                          style={{
                            width: carouselWidth,
                          }}
                        >
                          <Image
                            key={key}
                            className={bem("carousel__item__image")}
                            {...item.image}
                          />
                        </Link>
                      )}
                      <Link
                        {...item?.redirect}
                        aria-label={`Read more about ${item.title.content}`}
                        className={bem("carousel__item__link")}
                      >
                        <Headline
                          size="md"
                          type="h3"
                          {...item.title}
                          className={bem("headline", item.title?.className)}
                          itemProp="headline"
                          variant="inherit"
                        >
                          {item.title?.content}
                        </Headline>
                      </Link>
                    </Fragment>
                  )
                })}
              </Carousel>
              <div className={bem("carousel__buttons")}>
                <Button
                  aria-label="Last category"
                  className={bem("carousel__button")}
                  color="primary"
                  iconProps={{
                    name: "ArrowLeft01Icon",
                    size: "sm",
                  }}
                  onClick={() => ref.current?.slidePrev()}
                />
                <Button
                  aria-label="Next category"
                  className={bem("carousel__button")}
                  color="primary"
                  iconProps={{
                    name: "ArrowRight01Icon",
                    size: "sm",
                  }}
                  onClick={() => ref.current?.slideNext()}
                />
              </div>
            </Fragment>
          )}
        </Card>
      </section>
    )
  },
)

PostWidgetCarousel.displayName = "PostWidgetCarousel"
