import { Image } from "@/components/image"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Icon } from "../icon"
import { Loading, type LoadingColor } from "../loading"

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
  const isOutlined = variant === "outlined"
  const iconName = iconProps?.name
  const iconMod = { "icon-only": isIconOnly }
  const { title } = rest as ButtonDefaultProps

  // Spinner color: for contained buttons currentColor inherits from button text
  // (white for info/error, --pk-color-fg for others). For outlined/text we
  // explicitly pass the semantic color so the spinner matches the border/label.
  const spinnerColor: LoadingColor | undefined =
    variant !== "contained" ? (color as LoadingColor) : undefined

  const inner = (
    <>
      {/* image — hidden while loading */}
      {/* istanbul ignore next */}
      {!loading && image?.src !== undefined && (
        /* istanbul ignore next */
        <Image
          height={20}
          width={20}
          {...image}
          className={bem("image", undefined, image?.className)}
        />
      )}
      {/* icon — hidden while loading */}
      {!loading && iconName && (
        <Icon className={bem("icon", iconMod)} {...iconProps} />
      )}
      {/* spinner — shown while loading, before the label */}
      {loading && (
        <Loading ariaLabel="Loading" color={spinnerColor} size="xs" />
      )}
      {/* title — always rendered so the button keeps its width */}
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
        /* istanbul ignore next */ "has-image": image?.src !== undefined,
        "has-icon": !Boolean(isIconOnly) && isString(iconProps?.name),
        [`has-variant-${variant}`]: true,
        [`has-bg-${color}`]: variant === "contained",
        [`has-variant-${variant}--has-outline-${color}`]:
          variant === "outlined",
        [`has-text-${color}`]: variant === "text",
        "is-disabled": Boolean(disabled),
        "is-loading": Boolean(loading),
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
      /* istanbul ignore next */
      tabIndex={Boolean(disabled) ? -1 : rest.tabIndex}
      type="button"
      {...rest}
    >
      {variantNode}
    </button>
  )
}
