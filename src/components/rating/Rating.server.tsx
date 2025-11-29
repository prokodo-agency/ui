import { RatingView } from "./Rating.view"

import type { RatingProps } from "./Rating.model"
import type { JSX } from "react"

export default function RatingServer(p: RatingProps): JSX.Element {
  return <RatingView {...p} readOnly />
}
