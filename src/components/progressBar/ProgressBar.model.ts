import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

export type ProgressBarVariant = Omit<Variants, "white">

export type ProgressBarProps = {
  /** Unique id, used to generate related DOM ids */
  id: string
  /** Current value from 0‑100. If omitted, bar renders in indeterminate mode. */
  value?: number
  /** Optional label shown below the bar (e.g. “Uploading… 60%”). */
  label?: string
  /** Hide the label even when provided. */
  hideLabel?: boolean
  /** Visual style variant (maps to CSS vars). Default: "primary". */
  variant?: ProgressBarVariant
  /** Loads the animation infinity in a loop. */
  infinity?: boolean
  /** Adds a pulsing animation on value change. */
  animated?: boolean
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, "children">

export type ProgressBarViewProps = ProgressBarProps
