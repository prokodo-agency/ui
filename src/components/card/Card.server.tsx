import { CardView } from "./Card.view"
import type { CardProps } from "./Card.model"

export default function CardServer(props: CardProps) {
  return <CardView {...props} />
}
