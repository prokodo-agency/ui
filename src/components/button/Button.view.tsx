import { Image } from "@/components/image"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Icon } from "../icon"

import styles from "./Button.module.scss"

import type { ButtonViewProps, ButtonDefaultProps } from "./Button.model"
import type { FC } from "react"

const bem = create(styles, "Button")

export const ButtonView: FC<ButtonViewProps> = ({
  buttonRef,
  fullWidth,
  color = "primary",
  variant = "contained",
  className,
  contentClassName,
  disabled,
  redirect,
  image,
  iconProps = {},
  isIconOnly,
  LinkComponent,
  loading,
  ...rest
}) => {
  void loading

  const isOutlined = variant === "outlined"
  const iconName = iconProps?.name
  const iconMod = { "icon-only": isIconOnly }
  const { title } = rest as ButtonDefaultProps

  const inner = (
    <>
      {image?.src !== undefined && (
        <Image
          height={20}
          width={20}
          {...image}
          className={bem("image", undefined, image?.className)}
        />
      )}
      {iconName && <Icon className={bem("icon", iconMod)} {...iconProps} />}
      {title}
    </>
  )

  const variantNode = isOutlined ? (
    <div className={bem("content", iconMod, contentClassName)}>{inner}</div>
  ) : (
    inner
  )

  const common = {
    id: rest.id,
    "aria-label": title ?? undefined,
    className: bem(
      undefined,
      {
        "has-fullWidth": Boolean(fullWidth),
        "has-image": image?.src !== undefined,
        "has-icon": !Boolean(isIconOnly) && isString(iconProps?.name),
        [`has-variant-${variant}`]: true,
        [`has-bg-${color}`]: variant === "contained",
        [`has-text-${color}`]: variant === "text",
        "is-disabled": Boolean(disabled),
        ...iconMod,
      },
      className,
    ),
  }

  return redirect ? (
    <LinkComponent {...common} disabled={disabled} href={redirect.href}>
      {variantNode}
    </LinkComponent>
  ) : (
    <button
      {...common}
      ref={buttonRef}
      disabled={Boolean(disabled)}
      tabIndex={Boolean(disabled) ? -1 : rest.tabIndex}
      type="button"
      {...rest}
    >
      {variantNode}
    </button>
  )
}
