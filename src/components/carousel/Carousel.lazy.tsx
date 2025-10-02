import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import CarouselClient from "./Carousel.client"
import CarouselServer from "./Carousel.server"

import type { CarouselProps } from "./Carousel.model"

export default createLazyWrapper<CarouselProps>({
  name: "Carousel",
  Client: CarouselClient,
  Server: CarouselServer,
  hydrateOnVisible: false,
  isInteractive: () => true,
})
