import { createIsland } from "@/helpers/createIsland"

import InputServer from "./Input.server"

import type { InputProps } from "./Input.model"

export const Input = createIsland<InputProps>({
  name: "Input",
  Server: InputServer,
  loadLazy: () => import("./Input.lazy"),
})
