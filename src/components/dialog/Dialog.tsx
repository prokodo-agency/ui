"use client"
import { Modal } from "@mui/base"
import {
  type FC,
  type KeyboardEvent,
  useState,
  useImperativeHandle,
  useCallback,
} from "react"

import { Button, type ButtonProps } from "@/components/button"
import { Headline } from "@/components/headline"
import { getIconSize } from "@/components/icon"
import Cancel01Icon from "@/components/icon/loaders/Cancel01Icon"
import { create } from "@/helpers/bem"

import styles from "./Dialog.module.scss"

import type { DialogProps } from "./Dialog.model"

const bem = create(styles, "Dialog")

export const Dialog: FC<DialogProps> = ({
  actions,
  children,
  className,
  classNameHeader,
  containerChildren,
  contentProps = {},
  contentRef,
  fullScreen,
  hideTitle,
  onClose,
  open,
  ref,
  renderHeader,
  scroll = "paper",
  showCloseButton,
  title,
  titleProps = {},
  translations,
  ...props
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(open ?? false)
  const [transitionState, setTransitionState] = useState<
    "entering" | "exiting"
  >("exiting")

  const handleClose = useCallback(() => {
    setTransitionState("exiting")
    setTimeout(() => {
      setDialogOpen(false)
      if (onClose) {
        onClose({}, "backdropClick")
      }
    }, 300)
  }, [onClose])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        handleClose()
      }
    },
    [handleClose],
  )

  useImperativeHandle(
    ref,
    () => ({
      openDialog: () => {
        setDialogOpen(true)
        setTimeout(() => {
          setTransitionState("entering")
        }, 300)
      },
      closeDialog: handleClose,
    }),
    [handleClose],
  )

  const fullScreenModifier = {
    fullScreen: Boolean(fullScreen),
  }
  return (
    <Modal
      {...props}
      aria-labelledby="dialog-title"
      open={dialogOpen}
      className={bem(
        undefined,
        {
          ...fullScreenModifier,
          "fade-enter": transitionState === "entering",
          "fade-exit": transitionState === "exiting",
        },
        className,
      )}
      onClose={handleClose}
    >
      <>
        <div
          className={bem("container", {
            ...fullScreenModifier,
            "is-visible": dialogOpen,
            [`scroll-${scroll}`]: true,
          })}
        >
          <div className={bem("header", undefined, classNameHeader)}>
            <div>
              <Headline
                {...titleProps}
                id="dialog-title"
                className={bem("title", {
                  "is-hidden": Boolean(hideTitle),
                })}
              >
                {title}
              </Headline>
              {renderHeader?.()}
            </div>
            {Boolean(showCloseButton) && (
              <div
                aria-label={(translations?.close ?? "Close dialog") as string}
                className={bem("close")}
                role="button"
                tabIndex={0}
                onClick={handleClose}
                onKeyDown={handleKeyDown}
              >
                <span className={bem("close__label")}>
                  {translations?.cancel ?? "Cancel"}
                </span>
                <Button
                  inert
                  color="inherit"
                  icon={<Cancel01Icon size={getIconSize("sm")} />}
                  tabIndex={-1}
                  variant="text"
                />
              </div>
            )}
          </div>
          <div
            {...contentProps}
            ref={contentRef}
            className={bem(
              "content",
              {
                [`scroll-${scroll}`]: true,
              },
              contentProps?.className,
            )}
          >
            {children}
          </div>
          {actions && actions.length > 0 && (
            <div className={bem("actions")}>
              {actions.map(action => (
                <Button
                  key={`dialog-action-button-${action.id}`}
                  {...(action as ButtonProps)}
                />
              ))}
            </div>
          )}
        </div>
        {containerChildren !== undefined && containerChildren}
      </>
    </Modal>
  )
}

Dialog.displayName = "Dialog"
