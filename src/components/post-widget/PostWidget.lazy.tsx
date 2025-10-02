import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import PostWidgetClient from "./PostWidget.client"
import PostWidgetServer from "./PostWidget.server"

import type { PostWidgetProps } from "./PostWidget.model"

export default createLazyWrapper<PostWidgetProps>({
  name: "PostWidget",
  Client: PostWidgetClient,
  Server: PostWidgetServer,
  hydrateOnVisible: true,
})
