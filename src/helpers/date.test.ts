import { localizeDate } from "./date"

describe("localizeDate", () => {
  it("returns undefined when date is undefined", () => {
    expect(localizeDate("en-US", undefined)).toBeUndefined()
  })

  it("returns undefined when date is empty string", () => {
    expect(localizeDate("en-US", "")).toBeUndefined()
  })

  it("returns localized date object for a valid date string", () => {
    const result = localizeDate("en-US", "2024-03-15")
    expect(result).toBeDefined()
    expect(result?.meta).toBe("2024-03-15")
    expect(typeof result?.locale).toBe("string")
    expect(result?.locale.length).toBeGreaterThan(0)
  })

  it("pads month and day with leading zeros in meta", () => {
    const result = localizeDate("en-US", "2024-01-05")
    expect(result?.meta).toBe("2024-01-05")
  })

  it("produces a locale string using the given locale", () => {
    const result = localizeDate("de-DE", "2024-06-20")
    expect(result).toBeDefined()
    // German locale should contain the year
    expect(result?.locale).toContain("2024")
  })
})
