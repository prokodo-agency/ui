import { createIsland } from "@/helpers/createIsland"

import StepperServer from "./Stepper.server"

import type { StepperProps } from "./Stepper.model"

export const Stepper = createIsland<StepperProps>({
  name: "Stepper",
  Server: StepperServer,
  loadLazy: /* istanbul ignore next */ () => import("./Stepper.lazy"),
})
