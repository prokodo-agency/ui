import { Modal } from "@mui/base"
import {
  type FC,
  type SyntheticEvent,
  type ReactNode,
  useEffect,
  useState,
  useCallback,
  isValidElement,
} from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Button } from "../button"
import { Headline } from "../headline"

import styles from "./Drawer.module.scss"

import type { DrawerProps } from "./Drawer.model"

const bem = create(styles, "Drawer")

export const renderDrawerTitle = (title?: string): ReactNode | undefined =>
  isString(title) && (
    <Headline size="md" type="h2">
      {title}
    </Headline>
  )

export const renderDrawerCloseButton = (
  onClose?: (event: SyntheticEvent) => void,
): ReactNode => (
  <Button
    aria-label="Close dialog"
    color="info"
    role="button"
    variant="text"
    iconProps={{
      name: "Cancel01Icon",
      size: "sm",
    }}
    onClick={onClose}
  />
)

export const Drawer: FC<DrawerProps> = ({
  open,
  title,
  fullscreen,
  className,
  containerClassName,
  children,
  anchor = "left",
  disabled,
  renderHeader,
  onClose,
  ...props
}) => {
  const [transitionState, setTransitionState] = useState<
    "entering" | "exiting"
  >("entering")

  useEffect(() => {
    setTimeout(() => {
      setTransitionState("entering")
    }, 300)
  }, [open])

  const handleClose = useCallback(() => {
    setTransitionState("exiting")
    setTimeout(() => {
      if (onClose) {
        onClose({}, "backdropClick")
      }
    }, 300)
  }, [onClose])

  const renderCustomHeader = useCallback(() => {
    if (!isValidElement(renderHeader?.())) {
      return (
        <div
          className={bem("header", {
            "has-title": Boolean(title),
          })}
        >
          {renderDrawerTitle(title)}
          {Boolean(disabled) && renderDrawerCloseButton(handleClose)}
        </div>
      )
    }
    return renderHeader()
  }, [title, disabled, handleClose, renderHeader])
  return (
    <Modal
      aria-labelledby={title}
      disableEscapeKeyDown={disabled}
      open={open}
      {...props}
      className={bem(undefined, undefined, className)}
      onClose={handleClose}
    >
      <div
        className={bem(
          "container",
          {
            open: !!open,
            fullscreen: Boolean(fullscreen),
            [`anchor-${anchor}`]: Boolean(anchor),
            [`anchor-${anchor}--open`]: !!open,
            [`anchor-${anchor}--enter`]: transitionState === "entering",
            [`anchor-${anchor}--exit`]: transitionState === "exiting",
          },
          containerClassName,
        )}
      >
        {renderCustomHeader()}
        <div className={bem("content")}>{children}</div>
      </div>
    </Modal>
  )
}
