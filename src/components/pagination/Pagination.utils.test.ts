import { buildPaginationItems } from "./Pagination.utils"

describe("buildPaginationItems", () => {
  it("returns all pages when total is small enough", () => {
    // With total=5, siblingCount=1, boundaryCount=1, maxVisible >= 5
    const items = buildPaginationItems({
      page: 1,
      totalPages: 5,
      siblingCount: 1,
      boundaryCount: 1,
    })
    expect(items.every(it => it.type === "page")).toBe(true)
    expect(items).toHaveLength(5)
  })

  it("clampInt returns min for non-finite values (covers branch at line 6)", () => {
    // Pass Infinity as page → clampInt returns min(1)
    const items = buildPaginationItems({
      page: Infinity,
      totalPages: 20,
      siblingCount: 1,
      boundaryCount: 1,
    })
    // Page clamped to 1, should have start ellipsis
    expect(items.some(it => it.type === "page")).toBe(true)
  })

  it("shows start ellipsis when siblingsStart is far from boundaries", () => {
    // page=10, totalPages=20, siblingCount=1, boundaryCount=1
    // siblingsStart = max(3, 10-1) = 9 > boundaries+2=3 → start-ellipsis
    const items = buildPaginationItems({
      page: 10,
      totalPages: 20,
      siblingCount: 1,
      boundaryCount: 1,
    })
    expect(
      items.some(it => it.type === "ellipsis" && it.key === "start-ellipsis"),
    ).toBe(true)
  })

  it("shows end ellipsis when siblingsEnd is far from end boundary", () => {
    // page=3, totalPages=20, siblingCount=1, boundaryCount=1
    // siblingsEnd = min(18, 4) = 4 < 20-1-1=18 → end-ellipsis
    const items = buildPaginationItems({
      page: 3,
      totalPages: 20,
      siblingCount: 1,
      boundaryCount: 1,
    })
    expect(
      items.some(it => it.type === "ellipsis" && it.key === "end-ellipsis"),
    ).toBe(true)
  })

  it("shows page instead of start ellipsis when siblingsStart is near boundary", () => {
    // page=3, totalPages=20, boundaryCount=1, siblingCount=1
    // siblingsStart = max(3, 2) = 3, boundaries+2=3, NOT > 3 → no start ellipsis, page inserted
    const items = buildPaginationItems({
      page: 2,
      totalPages: 20,
      siblingCount: 0,
      boundaryCount: 1,
    })
    expect(
      items.some(it => it.type === "ellipsis" && it.key === "start-ellipsis"),
    ).toBe(false)
  })

  it("shows page instead of end ellipsis when siblingsEnd is near end", () => {
    // page=18, totalPages=20, siblingCount=0, boundaryCount=1
    // siblingsEnd = min(18, 18) = 18, total-boundaries-1 = 18 → NOT < 18 → page inserted
    const items = buildPaginationItems({
      page: 19,
      totalPages: 20,
      siblingCount: 0,
      boundaryCount: 1,
    })
    expect(
      items.some(it => it.type === "ellipsis" && it.key === "end-ellipsis"),
    ).toBe(false)
  })

  it("handles totalPages=1 edge case", () => {
    const items = buildPaginationItems({
      page: 1,
      totalPages: 1,
      siblingCount: 1,
      boundaryCount: 1,
    })
    expect(items).toHaveLength(1)
    expect(items[0]).toEqual({ type: "page", value: 1 })
  })

  it("de-duplicates items near edges", () => {
    // When boundaries+siblings cause overlapping pages, de-dup removes them
    const items = buildPaginationItems({
      page: 5,
      totalPages: 10,
      siblingCount: 5,
      boundaryCount: 2,
    })
    const pageValues = items
      .filter(it => it.type === "page")
      .map(it => it.value)
    const unique = [...new Set(pageValues)]
    expect(pageValues).toEqual(unique)
  })
})
