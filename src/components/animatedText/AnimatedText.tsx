import { createIsland } from "@/helpers/createIsland"

import AnimatedTextServer from "./AnimatedText.server"

import type { AnimatedTextProps } from "./AnimatedText.model"

export const AnimatedText = createIsland<AnimatedTextProps>({
  name: "AnimatedText",
  Server: AnimatedTextServer,
  loadLazy: /* istanbul ignore next */ () => import("./AnimatedText.lazy"),
  isInteractive: /* istanbul ignore next */ p => !Boolean(p.disabled),
})
