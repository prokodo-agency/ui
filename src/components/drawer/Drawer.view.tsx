import { Button } from "@/components/button"
import { Headline } from "@/components/headline"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Drawer.base.module.scss"
import { DrawerEffectsLoader } from "./Drawer.effects.client"

import type { DrawerViewProps } from "./Drawer.model"
import type { FC, HTMLAttributes } from "react"

const bem = create(styles, "Drawer")

export const DrawerView: FC<DrawerViewProps> = ({
  open,
  title,
  titleProps,
  anchor = "left",
  fullscreen = false,
  renderHeader,
  closeButtonRef,
  closeButtonProps,
  containerRef,
  className,
  containerClassName,
  children,
  onClose,
  backdropProps,
  ...rest
}) => {
  const isOpen = Boolean(open)
  return (
    <div
      aria-hidden={isOpen ? undefined : true}
      className={bem("backdrop", { open: isOpen })}
      {...backdropProps}
    >
      <DrawerEffectsLoader
        useSlide
        closeButtonRef={closeButtonRef}
        containerRef={containerRef}
        isOpen={isOpen}
        onClose={onClose}
      />
      {/*
        Inner container: stops propagation of mousedown so clicks INSIDE
        do not bubble up to backdrop.
      */}
      <div
        ref={containerRef}
        aria-labelledby={isString(title) ? "drawer-title" : undefined}
        role="dialog"
        {
          ...(isOpen
            ? { "aria-modal": "true" }
            : { "aria-hidden": "true", inert: true }) // presence = true
        }
        aria-modal={isOpen ? "true" : undefined}
        className={bem(
          "container",
          {
            open: isOpen,
            [`anchor-${anchor}`]: true,
            [`anchor-${anchor}--open`]: isOpen,
            fullscreen,
          },
          containerClassName,
        )}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {renderHeader ? (
          renderHeader()
        ) : (
          <div className={bem("header")}>
            {isString(title) && (
              <Headline size="md" {...titleProps} id="drawer-title">
                {title}
              </Headline>
            )}
            {/* Close‐button always shown in header if no custom renderHeader */}
            <Button
              aria-label="Close drawer"
              iconProps={{ name: "Cancel01Icon", size: "sm" }}
              variant="text"
              {...closeButtonProps}
              ref={closeButtonRef}
              onClick={() => onClose?.("escapeKeyDown")}
            />
          </div>
        )}

        <div className={bem("content", undefined, className)}>{children}</div>
      </div>
    </div>
  )
}
