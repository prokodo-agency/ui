import { ProgressBarView } from "./ProgressBar.view"

import type { ProgressBarProps } from "./ProgressBar.model"
import type { JSX } from "react"

export default function ProgressBarServer(props: ProgressBarProps): JSX.Element {
  return <ProgressBarView {...props} />
}