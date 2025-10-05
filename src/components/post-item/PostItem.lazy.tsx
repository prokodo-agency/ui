import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import PostItemClient from "./PostItem.client"
import PostItemServer from "./PostItem.server"

import type { PostItemProps } from "./PostItem.model"

export default createLazyWrapper<PostItemProps>({
  name: "PostItem",
  Client: PostItemClient,
  Server: PostItemServer,
  // Hydrate when visible if interactive (e.g., button.onClick, redirect, etc.)
  hydrateOnVisible: true,
})
