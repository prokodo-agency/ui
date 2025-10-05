import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import PostTeaserClient from "./PostTeaser.client"
import PostTeaserServer from "./PostTeaser.server"

import type { PostTeaserProps } from "./PostTeaser.model"

export default createLazyWrapper<PostTeaserProps>({
  name: "PostTeaser",
  Client: PostTeaserClient,
  Server: PostTeaserServer,
  hydrateOnVisible: true,
})
