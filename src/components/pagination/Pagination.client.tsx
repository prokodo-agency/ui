"use client"

import { memo, type JSX } from "react"

import { PaginationView } from "./Pagination.view"

import type { PaginationProps } from "./Pagination.model"

function PaginationClient(p: PaginationProps): JSX.Element | null {
  return <PaginationView {...p} />
}

export default memo(PaginationClient)
