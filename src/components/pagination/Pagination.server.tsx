import { PaginationView } from "./Pagination.view"

import type { PaginationProps } from "./Pagination.model"
import type { JSX } from "react"

export default function PaginationServer(
  p: PaginationProps,
): JSX.Element | null {
  return <PaginationView {...p} readOnly />
}
