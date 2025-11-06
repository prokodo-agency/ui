import { createIsland } from "@/helpers/createIsland"

import ImageServer from "./Image.server"

import type { ImageProps } from "./Image.model"

export const Image = createIsland<ImageProps>({
  name: "Image",
  Server: ImageServer,
  loadLazy: () => import("./Image.lazy"),
  isInteractive: p => typeof p.imageComponent === "function",
})
