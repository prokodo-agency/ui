import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import AnimatedClient from "./Animated.client"
import AnimatedServer from "./Temp.server"


import type { AnimatedProps } from "./Animated.model"

export default createLazyWrapper<AnimatedProps>({
  name: "Animated",
  Client: AnimatedClient,
  Server: AnimatedServer,
  // defer hydration until it scrolls into view:
  hydrateOnVisible: true,
  isInteractive: () => true,
})
