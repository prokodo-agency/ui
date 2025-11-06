import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import ImageClient from "./Image.client"
import ImageServer from "./Image.server"

import type { ImageProps } from "./Image.model"

export default createLazyWrapper<ImageProps>({
  name: "Image",
  Client: ImageClient,
  Server: ImageServer,
  // treat as interactive if a custom image component is a function (e.g. NextImage)
  isInteractive: p => typeof p.imageComponent === "function",
})
