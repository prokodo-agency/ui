// Stepper.model.ts
import type {
  Ref,
  RefObject,
  HTMLAttributes,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
} from "react"

/**
 * Change event union for stepper interactions.
 */
export type StepperChangeEvent =
  | MouseEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>

/**
 * Imperative ref handle for Stepper.
 */
export type StepperRef = {
  /** Jump directly to a given step index (0‐based). */
  jumpToStep: (index: number) => void
}

/**
 * i18n strings for Stepper ARIA labels and status messages.
 */
export type StepperTranslations = {
  /** ARIA label for the entire stepper nav. */
  stepper: string
  /** Used in aria‐label for each step button. */
  step: string
  /** Status messages for screen reader (completed vs. open). */
  status: {
    /** Open status message. */
    open: string
    /** Completed status message. */
    completed: string
  }
}

/**
 * Single step configuration.
 */
export type Step = HTMLAttributes<HTMLLIElement> & {
  /** Unique key for this step (falls back to index if not provided). */
  key?: string
  /** Visible text label for the step. */
  label?: string
  /** Props forwarded to the inner label wrapper. */
  labelProps?: HTMLAttributes<HTMLDivElement>
  /** Props forwarded to inner container. */
  innerContainerProps?: HTMLAttributes<HTMLDivElement>
}

/**
 * Stepper component props.
 * Renders a list of steps with keyboard navigation support.
 *
 * @example
 * <Stepper steps={[{ label: "One" }, { label: "Two" }]} />
 */
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
  /** Focus handler for step buttons. */
  onFocus?: (e: FocusEvent<HTMLDivElement>, index: number) => void
  /** Blur handler for step buttons. */
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
  /** Refs for step elements. */
  stepRefs?: RefObject<Array<HTMLDivElement | null>>
  /** Step definitions. */
  steps: Step[]
  /** Optional translations. */
  translations?: StepperTranslations
  /** Root class name. */
  className?: string
}
