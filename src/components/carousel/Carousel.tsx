import { createIsland } from "@/helpers/createIsland"

import CarouselServer from "./Carousel.server"

import type { CarouselProps } from "./Carousel.model"

export const Carousel = createIsland<CarouselProps>({
  name: "Carousel",
  Server: CarouselServer,
  loadLazy: () => import("./Carousel.lazy"),
  isInteractive: () => true,
})
