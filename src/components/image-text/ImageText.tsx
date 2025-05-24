"use client"
import { type FC, useState } from "react"

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

const bem = create(styles, "ImageText")

export const ImageText: FC<ImageTextProps> = ({
  animatedBorder,
  reverse,
  subTitle,
  title,
  content,
  animation,
  image,
  button,
}) => {
  const [lineVisible, setLineVisible] = useState(false)
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
        {animatedBorder && (
          <GridRow className={bem("animated__border__wrapper")} sm={2} xs={3}>
            <Animated
              className={bem("animated__border", {
                "is-visible": lineVisible,
                [`${animatedBorder?.direction ?? "top-to-bottom"}`]:
                  !!animatedBorder?.direction,
              })}
              onAnimate={visible => setLineVisible(visible)}
            />
          </GridRow>
        )}
        <GridRow className={bem("content")} md={leftColumnMd} xs={10}>
          <Animated
          // animation={screenLargerThanMd ? "left-right" : "bottom-top"}
          >
            {subTitle && (
              <Headline
                highlight
                className={bem("sub__headline", undefined, subTitle?.className)}
                size="sm"
                type="h3"
                variant="primary"
                {...subTitle}
              >
                {subTitle?.content}
              </Headline>
            )}
            <Headline
              className={bem("headline", undefined, title?.className)}
              size="lg"
              type="h2"
              {...title}
            >
              {title.content}
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
            <Animated
              // animation={screenLargerThanMd ? "right-left" : "bottom-top"}
              className={bem("animated__container")}
            >
              {animation ? (
                <Lottie
                  animationName={animation}
                  className={bem("animation")}
                />
              ) : (
                <Image className={bem("image__src")} {...image} />
              )}
            </Animated>
          </GridRow>
        )}
      </Grid>
    </div>
  )
}
