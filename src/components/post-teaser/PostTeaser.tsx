import { createIsland } from "@/helpers/createIsland"

import PostTeaserServer from "./PostTeaser.server"

import type { PostTeaserProps } from "./PostTeaser.model"

export const PostTeaser = createIsland<PostTeaserProps>({
  name: "PostTeaser",
  Server: PostTeaserServer,
  loadLazy: /* istanbul ignore next */ () => import("./PostTeaser.lazy"),
})
