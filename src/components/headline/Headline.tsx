import { createIsland } from "@/helpers/createIsland"
import HeadlineServer from "./Headline.server"
import type { HeadlineProps } from "./Headline.model"

export const Headline = createIsland<HeadlineProps>({
  name: "Headline",
  Server: HeadlineServer,
  loadLazy: () => import("./Headline.lazy"),
  isInteractive: (p) => Boolean(p.animated) === true || typeof p.renderText === "function",
})
