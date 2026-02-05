/**
 * i18n translation strings for Pagination component.
 */
export type PaginationTranslations = {
  /** Aria-label for the pagination nav element. */
  pagination?: string
  /** Label for previous page button. */
  prev?: string
  /** Label for next page button. */
  next?: string
  /** Template for "go to page" input (e.g., "Go to page {page}"). */
  pageGoTo?: string
  /** Template for current page announcement (e.g., "Current page {page}"). */
  pageCurrent?: string
}

/**
 * Callback fired when user navigates to a different page.
 * @param page - The target page number (1-indexed).
 */
export type PaginationPageChangeHandler = (page: number) => void

/**
 * Pagination component props for controlling multi-page navigation.
 * Supports both controlled and uncontrolled patterns with optional prev/next handlers.
 *
 * @example
 * ```tsx
 * // Basic controlled pagination
 * <Pagination
 *   page={currentPage}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom prev/next handlers
 * <Pagination
 *   page={page}
 *   totalPages={pages}
 *   onPrev={handlePrev}
 *   onNext={handleNext}
 *   siblingCount={2}
 * />
 * ```
 *
 * @a11y Fully keyboard accessible with ARIA labels. Screen readers announce current page and status.
 * @ssr readOnly prop disables interactive features for server rendering.
 */
export type PaginationProps = {
  /** Translation strings for labels and ARIA text. */
  translations?: PaginationTranslations

  /** Current active page (1-indexed, controlled). */
  page: number
  /** Total number of pages. */
  totalPages: number

  /** Disable all interaction. */
  disabled?: boolean
  /** Show loading state during navigation. */
  isPending?: boolean

  /**
   * Custom handler for previous page button.
   * If not provided, prev/next buttons use onPageChange(page-1/+1).
   */
  onPrev?: () => void
  /**
   * Custom handler for next page button.
   * If not provided, uses onPageChange(page+1).
   */
  onNext?: () => void
  /** Called when page changes (main handler). */
  onPageChange?: PaginationPageChangeHandler

  /**
   * Number of page buttons to show on each side of current (e.g., 1 … 4 5 [6] 7 8 … 20).
   * Default: 1
   */
  siblingCount?: number
  /**
   * Number of page buttons always visible at start/end (e.g., [1] 2 … 18 [19] [20]).
   * Default: 1
   */
  boundaryCount?: number

  /**
   * Server-render mode: disables interaction (no click handlers, no state).
   * Used for SSR to prevent hydration mismatches.
   */
  readOnly?: boolean

  /** CSS class applied to root element. */
  className?: string
}
