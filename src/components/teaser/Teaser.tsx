import { type FC, memo } from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Card } from "../card"
import { Headline } from "../headline"
import { Icon } from "../icon"
import { Image, type ImageProps } from "../image"
import { Lottie } from "../lottie"
import { RichText } from "../rich-text"

import styles from "./Teaser.module.scss"

import type { TeaserProps } from "./Teaser.model"

const bem = create(styles, "Teaser")

export const Teaser: FC<TeaserProps> = memo(
  ({
    className,
    variant = "primary",
    animation,
    lineClamp,
    align,
    image,
    title,
    content,
    onClick,
    redirect,
    ...props
  }) => (
    <Card
      variant={variant}
      {...props}
      className={bem(undefined, undefined, className)}
      contentClassName={bem("card")}
      redirect={redirect}
      onClick={onClick}
    >
      {animation && (
        <Lottie animationName={animation} className={bem("animation")} />
      )}
      {image && (
        <div className={bem("image__wrapper")}>
          <Image
            {...(image as ImageProps)}
            captionClassName={bem("image__caption")}
            className={bem("image")}
            containerClassName={bem("image")}
          />
        </div>
      )}
      <div className={bem("card__content")}>
        <Headline
          align={align ?? "center"}
          size="md"
          type="h3"
          {...title}
          variant={title?.variant ?? variant}
          className={bem(
            "headline",
            {
              "has-lineClamp": Boolean(lineClamp),
            },
            title?.className,
          )}
        >
          {title?.content}
        </Headline>
        {isString(content) && (
          <RichText
            className={bem("content", {
              "has-lineClamp": Boolean(lineClamp),
              [`align-${align}`]: !!align,
            })}
          >
            {content}
          </RichText>
        )}
        {isString(redirect?.label) && (
          <span className={bem("link")}>
            <Icon
              color={variant}
              name="ArrowRight01Icon"
              size="xs"
              {...redirect?.icon}
              className={bem(
                "link__icon",
                undefined,
                redirect?.icon?.className,
              )}
            />
            {redirect?.label}
          </span>
        )}
      </div>
    </Card>
  ),
)

Teaser.displayName = "Teaser"
