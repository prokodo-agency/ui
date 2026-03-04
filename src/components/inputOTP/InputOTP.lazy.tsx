import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import InputOTPClient from "./InputOTP.client"
import InputOTPServer from "./InputOTP.server"

import type { InputOTPProps } from "./InputOTP.model"

export default createLazyWrapper<InputOTPProps>({
  name: "InputOTP",
  Client: InputOTPClient,
  Server: InputOTPServer,
})
