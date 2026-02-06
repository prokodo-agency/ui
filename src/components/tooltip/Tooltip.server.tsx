import { TooltipView } from "./Tooltip.view"

import type { TooltipProps } from "./Tooltip.model"
import type { JSX } from "react"

export default function TooltipServer(props: TooltipProps): JSX.Element {
  const portal = props.portal ?? true // keep your default
  return <TooltipView {...props} __renderVisualBubble={!portal} />
}
