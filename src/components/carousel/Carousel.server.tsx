import { CarouselView } from "./Carousel.view"

import type { CarouselProps } from "./Carousel.model"
import type { JSX } from "react"

export default function CarouselServer(props: CarouselProps): JSX.Element {
  return <CarouselView {...props} />
}
