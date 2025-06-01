import type { ButtonProps } from '../button'
import type { HeadlineProps } from '../headline'
import type { HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react'

/**
 * Anchor positions for the drawer.
 */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom'

/**
 * Reasons the drawer was closed.
 */
export type DrawerChangeReason = 'backdropClick' | 'escapeKeyDown'

/**
 * Imperative ref‐handles for Drawer.
 */
export type DrawerRef = {
  /** Open the drawer programmatically */
  openDrawer: () => void
  /** Close the drawer programmatically, with optional reason */
  closeDrawer: (reason?: DrawerChangeReason) => void
}

/**
 * Props for DrawerView & DrawerServer/Client.
 */
export interface DrawerProps {
  /**
   * Imperative ref to open/close.
   */
  ref?: Ref<DrawerRef>

  /**
   * If true, initial drawer is open.
   */
  open?: boolean

  /**
   * A heading/title for the drawer (optional).
   * If provided, View will render it with an <h2> via Headline.
   */
  title?: string
  titleProps?: HeadlineProps

  /**
   * If true, drawer takes full screen (height or width depending on anchor).
   */
  fullscreen?: boolean

  /**
   * Which edge to anchor the drawer on.
   * Defaults to "left".
   */
  anchor?: DrawerAnchor

  /**
   * Control whether clicking on the backdrop closes the drawer.
   * Defaults to true.
   */
  closeOnBackdropClick?: boolean

  /**
   * Option overwrittes for the close button
   */
  closeButtonProps?: ButtonProps

  /**
   * Callback when open‐state changes. Receives (event, reason).
   */
  onChange?: (event: unknown, reason: DrawerChangeReason) => void

  /**
   * Optional custom header component. If omitted, View renders a simple
   * H2 + close‐button if `title` is provided.
   */
  renderHeader?: () => ReactNode

  /**
   * Extra CSS class for the outermost <div> (backdrop + wrapper).
   */
  className?: string

  /**
   * Extra CSS class for the inner container (sliding panel).
   */
  containerClassName?: string

  /**
   * Anything you want rendered inside the drawer body.
   */
  children?: ReactNode
}

/**
 * Props are exactly `DrawerProps` plus some internal refs.
 *
 * - `open`: whether drawer is visible (controls CSS classes).
 * - `onClose`: callback (closeDrawer) coming from Client.
 * - `closeButtonRef`: ref to the “×” button for focus‐management.
 * - `containerRef`: ref to the sliding container to trap focus inside.
 * - `closeOnBackdropClick`: whether backdrop mousedown should close.
 */
export interface DrawerViewProps extends DrawerProps {
  open?: boolean
  onClose?: (reason: 'backdropClick' | 'escapeKeyDown') => void
  closeButtonRef?: React.RefObject<HTMLButtonElement | null>
  containerRef?: React.RefObject<HTMLDivElement | null>
  backdropProps?: HTMLAttributes<HTMLDivElement>
  onMouseDown?: MouseEventHandler<HTMLDivElement>
}
