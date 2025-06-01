import { CardView } from "./Card.view"

import type { CardProps } from "./Card.model"
import type { JSX } from "react"

export default function CardServer(props: CardProps): JSX.Element {
  return <CardView {...props} />
}
