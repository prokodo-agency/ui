import { createIsland } from "@/helpers/createIsland"

import PostWidgetCarouselServer from "./PostWidgetCarousel.server"

import type { PostWidgetCarouselProps } from "./PostWidgetCarousel.model"

export const PostWidgetCarousel = createIsland<PostWidgetCarouselProps>({
  name: "PostWidgetCarousel",
  Server: PostWidgetCarouselServer,
  loadLazy: () => import("./PostWidgetCarousel.lazy"),
  // Carousel is interactive; render server first then hydrate when visible
  isInteractive: () => true,
})
