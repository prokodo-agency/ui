import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
import type { IconProps } from "@/components/icon"
import type { Ref, ReactNode, HTMLAttributes, KeyboardEvent } from "react"

export type DialogChangeReson = "backdropClick" | "escapeKeyDown"

/** Imperative handle for opening/closing the dialog */
export type DialogRef = {
  openDialog: () => void
  closeDialog: () => void
}

/** A single action button in the dialog footer */
export type DialogAction = Omit<ButtonProps, "id" | "title"> & {
  id: string
  title?: string
}

/** Collection of action buttons */
export type DialogActions = DialogAction[]

/** Text labels for cancel/close controls */
export type DialogTranslations = {
  close: string
}

/**
 * Props for the *view* component (DialogView).
 * These are exactly what get spread onto the outer `<div>` plus
 * your custom dialog fields.
 */
export type DialogViewProps = HTMLAttributes<HTMLDivElement> & {
  /** is the panel open right now? */
  open?: boolean
  /** the title text */
  title?: string
  /** passthrough into your `<Headline>` (but *not* its children) */
  titleProps?: Omit<HeadlineProps, "children">
  hideTitle?: boolean
  renderHeader?: () => ReactNode
  hideCloseButton?: boolean
  translations?: DialogTranslations
  actions?: DialogAction[]
  wrapperProps?: HTMLAttributes<HTMLDivElement>
  contentProps?: HTMLAttributes<HTMLDivElement>
  contentRef?: Ref<HTMLDivElement>
  containerChildren?: ReactNode
  /** extra class on the header region */
  classNameHeader?: string
  scroll?: "paper" | "body"
  fullScreen?: boolean
  onClose?: () => void
  onCloseKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  children?: ReactNode
  closeOnBackdropClick?: boolean
  closeButtonProps?: Omit<
    HTMLAttributes<HTMLButtonElement>,
    "ref" | "onClick" | "onKeyDown"
  > & {
    iconProps?: IconProps
  }
  /** focus the “X” button when the dialog opens */
  closeButtonRef?: Ref<HTMLButtonElement>
  /** if you need to trap focus around the whole container */
  containerRef?: Ref<HTMLDivElement>
}

/**
 * Props for your *client-side wrapper* (DialogClient),
 * which adds the `ref`, the `open?: boolean` flag
 */
export type DialogProps = Omit<
  DialogViewProps,
  "open" | "onChange" | "onCloseKeyDown"
> & {
  /** initial open flag from the page or parent */
  open?: boolean
  /** callback signature */
  onChange?: (event: unknown, reason: DialogChangeReson, state: boolean) => void
  /** your imperative handle */
  ref?: Ref<DialogRef>
}
