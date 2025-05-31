import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import CardClient from "./Card.client"
import CardServer from "./Card.server"
import type { CardProps } from "./Card.model"

export default createLazyWrapper<CardProps>({
  name: "Card",
  Client: CardClient,
  Server: CardServer,
  hydrateOnVisible: true,
  isInteractive: (p: CardProps) => (!Boolean(p.disabled) && typeof p.onClick === "function") || (Boolean(p.disabled) && typeof p.redirect?.href === "string"),
})
