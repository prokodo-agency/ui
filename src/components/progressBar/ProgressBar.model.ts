import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

/**
 * Visual variants for the progress bar (excluding white).
 */
export type ProgressBarVariant = Omit<Variants, "white">

/**
 * ProgressBar props.
 * Supports determinate and indeterminate states.
 *
 * @example
 * <ProgressBar id="upload" value={60} label="Uploading… 60%" />
 *
 * @example
 * <ProgressBar id="loading" infinity animated />
 */
export type ProgressBarProps = {
  /** Unique id, used to generate related DOM ids. */
  id: string
  /** Current value from 0‑100. If omitted, renders indeterminate mode. */
  value?: number
  /** Optional label shown below the bar (e.g., "Uploading… 60%"). */
  label?: string
  /** Hide the label even when provided. */
  hideLabel?: boolean
  /** Visual style variant (maps to CSS vars). Default: "primary". */
  variant?: ProgressBarVariant
  /** Runs the animation infinitely in a loop. */
  infinity?: boolean
  /** Adds a pulsing animation on value change. */
  animated?: boolean
  /** Optional class name for the root element. */
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, "children">

/**
 * Internal view props for ProgressBar rendering.
 */
export type ProgressBarViewProps = ProgressBarProps
