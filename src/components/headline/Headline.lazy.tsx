import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import HeadlineClient from "./Headline.client"
import HeadlineServer from "./Headline.server"
import type { HeadlineProps } from "./Headline.model"

export default createLazyWrapper<HeadlineProps>({
  name: "Headline",
  Client: HeadlineClient,
  Server: HeadlineServer,
  hydrateOnVisible: true,          // erst sichtbar → dann JS
  isInteractive: (p) => Boolean(p.animated) === true || typeof p.renderText === "function",
})
