import { TooltipView } from "./Tooltip.view"

import type { TooltipProps } from "./Tooltip.model"

export default function TooltipServer(props: TooltipProps) {
  const portal = props.portal ?? true // keep your default
  return <TooltipView {...props} __renderVisualBubble={!portal} />
}
