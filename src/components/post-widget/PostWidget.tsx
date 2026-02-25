import { createIsland } from "@/helpers/createIsland"

import PostWidgetServer from "./PostWidget.server"

import type { PostWidgetProps } from "./PostWidget.model"

export const PostWidget = createIsland<PostWidgetProps>({
  name: "PostWidget",
  Server: PostWidgetServer,
  loadLazy: /* istanbul ignore next */ () => import("./PostWidget.lazy"),
  // Only hydrate if the top-level Card gets interactive handlers  isInteractive: /* istanbul ignore next */ p => typeof (p as PostWidgetProps).onClick === "function",
})
