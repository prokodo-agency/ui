import { createIsland } from "@/helpers/createIsland"

import ImageServer from "./Image.server"

import type { ImageProps } from "./Image.model"

export const Image = createIsland<ImageProps>({
  name: "Image",
  Server: ImageServer,
  loadLazy: /* istanbul ignore next */ () => import("./Image.lazy"),
  // Treat Image as interactive so it always gets the client path
  // when needed, but markup is still valid for server-only fallback.
  isInteractive: /* istanbul ignore next */ () => true,
})
