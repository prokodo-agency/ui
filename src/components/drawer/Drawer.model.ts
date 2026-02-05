import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { HTMLAttributes, MouseEventHandler, ReactNode, Ref } from "react"

/**
 * Drawer anchor position (edge where drawer slides from).
 */
export type DrawerAnchor = "left" | "right" | "top" | "bottom"

/**
 * Reasons for drawer closure.
 * Passed to onChange callback to distinguish close triggers.
 */
export type DrawerChangeReason = "backdropClick" | "escapeKeyDown"

/**
 * Imperative ref handle for Drawer.
 * Allows programmatic open/close control.
 */
export type DrawerRef = {
  /** Open drawer programmatically. */
  openDrawer: () => void
  /** Close drawer programmatically with optional reason. */
  closeDrawer: (reason?: DrawerChangeReason) => void
}

/**
 * Drawer component props.
 * Renders a slide-out panel (sidebar) from edge with optional header and content.
 *
 * @example
 * // Basic drawer
 * <Drawer
 *   title="Menu"
 *   anchor="left"
 *   open={isOpen}
 *   onChange={(e, reason) => setIsOpen(false)}
 * >
 *   <nav>Navigation items</nav>
 * </Drawer>
 *
 * @example
 * // Full-screen drawer with actions
 * <Drawer
 *   ref={drawerRef}
 *   title="Edit Profile"
 *   fullscreen
 *   anchor="left"
 *   actions={[
 *     { id: "cancel", title: "Cancel" },
 *     { id: "save", title: "Save", color: "primary" }
 *   ]}
 * >
 *   <EditForm />
 * </Drawer>
 *
 * @a11y Keyboard navigation (Escape closes). Focus management within drawer.
 * @ssr Client-side rendering required for animations.
 */
export interface DrawerProps {
  /**
   * Imperative ref to open/close drawer programmatically.
   */
  ref?: Ref<DrawerRef>

  /**
   * Initially open (true) or closed (false). Controlled prop.
   */
  open?: boolean

  /**
   * Drawer title/heading text.
   * If provided, header renders with title + close button.
   */
  title?: string
  /** Headline component props for title styling (variant, size, weight). */
  titleProps?: HeadlineProps

  /**
   * Drawer takes full screen height (vertical) or width (horizontal).
   * Default: false (sized to content).
   */
  fullscreen?: boolean

  /**
   * Which edge the drawer slides from.
   * Default: "left".
   */
  anchor?: DrawerAnchor

  /**
   * Close when clicking outside (backdrop).
   * Default: true.
   */
  closeOnBackdropClick?: boolean

  /**
   * Props for close button (X icon).
   * Override color, variant, size, etc.
   */
  closeButtonProps?: ButtonProps

  /**
   * Open state change callback.
   * Receives: (event, reason) where reason = "backdropClick" | "escapeKeyDown".
   */
  onChange?: (event: unknown, reason: DrawerChangeReason) => void

  /** Hide header section (title + close button). */
  hideHeader?: boolean

  /**
   * Custom header content node.
   * Takes precedence over default title + close button header.
   * Use for complex header layouts.
   */
  renderHeader?: () => ReactNode

  /** Root container (backdrop + wrapper) class name. */
  className?: string

  /** Inner sliding panel class name. */
  containerClassName?: string

  /** Drawer content (rendered inside panel body). */
  children?: ReactNode
}

/**
 * Internal type for Drawer view layer.
 * Extends DrawerProps with view-specific state and handlers.
 */
export interface DrawerViewProps extends DrawerProps {
  /** Current open/closed state (managed by client component). */
  open?: boolean
  /** Close handler (called by view when close triggered). */
  onClose?: (reason: "backdropClick" | "escapeKeyDown") => void
  /** Ref to close button element (for focus management). */
  closeButtonRef?: React.RefObject<HTMLButtonElement | null>
  /** Ref to sliding container (for focus trap). */
  containerRef?: React.RefObject<HTMLDivElement | null>
  /** Backdrop div props (HTMLAttributes). */
  backdropProps?: HTMLAttributes<HTMLDivElement>
  /** Backdrop mouse down handler. */
  onMouseDown?: MouseEventHandler<HTMLDivElement>
}
