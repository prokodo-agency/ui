import { calculateWordCount, calculateReadingTime } from "./calculation"

describe("calculation helpers", () => {
  describe("calculateWordCount", () => {
    it("returns 0 for undefined", () => {
      expect(calculateWordCount(undefined)).toBe(0)
    })

    it("returns the number of words in the string", () => {
      expect(calculateWordCount("hello world")).toBe(2)
      expect(calculateWordCount("one two three four five")).toBe(5)
    })

    it("handles single word", () => {
      expect(calculateWordCount("hello")).toBe(1)
    })

    it("handles extra whitespace", () => {
      expect(calculateWordCount("hello   world")).toBe(2)
    })
  })

  describe("calculateReadingTime", () => {
    it("returns 1 for short text at 200 wpm", () => {
      const text = "word ".repeat(10).trim()
      expect(calculateReadingTime(200, text)).toBe(1)
    })

    it("returns correct reading time for longer text", () => {
      const text = "word ".repeat(200).trim()
      expect(calculateReadingTime(200, text)).toBe(1)
    })

    it("rounds up correctly", () => {
      const text = "word ".repeat(201).trim()
      expect(calculateReadingTime(200, text)).toBe(2)
    })

    it("handles undefined text", () => {
      expect(calculateReadingTime(200, undefined)).toBe(0)
    })
  })
})
