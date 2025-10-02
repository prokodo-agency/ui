import { COMPANY_PREFIX, create } from "@/helpers/bem"

describe("The bem helper", () => {
  const block = "block"
  const prefixed = `${COMPANY_PREFIX}-${block}`

  const styles = {
    [prefixed]: prefixed,
    [`${prefixed}__element`]: `${prefixed}__element`,
    [`${prefixed}--modifier`]: `${prefixed}--modifier`,
    [`${prefixed}--is-enabled`]: `${prefixed}--is-enabled`,
    [`${prefixed}__element--modifier`]: `${prefixed}__element--modifier`,
    [`${prefixed}__element--is-enabled`]: `${prefixed}__element--is-enabled`,
  }

  describe("create", () => {
    it("should create bem helper by string", () => {
      const bem = create(styles, block)
      expect(bem()).toBe(prefixed)
    })

    it("should return classname for elements", () => {
      const bem = create(styles, block)
      expect(bem("element")).toBe(`${prefixed}__element`)
      expect(bem("element", "modifier")).toBe(
        `${prefixed}__element ${prefixed}__element--modifier`,
      )
      expect(bem("element", { "is-enabled": true })).toBe(
        `${prefixed}__element ${prefixed}__element--is-enabled`,
      )
    })

    it("should return classname with modifiers", () => {
      const bem = create(styles, block)
      expect(bem(undefined, "modifier")).toBe(
        `${prefixed} ${prefixed}--modifier`,
      )
      expect(bem(undefined, { "is-enabled": true })).toBe(
        `${prefixed} ${prefixed}--is-enabled`,
      )
    })

    it("should use unknown key when not defined in styles", () => {
      const bem = create(styles, block)
      expect(bem("unknown")).toBe(`${prefixed}__unknown`)
      expect(bem(undefined, "unknown")).toBe(`${prefixed} ${prefixed}--unknown`)
    })
  })
})
