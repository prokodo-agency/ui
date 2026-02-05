import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import PaginationClient from "./Pagination.client"
import PaginationServer from "./Pagination.server"

import type { PaginationProps } from "./Pagination.model"

export default createLazyWrapper<PaginationProps>({
  name: "Pagination",
  Client: PaginationClient,
  Server: PaginationServer,
})
