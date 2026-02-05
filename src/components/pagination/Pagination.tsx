import { createIsland } from "@/helpers/createIsland"

import PaginationServer from "./Pagination.server"

import type { PaginationProps } from "./Pagination.model"

export const Pagination = createIsland<PaginationProps>({
  name: "Pagination",
  Server: PaginationServer,
  loadLazy: () => import("./Pagination.lazy"),
})
