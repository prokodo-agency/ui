import { createIsland } from "@/helpers/createIsland"

import PostItemServer from "./PostItem.server"

import type { PostItemProps } from "./PostItem.model"

export const PostItem = createIsland<PostItemProps>({
  name: "PostItem",
  Server: PostItemServer,
  loadLazy: () => import("./PostItem.lazy"),
})
