"use client"
import {
  type FC,
  type MouseEvent,
  type KeyboardEvent,
  useMemo,
  useRef,
  useId,
} from "react"

import { isString } from "@/helpers/validations"

import { create } from "@/helpers/bem"

import { Icon } from "../icon"
import { Link } from "../link"
import { Loading } from "../loading"

import styles from "./Button.module.scss"

import type { ButtonDefaultProps, ButtonProps } from "./Button.model"

const bem = create(styles, "Button")

const mockEvent = {} as MouseEvent<HTMLButtonElement>
const mockKeyDownEvent = {} as KeyboardEvent<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({
  id,
  fullWidth,
  color = "primary",
  iconProps = {},
  loading,
  variant = "contained",
  className,
  contentClassName,
  disabled,
  redirect,
  ...props
}) => {
  const uniqueId = useId()
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const ariaLabelId = `Button-${uniqueId}`
  const isOutlined = variant === "outlined"
  const iconName = iconProps?.name
  const isIconOnly = iconName && !(props as ButtonDefaultProps)?.title
  const iconModifier = useMemo(
    () => ({
      "icon-only": Boolean(isIconOnly),
    }),
    [isIconOnly],
  )

  const renderInnerContent = () => (
    <span ref={labelRef} aria-labelledby={ariaLabelId} className={bem("title")}>
      {iconName && (
        <Icon className={bem("icon", iconModifier)} {...iconProps} />
      )}
      {(props as ButtonDefaultProps)?.title}
    </span>
  )

  const renderContent = () => {
    if (Boolean(loading)) {
      return <Loading size="xs" />
    }
    return renderInnerContent()
  }

  const renderVariant = () => {
    if (isOutlined) {
      return (
        <div className={bem("content", iconModifier, contentClassName)}>
          {renderContent()}
        </div>
      )
    }
    return renderContent()
  }

  if (redirect) {
    return (
      <Link
        disabled={disabled}
        href={redirect.href}
        className={bem(
          undefined,
          {
            "has-fullWidth": Boolean(fullWidth),
            [`has-variant-${variant}`]: true,
            [`has-bg-${color}`]: variant === "contained",
            [`has-text-${color}`]: variant === "text",
            "is-disabled": Boolean(disabled),
            ...iconModifier,
          },
          className,
        )}
        onClick={() => props?.onClick?.(mockEvent)}
        onKeyDown={() => props?.onKeyDown?.(mockKeyDownEvent)}
      >
        {renderVariant()}
      </Link>
    )
  }
  return (
    <button
      {...props}
      color={color}
      disabled={Boolean(disabled) || Boolean(loading)}
      id={`${ariaLabelId}${isString(id) ? ` ${id}` : ""}`}
      className={bem(
        undefined,
        {
          "has-fullWidth": Boolean(fullWidth),
          [`has-variant-${variant}`]: true,
          [`has-bg-${color}`]: variant === "contained",
          [`has-text-${color}`]: variant === "text",
          "is-disabled": Boolean(disabled),
          ...iconModifier,
        },
        className,
      )}
      tabIndex={
        redirect !== undefined || Boolean(disabled)
          ? -1
          : (props?.tabIndex ?? undefined)
      }
    >
      {renderVariant()}
    </button>
  )
}
