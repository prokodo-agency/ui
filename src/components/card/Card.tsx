import { createIsland } from "@/helpers/createIsland"
import CardServer from "./Card.server"
import type { CardProps } from "./Card.model"

export const Card = createIsland<CardProps>({
  name: "Card",
  Server: CardServer,
  loadLazy: () => import("./Card.lazy"),
  isInteractive: (p: CardProps) => (!Boolean(p.disabled) && typeof p.onClick === "function") || (Boolean(p.disabled) && typeof p.redirect?.href === "string"),
})
