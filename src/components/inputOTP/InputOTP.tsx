import { createIsland } from "@/helpers/createIsland"

import InputOTPServer from "./InputOTP.server"

import type { InputOTPProps } from "./InputOTP.model"

export const InputOTP = createIsland<InputOTPProps>({
  name: "InputOTP",
  Server: InputOTPServer,
  loadLazy: /* istanbul ignore next */ () => import("./InputOTP.lazy"),
})
