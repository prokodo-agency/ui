import { Image } from "@/components/image"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Icon } from "../icon"
import { Loading } from "../loading"

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
  iconPosition = "start",
  isIconOnly,
  LinkComponent,
  loading,
  ...rest
}) => {
  const iconName = iconProps?.name
  const iconMod = { "icon-only": isIconOnly }
  const { title } = rest as ButtonDefaultProps
  const ariaLabel = rest["aria-label"] ?? title
  const rootClassName = [className, redirect?.className]
    .filter(isString)
    .join(" ")

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
      {loading && <Loading ariaLabel="Loading" size="xs" />}
      {/* title — always rendered so the button keeps its width */}
      {title !== undefined ? (
        <span className={bem("label")}>{title}</span>
      ) : null}
    </>
  )

  const variantNode = (
    <span className={bem("content", iconMod, contentClassName)}>{inner}</span>
  )

  const common = {
    id: rest.id,
    "aria-busy": loading || undefined,
    "aria-label": ariaLabel,
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
        "has-icon-end": iconPosition === "end" && !Boolean(isIconOnly),
        "is-disabled": Boolean(disabled),
        "is-loading": Boolean(loading),
        ...iconMod,
      },
      rootClassName,
    ),
  }

  return redirect ? (
    <LinkComponent
      {...common}
      disabled={disabled}
      download={redirect.download}
      href={redirect.href}
      linkComponent={redirect.linkComponent}
      rel={redirect.rel}
      style={{ ...redirect.style, ...rest.style }}
      tabIndex={Boolean(disabled) ? -1 : (rest.tabIndex ?? redirect.tabIndex)}
      target={redirect.target}
      onClick={rest.onClick ?? redirect.onClick}
      onKeyDown={rest.onKeyDown ?? redirect.onKeyDown}
    >
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
