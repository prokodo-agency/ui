export type PaginationItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; key: string }

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min
  const x = Math.trunc(v)
  return Math.min(max, Math.max(min, x))
}

export function buildPaginationItems(args: {
  page: number
  totalPages: number
  siblingCount: number
  boundaryCount: number
}): PaginationItem[] {
  const total = Math.max(1, Math.trunc(args.totalPages))
  const page = clampInt(args.page, 1, total)
  const siblings = Math.max(0, Math.trunc(args.siblingCount))
  const boundaries = Math.max(0, Math.trunc(args.boundaryCount))

  // If small enough → show all pages
  const maxVisible =
    boundaries * 2 +
    siblings * 2 +
    3 /* current block */ +
    2 /* ellipsis slots */
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => ({
      type: "page",
      value: i + 1,
    }))
  }

  const items: PaginationItem[] = []

  const startPages = Array.from({ length: boundaries }, (_, i) => i + 1)
  const endPages = Array.from(
    { length: boundaries },
    (_, i) => total - boundaries + 1 + i,
  )

  const siblingsStart = Math.max(boundaries + 2, page - siblings)
  const siblingsEnd = Math.min(total - boundaries - 1, page + siblings)

  // Start pages
  for (const p of startPages) items.push({ type: "page", value: p })

  // Gap / start ellipsis
  if (siblingsStart > boundaries + 2) {
    items.push({ type: "ellipsis", key: "start-ellipsis" })
  } else {
    items.push({ type: "page", value: boundaries + 1 })
  }

  // Siblings
  for (let p = siblingsStart; p <= siblingsEnd; p++) {
    items.push({ type: "page", value: p })
  }

  // Gap / end ellipsis
  if (siblingsEnd < total - boundaries - 1) {
    items.push({ type: "ellipsis", key: "end-ellipsis" })
  } else {
    items.push({ type: "page", value: total - boundaries })
  }

  // End pages
  for (const p of endPages) items.push({ type: "page", value: p })

  // De-dupe (can happen near edges)
  const seen = new Set<string>()
  return items.filter(it => {
    const key = it.type === "page" ? `p-${it.value}` : `e-${it.key}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
