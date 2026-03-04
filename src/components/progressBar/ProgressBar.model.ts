import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

/**
 * Color tokens for the progress bar (excluding white).
 */
export type ProgressBarColor = Omit<Variants, "white">

/** @deprecated Use {@link ProgressBarColor} instead. */
export type ProgressBarVariant = ProgressBarColor

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
  /** Visual color token. Default: "primary". */
  color?: ProgressBarColor
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
