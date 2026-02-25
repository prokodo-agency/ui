import {
  isString,
  isEqual,
  isNumber,
  isArray,
  isNull,
  isTrue,
} from "./validations"

describe("validation helpers", () => {
  describe("isString", () => {
    it("returns true for a non-empty string", () => {
      expect(isString("hello")).toBe(true)
    })

    it("returns false for empty string", () => {
      expect(isString("")).toBe(false)
    })

    it("returns false for whitespace-only string", () => {
      expect(isString("   ")).toBe(false)
    })

    it("returns false for undefined", () => {
      expect(isString(undefined)).toBe(false)
    })

    it("returns false for null", () => {
      expect(isString(null)).toBe(false)
    })
  })

  describe("isEqual", () => {
    it("returns true when both strings are equal", () => {
      expect(isEqual("hello", "hello")).toBe(true)
    })

    it("returns false when strings differ", () => {
      expect(isEqual("hello", "world")).toBe(false)
    })

    it("returns true when both are undefined", () => {
      expect(isEqual(undefined, undefined)).toBe(true)
    })

    it("returns false when one is undefined", () => {
      expect(isEqual("hello", undefined)).toBe(false)
    })
  })

  describe("isNumber", () => {
    it("returns true for a number", () => {
      expect(isNumber(42)).toBe(true)
    })

    it("returns true for 0", () => {
      expect(isNumber(0)).toBe(true)
    })

    it("returns false for undefined", () => {
      expect(isNumber(undefined)).toBe(false)
    })

    it("returns false for null", () => {
      expect(isNumber(null)).toBe(false)
    })
  })

  describe("isArray", () => {
    it("returns true for a non-empty array", () => {
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it("returns false for an empty array", () => {
      expect(isArray([])).toBe(false)
    })

    it("returns false for null", () => {
      expect(isArray(null)).toBe(false)
    })

    it("returns false for undefined", () => {
      expect(isArray(undefined)).toBe(false)
    })
  })

  describe("isNull", () => {
    it("returns true for null", () => {
      expect(isNull(null)).toBe(true)
    })

    it("returns true for undefined", () => {
      expect(isNull(undefined)).toBe(true)
    })

    it("returns false for a non-null value", () => {
      expect(isNull("hello")).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull(false)).toBe(false)
    })
  })

  describe("isTrue", () => {
    it("returns true for true", () => {
      expect(isTrue(true)).toBe(true)
    })

    it("returns false for false", () => {
      expect(isTrue(false)).toBe(false)
    })

    it("returns false for undefined", () => {
      expect(isTrue(undefined)).toBe(false)
    })
  })
})
