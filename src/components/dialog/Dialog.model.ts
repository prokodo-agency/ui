import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
import type { IconProps } from "@/components/icon"
import type { Ref, ReactNode, HTMLAttributes, KeyboardEvent } from "react"

/** Close reason: backdrop click or Escape key press. */
export type DialogChangeReson = "backdropClick" | "escapeKeyDown"

/**
 * Imperative ref handle for Dialog.
 * Allows programmatic open/close control.
 */
export type DialogRef = {
  /** Open dialog programmatically. */
  openDialog: () => void
  /** Close dialog programmatically. */
  closeDialog: () => void
}

/**
 * Single action button in dialog footer.
 * Requires unique id, button label optional.
 */
export type DialogAction = Omit<ButtonProps, "id" | "title"> & {
  /** Unique action ID (required for event tracking). */
  id: string
  /** Button label text. */
  title?: string
}

/** Array of action buttons for dialog footer. */
export type DialogActions = DialogAction[]

/** Localization labels for close/cancel controls. */
export type DialogTranslations = {
  /** Close button aria-label and title. */
  close: string
}

/**
 * Dialog view component props.
 * Internal type for view layer, used by DialogClient.
 */
export type DialogViewProps = HTMLAttributes<HTMLDivElement> & {
  /** Is dialog currently open/visible. */
  open?: boolean
  /** Dialog title text. */
  title?: string
  /** Headline component props for title styling (variant, size, etc). */
  titleProps?: Omit<HeadlineProps, "children">
  /** Height constraint (CSS height value). */
  height?: number
  /** Hide title/header section entirely. */
  hideTitle?: boolean
  /** Custom header content (takes precedence over title + titleProps). */
  renderHeader?: () => ReactNode
  /** Hide close button (X icon). Default: false. */
  hideCloseButton?: boolean
  /** Localization labels. */
  translations?: DialogTranslations
  /** Action buttons rendered in footer. */
  actions?: DialogAction[]
  /** Props for wrapper div (dialog backdrop/portal). */
  wrapperProps?: HTMLAttributes<HTMLDivElement>
  /** Props for content area (main body). */
  contentProps?: HTMLAttributes<HTMLDivElement>
  /** Ref to content container. */
  contentRef?: Ref<HTMLDivElement>
  /** Additional children to render in container (before content). */
  containerChildren?: ReactNode
  /** Header region class name. */
  classNameHeader?: string
  /** Actions region class name. */
  actionsClassName?: string
  /** Scroll behavior: "paper" (dialog scrolls) or "body" (background scrolls). */
  scroll?: "paper" | "body"
  /** Full-screen dialog (ignores height, fills viewport). */
  fullScreen?: boolean
  /** Close button click handler. */
  onClose?: () => void
  /** Close button keyboard event handler (Escape, Enter, Space). */
  onCloseKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
  /** Dialog content (main body). */
  children?: ReactNode
  /** Close dialog when clicking outside (backdrop). Default: true. */
  closeOnBackdropClick?: boolean
  /** Props for close button element (X icon button). */
  closeButtonProps?: Omit<
    HTMLAttributes<HTMLButtonElement>,
    "ref" | "onClick" | "onKeyDown"
  > & {
    /** Icon props for close button X icon. */
    iconProps?: IconProps
  }
  /** Ref to close button element (for focus management). */
  closeButtonRef?: Ref<HTMLButtonElement>
  /** Ref to dialog container (for focus trap/management). */
  containerRef?: Ref<HTMLDivElement>
}

/**
 * Dialog component props.
 * Renders a modal dialog with header, content, footer actions, and backdrop.
 *
 * @example
 * // Basic dialog
 * <Dialog
 *   open={isOpen}
 *   title="Confirm"
 *   onChange={(e, reason, state) => setOpen(state)}
 * >
 *   <p>Are you sure?</p>
 * </Dialog>
 *
 * @example
 * // Dialog with actions
 * <Dialog
 *   open={open}
 *   title="Delete Item"
 *   actions={[
 *     { id: "cancel", title: "Cancel", variant: "outlined" },
 *     { id: "delete", title: "Delete", color: "error" }
 *   ]}
 *   onChange={handleChange}
 * >
 *   Item will be permanently removed.
 * </Dialog>
 *
 * @example
 * // Programmatic control
 * const dialogRef = useRef<DialogRef>(null);
 * <Dialog ref={dialogRef} {...props}>{content}</Dialog>
 * <button onClick={() => dialogRef.current?.openDialog()}>Open</button>
 */
export type DialogProps = Omit<
  DialogViewProps,
  "open" | "onChange" | "onCloseKeyDown"
> & {
  /** Initial open state (controlled prop). */
  open?: boolean
  /**
   * Open state change callback.
   * Receives: (event, close reason, new state).
   */
  onChange?: (event: unknown, reason: DialogChangeReson, state: boolean) => void
  /** Imperative ref for programmatic dialog control. */
  ref?: Ref<DialogRef>
}
