"use client"
import { memo } from "react"

import { PostWidgetCarouselView } from "./PostWidgetCarousel.view"

import type { PostWidgetCarouselProps } from "./PostWidgetCarousel.model"

const PostWidgetCarouselClient = memo((props: PostWidgetCarouselProps) => (
  <PostWidgetCarouselView {...props} />
))

PostWidgetCarouselClient.displayName = "PostWidgetCarouselClient"
export default PostWidgetCarouselClient
