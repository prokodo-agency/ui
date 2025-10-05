import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import InputClient from "./Input.client"
import InputServer from "./Input.server"

import type { InputProps } from "./Input.model"

export default createLazyWrapper<InputProps>({
  name: "Input",
  Client: InputClient,
  Server: InputServer,
})
