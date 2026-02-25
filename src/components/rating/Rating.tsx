import { createIsland } from "@/helpers/createIsland"

import RatingServer from "./Rating.server"

import type { RatingProps } from "./Rating.model"

export const Rating = createIsland<RatingProps>({
  name: "Rating",
  Server: RatingServer,
  loadLazy: /* istanbul ignore next */ () => import("./Rating.lazy"),
})
