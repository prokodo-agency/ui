import { PostWidgetView } from "./PostWidget.view"

import type { PostWidgetProps } from "./PostWidget.model"
import type { JSX } from "react"

export default function PostWidgetServer(p: PostWidgetProps): JSX.Element {
  return <PostWidgetView {...p} />
}
