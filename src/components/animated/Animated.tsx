import { createIsland } from "@/helpers/createIsland"

import AnimatedServer from "./Animated.server"

import type { AnimatedProps } from "./Animated.model"

export const Animated = createIsland<AnimatedProps>({
  name: "Animated",
  Server: AnimatedServer,
  loadLazy: () => import("./Animated.lazy"),
  isInteractive: () => true,
})
