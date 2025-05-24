import type { Ref, HTMLAttributes } from "react"

export type StepperRef = {
  jumpToStep: (index: number) => void
}

export type StepperTranslations = {
  stepper: string
  step: string
  status: {
    open: string
    completed: string
  },
}

export type Step = HTMLAttributes<HTMLLIElement> & {
  key?: string
  label?: string
  labelProps?: HTMLAttributes<HTMLDivElement>
}

export type StepperProps = HTMLAttributes<HTMLOListElement> & {
  ref?: Ref<StepperRef>
  steps: Step[]
  onChangeStep?: (index: number) => void
  initialStep?: number
  translations?: StepperTranslations
}
