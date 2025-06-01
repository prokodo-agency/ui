import { StepperView } from "./Stepper.view"

import type { StepperProps, Step } from "./Stepper.model"
import type { JSX } from "react"

export default function StepperServer({
  steps,
  initialStep = 0,
  translations,
  className,
  ...rootProps
}: StepperProps): JSX.Element {
  // 1) Create a shallow copy of steps that strips out any innerContainerProps.
  const serverSteps: Step[] = steps.map((step) => ({
      ...step,
      // no innerContainerProps at all on the server
      innerContainerProps: {},
    }))

  // 2) Dummy ref object so the view always sees a stepRefs prop.
  const emptyStepRefs = { current: [] as Array<HTMLDivElement | null> }

  return (
    <StepperView
      {...rootProps}
      activeStep={initialStep}
      className={className}
      stepRefs={emptyStepRefs}
      steps={serverSteps}
      translations={translations}
    />
  )
}
