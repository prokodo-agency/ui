import { Button } from "@/components/button"
import { Headline } from "@/components/headline"
import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"
import { isNumber } from "@/helpers/validations"

import styles from "./Dialog.module.scss"

import type { DialogViewProps } from "./Dialog.model"
import type { JSX } from "react"

const bem = create(styles, "Dialog")

export function DialogView({
  open,
  title,
  containerRef,
  hideTitle = false,
  renderHeader,
  hideCloseButton = false,
  translations,
  actions = [],
  contentProps = {},
  contentRef,
  containerChildren,
  className,
  classNameHeader,
  actionsClassName,
  height,
  scroll = "paper",
  fullScreen = false,
  titleProps = {},
  children,
  onClose,
  onCloseKeyDown,
  wrapperProps,
  closeOnBackdropClick = true,
  closeButtonProps,
  closeButtonRef,
  ...rest
}: DialogViewProps): JSX.Element {
  // Modifikatoren für den Container (innen)
  const containerMods = {
    fullScreen,
    [`scroll-${scroll}`]: true,
  }
  // Modifikatoren für Wrapper (Animation)
  const wrapperMods = {
    fullScreen,
    "is-visible": Boolean(open),
  }
  // Modifier for dialog max height
  const styleModifier = isNumber(height)
    ? /* istanbul ignore next */ {
        maxHeight: `${height}px`,
      }
    : undefined

  const renderDialog = () => (
    <div
      aria-describedby="dialog-content"
      aria-labelledby="dialog-title"
      aria-modal="true"
      role="dialog"
      {...rest}
      className={bem(undefined, wrapperMods, className)}
      style={styleModifier}
    >
      <div
        ref={containerRef}
        className={bem("container", containerMods)}
        style={styleModifier}
      >
        <div className={bem("header", undefined, classNameHeader)}>
          <div>
            <Headline
              {...titleProps}
              className={bem("title", { "is-hidden": hideTitle })}
              id="dialog-title"
            >
              {title}
            </Headline>
            {/* istanbul ignore next */}
            {renderHeader?.()}
          </div>

          {!Boolean(hideCloseButton) && (
            <button
              {...closeButtonProps}
              ref={closeButtonRef}
              aria-label={
                /* istanbul ignore next */
                closeButtonProps?.["aria-label"] ?? translations?.close
              }
              className={bem(
                "header__button",
                undefined,
                /* istanbul ignore next */
                closeButtonProps?.className,
              )}
              onClick={onClose}
              onKeyDown={onCloseKeyDown}
            >
              <Icon
                name="Cancel01Icon"
                size="xs"
                /* istanbul ignore next */
                {...closeButtonProps?.iconProps}
                className={bem(
                  "header__button__icon",
                  undefined,
                  /* istanbul ignore next */
                  closeButtonProps?.iconProps?.className,
                )}
              />
              {/* istanbul ignore next */}
              {closeButtonProps?.title ?? translations?.close ?? "Close"}
            </button>
          )}
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div aria-hidden="true" tabIndex={0} />

        <div
          {...contentProps}
          ref={contentRef}
          id="dialog-content"
          className={bem(
            "content",
            { [`scroll-${scroll}`]: true },
            contentProps.className,
          )}
        >
          {children}
        </div>

        {actions.length > 0 && (
          <div className={bem("actions", undefined, actionsClassName)}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <div aria-hidden="true" tabIndex={0} />
            {actions.map(action => (
              <Button
                key={action.id}
                {...action}
                title={/* istanbul ignore next */ action?.title ?? ""}
              />
            ))}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <div aria-hidden="true" tabIndex={0} />
          </div>
        )}
      </div>

      {containerChildren}
    </div>
  )

  if (!closeOnBackdropClick || fullScreen) return renderDialog()
  return (
    <div
      className={bem("backdrop", { "is-visible": Boolean(open) })}
      {...wrapperProps}
    >
      {renderDialog()}
    </div>
  )
}
