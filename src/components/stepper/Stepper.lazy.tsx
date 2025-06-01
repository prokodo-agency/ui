import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import StepperClient from "./Stepper.client"
import StepperServer from "./Stepper.server"

import type { StepperProps } from "./Stepper.model"

export default createLazyWrapper<StepperProps>({
  name: "Stepper",
  Client: StepperClient,
  Server: StepperServer,
})
