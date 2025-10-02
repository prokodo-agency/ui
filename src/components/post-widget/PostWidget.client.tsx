"use client"
import { memo, type FC } from "react"

import { PostWidgetView } from "./PostWidget.view"

import type { PostWidgetProps } from "./PostWidget.model"

const PostWidgetClient: FC<PostWidgetProps> = memo(props => (
  <PostWidgetView {...props} />
))

PostWidgetClient.displayName = "PostWidgetClient"
export default PostWidgetClient
