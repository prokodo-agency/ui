import { createIsland } from "@/helpers/createIsland"

import ButtonServer from "./Button.server"

import type { ButtonProps } from "./Button.model"

export const Button = createIsland<ButtonProps>({
  name: "Button",
  Server: ButtonServer,
  loadLazy: () => import("./Button.lazy"),
})
