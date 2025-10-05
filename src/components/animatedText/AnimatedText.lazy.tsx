import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import AnimatedTextClient from "./AnimatedText.client"
import AnimatedTextServer from "./AnimatedText.server"

import type { AnimatedTextProps } from "./AnimatedText.model"

export default createLazyWrapper<AnimatedTextProps>({
  name: "AnimatedText",
  Client: AnimatedTextClient,
  Server: AnimatedTextServer,
  hydrateOnVisible: true, // wait until it scrolls into view
  isInteractive: p => !Boolean(p.disabled),
})
