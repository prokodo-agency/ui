import { ChipView } from "./Chip.view"

import type { ChipProps } from "./Chip.model"
import type { JSX } from "react"

export default function ChipServer(props: ChipProps): JSX.Element {
  return <ChipView {...props} />
}
