import { createIsland } from "@/helpers/createIsland"

import AnimatedTextServer from "./AnimatedText.server"

import type { AnimatedTextProps } from "./AnimatedText.model"

export const AnimatedText = createIsland<AnimatedTextProps>({
  name: "AnimatedText",
  Server: AnimatedTextServer,
  loadLazy: () => import("./AnimatedText.lazy"),
  isInteractive: p => !Boolean(p.disabled),
})
