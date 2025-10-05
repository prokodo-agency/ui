import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import PostWidgetCarouselClient from "./PostWidgetCarousel.client"
import PostWidgetCarouselServer from "./PostWidgetCarousel.server"

import type { PostWidgetCarouselProps } from "./PostWidgetCarousel.model"

export default createLazyWrapper<PostWidgetCarouselProps>({
  name: "PostWidgetCarousel",
  Client: PostWidgetCarouselClient,
  Server: PostWidgetCarouselServer,
  hydrateOnVisible: true,
})
