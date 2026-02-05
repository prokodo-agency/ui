import type { CSSProperties, ReactNode } from "react"

/**
 * Responsive breakpoint values (px).
 * Used for grid auto-layout at different screen sizes.
 */
export type ResponsiveGridValue = number | { [key: string]: number }

/**
 * CSS Grid `gap` property value.
 * Horizontal and vertical spacing between grid items.
 */
export type GridGap = "xs" | "sm" | "md" | "lg" | "xl" | "none"

/**
 * Responsive grid breakpoint names/keys.
 * For responsive prop objects: { xs: value, sm: value, md: value, ... }
 */
export type GridBreakpoint = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * Grid layout columns configuration.
 * Can be fixed count (2, 3, 4, ...) or responsive object.
 * Responsive: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }.
 */
export type GridColumns = number | ResponsiveGridValue

/**
 * Grid item size as fraction of parent width.
 * - Single number (0-1): 100% × value
 * - Responsive object: { xs: 1, sm: 0.5, md: 0.33, ... }
 * Used for flexible column spans without CSS Grid columns.
 */
export type GridItemSize = number | ResponsiveGridValue

/**
 * Grid row height configuration.
 * Default auto (content-driven). Can be fixed (e.g., 300) or auto.
 */
export type GridRowHeight = number | "auto"

/**
 * Grid container props.
 * CSS Grid wrapper with responsive column counts and gap spacing.
 *
 * @example
 * // 3-column grid (all breakpoints)
 * <Grid columns={3} gap="md">
 *   <GridItem>Item 1</GridItem>
 *   <GridItem>Item 2</GridItem>
 * </Grid>
 *
 * @example
 * // Responsive columns
 * <Grid
 *   columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
 *   gap={{ xs: 'sm', md: 'lg' }}
 * >
 *   {Items}
 * </Grid>
 *
 * @a11y Grid layout is semantic when list or menu semantics required. Wrap with <ul> if needed.
 * @ssr Fully SSR-safe (no dynamic measurements).
 */
export interface GridProps {
  /**
   * Number of columns (fixed) or responsive breakpoint config.
   * Fixed: columns={3}
   * Responsive: columns={{ xs: 1, sm: 2, md: 3 }}
   */
  columns?: GridColumns

  /**
   * Gap (spacing) between grid items.
   * Accepts preset tokens: "xs" | "sm" | "md" | "lg" | "xl" | "none"
   * Or responsive: { xs: "sm", md: "lg" }
   */
  gap?: GridGap | { [key in GridBreakpoint]?: GridGap }

  /**
   * Row height (auto = content-driven, or fixed px height).
   * All rows same height when number provided.
   */
  rowHeight?: GridRowHeight

  /**
   * Horizontal alignment of items within cells.
   * Default: "stretch".
   */
  justifyItems?: CSSProperties["justifyItems"]

  /**
   * Vertical alignment of items within cells.
   * Default: "start".
   */
  alignItems?: CSSProperties["alignItems"]

  /**
   * Grid content alignment (block axis).
   */
  alignContent?: CSSProperties["alignContent"]

  /**
   * Auto-flow direction (row = left→right, column = top→bottom).
   * Default: "row".
   */
  autoFlow?: CSSProperties["gridAutoFlow"]

  /** Root container class name. */
  className?: string

  /** Root container inline styles. */
  style?: CSSProperties

  /** Grid items (children). */
  children?: ReactNode
}

/**
 * Grid item (child) props.
 * Positioned within CSS Grid layout.
 *
 * @example
 * // Fixed column span
 * <GridItem columns={2}>Spans 2 columns</GridItem>
 *
 * @example
 * // Responsive span
 * <GridItem columns={{ xs: 1, md: 2, lg: 3 }}>
 *   Item
 * </GridItem>
 */
export interface GridItemProps {
  /**
   * Column span (fixed or responsive).
   * Fixed: 1, 2, 3, etc.
   * Responsive: { xs: 1, md: 2 }
   */
  columns?: number | { [key in GridBreakpoint]?: number }

  /**
   * Row span (height count).
   */
  rows?: number

  /**
   * Item width as fraction of parent (0-1).
   * Used for flexible sizing without explicit Grid columns config.
   */
  size?: GridItemSize

  /**
   * Horizontal alignment override (justifySelf).
   * Overrides parent justifyItems.
   */
  justifySelf?: CSSProperties["justifySelf"]

  /**
   * Vertical alignment override (alignSelf).
   * Overrides parent alignItems.
   */
  alignSelf?: CSSProperties["alignSelf"]

  /** Item container class name. */
  className?: string

  /** Item inline styles. */
  style?: CSSProperties

  /** Item content. */
  children?: ReactNode
}
