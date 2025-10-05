import { createIsland } from "@/helpers/createIsland"

import PostWidgetServer from "./PostWidget.server"

import type { PostWidgetProps } from "./PostWidget.model"

export const PostWidget = createIsland<PostWidgetProps>({
  name: "PostWidget",
  Server: PostWidgetServer,
  loadLazy: () => import("./PostWidget.lazy"),
  // Only hydrate if the top-level Card gets interactive handlers
  isInteractive: p => typeof (p as PostWidgetProps).onClick === "function",
})
