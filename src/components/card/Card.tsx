import { createIsland } from "@/helpers/createIsland"

import CardServer from "./Card.server"

import type { CardProps } from "./Card.model"

export const Card = createIsland<CardProps>({
  name: "Card",
  Server: CardServer,
  loadLazy: /* istanbul ignore next */ () => import("./Card.lazy"),
  isInteractive: /* istanbul ignore next */ (p: CardProps) =>
    (!Boolean(p.disabled) && typeof p.onClick === "function") ||
    typeof p.redirect?.href === "string",
})
