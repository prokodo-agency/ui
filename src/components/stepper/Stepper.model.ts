// Stepper.model.ts
import type {
  Ref,
  RefObject,
  HTMLAttributes,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
} from "react"

export type StepperChangeEvent =
  | MouseEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>

export type StepperRef = {
  /** Jump directly to a given step index (0‐based). */
  jumpToStep: (index: number) => void
}

export type StepperTranslations = {
  /** ARIA label for the entire stepper nav. */
  stepper: string
  /** Used in aria‐label for each step button. */
  step: string
  /** Status messages for screen reader (completed vs. open). */
  status: {
    open: string // e.g. “Open. Future step, disabled.”
    completed: string // e.g. “Completed. Press Enter to return.”
  }
}

export type Step = HTMLAttributes<HTMLLIElement> & {
  /** Unique key for this step (falls back to index if not provided). */
  key?: string
  /** Visible text label for the step. */
  label?: string
  /** Props forwarded to the inner label wrapper. */
  labelProps?: HTMLAttributes<HTMLDivElement>

  innerContainerProps?: HTMLAttributes<HTMLDivElement>
}

export type StepperProps = Omit<
  HTMLAttributes<HTMLOListElement>,
  "children" | "onChange" | "onFocus" | "onBlur"
> & {
  /** Optional ref to call `jumpToStep(index)`. */
  ref?: Ref<StepperRef>

  /** Array of steps (must include `label`). */
  steps: Step[]

  /** Callback when the active step changes. */
  onChange?: (e: StepperChangeEvent, index: number) => void
  onFocus?: (e: FocusEvent<HTMLDivElement>, index: number) => void
  onBlur?: (e: FocusEvent<HTMLDivElement>, index: number) => void

  /** Initial active step index (0‐based, defaults to 0). */
  initialStep?: number

  /** Custom translations (for aria labels, statuses). */
  translations?: StepperTranslations
}

/**
 * View‐only props: no internal hooks, purely renders based on props.
 */
export interface StepperViewProps extends Omit<StepperViewPropsCommon, "ref"> {
  /** Current active step index (0‐based). */
  activeStep: number
}

export interface StepperViewPropsCommon extends StepperPropsCommon {}
export interface StepperPropsCommon {
  stepRefs?: RefObject<Array<HTMLDivElement | null>>
  steps: Step[]
  translations?: StepperTranslations
  className?: string
}
