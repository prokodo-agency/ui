import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import RatingClient from "./Rating.client"
import RatingServer from "./Rating.server"

import type { RatingProps } from "./Rating.model"

export default createLazyWrapper<RatingProps>({
  name: "Rating",
  Client: RatingClient,
  Server: RatingServer,
})
