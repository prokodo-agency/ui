import { create } from "./bem"

describe("The bem helper", () => {
  const styles = {
    block: "block__123",
    "block--modifier": "block--modifier__789",
    "block--is-enabled": "block--is-enabled__789",
    block__element: "block__element__456",
    "block__element--modifier": "block__element--modifier__789",
    "block__element--is-enabled": "block__element--is-enabled__789",
    "block__element--is-visible": "block__element--is-visible__789",
  }

  describe("create", () => {
    it("should create bem helper by string", async () => {
      const bem = create(styles, "block")
      expect(bem()).toBe("block__123")
    })

    it("should return classname for elements", async () => {
      const bem = create(styles, "block")
      expect(bem("element")).toBe("block__element__456")
      expect(bem("element", "modifier")).toBe(
        "block__element__456 block__element--modifier__789",
      )
      expect(bem("element", { "is-enabled": true, "is-visible": false })).toBe(
        "block__element__456 block__element--is-enabled__789",
      )
    })

    it("should return classname with modifieres", async () => {
      const bem = create(styles, "block")
      expect(bem(undefined, "modifier")).toBe("block__123 block--modifier__789")
      expect(bem(undefined, { "is-enabled": true, "is-visible": false })).toBe(
        "block__123 block--is-enabled__789",
      )
    })

    it("should use unknown key when not defined in styles", async () => {
      const bem = create(styles, "block")

      expect(bem("unknown")).toBe("block__unknown")
      expect(bem(undefined, "unknown")).toBe("block__123 block--unknown")
    })
  })
})
