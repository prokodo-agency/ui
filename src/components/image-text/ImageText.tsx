import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Button } from "../button"
import { Grid, GridRow } from "../grid"
import { Headline } from "../headline"
import { Image } from "../image"
import { Lottie } from "../lottie"
import { RichText } from "../rich-text"

import styles from "./ImageText.module.scss"

import type { ImageTextProps } from "./ImageText.model"
import type { FC } from "react"

const bem = create(styles, "ImageText")

export const ImageText: FC<ImageTextProps> = ({
  animatedBorder,
  reverse,
  subTitle,
  subTitleProps,
  title,
  titleProps,
  content,
  animation,
  image,
  button,
}) => {
  /* istanbul ignore next */
  const leftColumnMd = image
    ? animatedBorder
      ? 4
      : 6
    : animatedBorder
      ? 10
      : 12

  return (
    <div className={bem()}>
      <Grid
        className={bem("grid", {
          "is-reverse": Boolean(reverse),
        })}
      >
        <GridRow className={bem("content")} md={leftColumnMd} xs={10}>
          <Animated>
            {isString(subTitle) && (
              <Headline
                highlight
                size="sm"
                type="h3"
                variant="primary"
                {...subTitleProps}
                className={bem(
                  "sub__headline",
                  undefined,
                  /* istanbul ignore next */
                  subTitleProps?.className,
                )}
              >
                {subTitle}
              </Headline>
            )}
            <Headline
              size="lg"
              type="h2"
              {...titleProps}
              className={bem(
                "headline",
                undefined,
                /* istanbul ignore next */ titleProps?.className,
              )}
            >
              {title}
            </Headline>
            {isString(content) && (
              <RichText className={bem("content__paragraph")}>
                {content}
              </RichText>
            )}
            {button && (
              <Button
                variant="outlined"
                {...button}
                className={bem("button", undefined, button?.className)}
              />
            )}
          </Animated>
        </GridRow>
        {image && (
          <GridRow className={bem("image")} md={6} xs={10}>
            <Animated className={bem("animated__container")}>
              {
                /* istanbul ignore next */ isString(animation) ? (
                  <Lottie
                    animation={animation as string}
                    className={bem("animation")}
                  />
                ) : (
                  <Image className={bem("image__src")} {...image} />
                )
              }
            </Animated>
          </GridRow>
        )}
      </Grid>
    </div>
  )
}
