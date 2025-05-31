import { CarouselView } from "./Carousel.view"
import type { CarouselProps } from "./Carousel.model"

export default function CarouselServer(props: CarouselProps) {
  return <CarouselView {...props} />
}
