import { HeadlineView } from "./Headline.view"

import type { HeadlineProps } from "./Headline.model"
import type { JSX } from "react"

export default function HeadlineServer(props: HeadlineProps): JSX.Element {
  return <HeadlineView {...props} />
}
