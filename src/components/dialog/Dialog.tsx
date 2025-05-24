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
import { create } from "@/helpers/bem"

import styles from "./Dialog.module.scss"

import type { DialogProps } from "./Dialog.model"

const bem = create(styles, "Dialog")

export const Dialog: FC<DialogProps> = ({
  ref,
  contentRef,
  fullScreen,
  open,
  className,
  classNameHeader,
  title,
  titleProps = {},
  hideTitle,
  showCloseButton,
  contentProps = {},
  scroll = "paper",
  actions,
  renderHeader,
  onClose,
  children,
  containerChildren,
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
                className={bem("close")}
                role="button"
                tabIndex={0}
                aria-label={
                  (translations?.close ?? "Close dialog") as string
                }
                onClick={handleClose}
                onKeyDown={handleKeyDown}
              >
                <span className={bem("close__label")}>
                  {translations?.cancel ?? "Cancel"}
                </span>
                <Button
                  inert
                  color="inherit"
                  tabIndex={-1}
                  variant="text"
                  iconProps={{
                    name: "Cancel01Icon",
                    size: "sm",
                  }}
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
