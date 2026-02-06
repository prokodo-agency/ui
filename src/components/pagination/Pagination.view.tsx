import { Button } from "@/components/button"
import { create } from "@/helpers/bem"

import styles from "./Pagination.module.scss"
import { buildPaginationItems } from "./Pagination.utils"

import type { PaginationProps } from "./Pagination.model"
import type { JSX } from "react"

const bem = create(styles, "Pagination")

export function PaginationView({
  className,
  page,
  totalPages,
  disabled,
  isPending,
  siblingCount = 1,
  boundaryCount = 1,
  onPrev,
  onNext,
  onPageChange,
  readOnly,
  translations: t,
}: PaginationProps): JSX.Element | null {
  const safeTotal = Math.max(1, Math.trunc(totalPages))
  const safePage = Math.min(safeTotal, Math.max(1, Math.trunc(page)))

  if (safeTotal <= 1) return null

  const isDisabled =
    Boolean(disabled) || Boolean(isPending) || Boolean(readOnly)

  const items = buildPaginationItems({
    page: safePage,
    totalPages: safeTotal,
    siblingCount,
    boundaryCount,
  })

  return (
    <nav
      aria-label={t?.pagination ?? "Pagination"}
      className={bem(undefined, undefined, className)}
    >
      <Button
        aria-label={t?.prev ?? "Previous page"}
        className={bem("btn")}
        disabled={isDisabled || safePage <= 1}
        iconProps={{ name: "ArrowLeft01Icon" }}
        variant="outlined"
        onClick={
          isDisabled
            ? undefined
            : (onPrev ??
              (() => {
                onPageChange?.(safePage - 1)
              }))
        }
      />

      <ul className={bem("list")}>
        {items.map(it => {
          if (it.type === "ellipsis") {
            return (
              <li
                key={`${safePage}-${safeTotal}-${it.key}`}
                className={bem("item")}
              >
                <span aria-hidden="true" className={bem("ellipsis")}>
                  …
                </span>
              </li>
            )
          }

          const isActive = it.value === safePage

          return (
            <li key={it.value} className={bem("item")}>
              <Button
                aria-current={isActive ? "page" : undefined}
                className={bem("page", { active: isActive })}
                disabled={isDisabled || isActive}
                title={it.value?.toString()}
                variant={isActive ? "outlined" : "text"}
                aria-label={
                  isActive
                    ? (t?.pageCurrent?.replace("{page}", String(it.value)) ??
                      `Current page ${it.value}`)
                    : (t?.pageGoTo?.replace("{page}", String(it.value)) ??
                      `Go to page ${it.value}`)
                }
                onClick={
                  isDisabled ? undefined : () => onPageChange?.(it.value)
                }
              />
            </li>
          )
        })}
      </ul>

      <Button
        aria-label={t?.next ?? "Next page"}
        className={bem("btn")}
        disabled={isDisabled || safePage >= safeTotal}
        iconProps={{ name: "ArrowRight01Icon" }}
        variant="outlined"
        onClick={
          isDisabled
            ? undefined
            : (onNext ??
              (() => {
                onPageChange?.(safePage + 1)
              }))
        }
      />
    </nav>
  )
}
