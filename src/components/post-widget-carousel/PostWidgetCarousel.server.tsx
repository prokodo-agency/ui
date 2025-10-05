import { PostWidgetCarouselView } from "./PostWidgetCarousel.view"

import type { PostWidgetCarouselProps } from "./PostWidgetCarousel.model"
import type { JSX } from "react"

export default function PostWidgetCarouselServer(
  p: PostWidgetCarouselProps,
): JSX.Element {
  return <PostWidgetCarouselView {...p} />
}
