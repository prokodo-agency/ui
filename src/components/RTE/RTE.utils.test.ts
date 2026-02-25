import {
  addClasses,
  decorateToolbar,
  syncPickerSelected,
  cleanupQuill,
} from "./RTE.utils"

// RTE.module.scss is proxied by identity-obj-proxy (returns key as value).
// BEM class names won't be real CSS module hashes, but the functions
// should still add *some* class to the element, which is what we assert.

describe("addClasses", () => {
  it("adds a single class to an element", () => {
    const el = document.createElement("div")
    addClasses(el, "foo")
    expect(el).toHaveClass("foo")
  })

  it("is a no-op when el is null", () => {
    expect(() => addClasses(null, "foo")).not.toThrow()
  })

  it("adds multiple space-separated classes", () => {
    const el = document.createElement("div")
    addClasses(el, "foo bar baz")
    expect(el).toHaveClass("foo")
    expect(el).toHaveClass("bar")
    expect(el).toHaveClass("baz")
  })

  it("ignores empty / whitespace-only class strings", () => {
    const el = document.createElement("div")
    addClasses(el, "   ")
    expect(el.className).toBe("")
  })
})

// ────────────────────────────────────────────────────────────────────────────

describe("decorateToolbar", () => {
  it("adds BEM classes to toolbar buttons that have a ql-* class", () => {
    const toolbar = document.createElement("div")
    const button = document.createElement("button")
    button.className = "ql-bold"
    toolbar.appendChild(button)

    decorateToolbar(toolbar)

    // The button should have received additional BEM classes
    expect(button.classList.length).toBeGreaterThan(1)
  })

  it("adds BEM class to buttons without a ql-* class (no modifier branch)", () => {
    const toolbar = document.createElement("div")
    const plain = document.createElement("button")
    // No ql-* class – the modifier branch is skipped but the base class is still added
    toolbar.appendChild(plain)

    decorateToolbar(toolbar)

    expect(plain.classList.length).toBeGreaterThanOrEqual(1)
  })

  it("adds BEM classes to SVG children inside buttons", () => {
    const toolbar = document.createElement("div")
    const button = document.createElement("button")
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    button.appendChild(svg)
    toolbar.appendChild(button)

    decorateToolbar(toolbar)

    expect(svg.classList.length).toBeGreaterThan(0)
  })

  it("decorates SVG sub-elements with ql-fill / ql-stroke / ql-stroke-miter classes", () => {
    const toolbar = document.createElement("div")
    const button = document.createElement("button")
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const fillPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    )
    fillPath.className.baseVal = "ql-fill"
    const strokePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    )
    strokePath.className.baseVal = "ql-stroke"
    const miterPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    )
    miterPath.className.baseVal = "ql-stroke-miter"

    svg.appendChild(fillPath)
    svg.appendChild(strokePath)
    svg.appendChild(miterPath)
    button.appendChild(svg)
    toolbar.appendChild(button)

    decorateToolbar(toolbar)

    // All paths received the base icon-part class
    expect(fillPath.classList.length).toBeGreaterThan(1)
    expect(strokePath.classList.length).toBeGreaterThan(1)
    expect(miterPath.classList.length).toBeGreaterThan(1)
  })

  it("decorates picker elements including label, options, and items", () => {
    const toolbar = document.createElement("div")
    const picker = document.createElement("div")
    picker.className = "ql-picker"
    const label = document.createElement("span")
    label.className = "ql-picker-label"
    const options = document.createElement("div")
    options.className = "ql-picker-options"
    const item = document.createElement("div")
    item.className = "ql-picker-item"
    options.appendChild(item)
    picker.appendChild(label)
    picker.appendChild(options)
    toolbar.appendChild(picker)

    decorateToolbar(toolbar)

    expect(picker.classList.length).toBeGreaterThan(1)
    expect(label.classList.length).toBeGreaterThan(1)
    expect(options.classList.length).toBeGreaterThan(1)
    expect(item.classList.length).toBeGreaterThan(1)
  })
})

// ────────────────────────────────────────────────────────────────────────────

describe("syncPickerSelected", () => {
  it("sets data-selected='true' on items with ql-selected class", () => {
    const toolbar = document.createElement("div")
    const item = document.createElement("div")
    item.className = "ql-picker-item ql-selected"
    toolbar.appendChild(item)

    syncPickerSelected(toolbar)

    expect(item).toHaveAttribute("data-selected", "true")
  })

  it("removes data-selected from items without ql-selected class", () => {
    const toolbar = document.createElement("div")
    const item = document.createElement("div")
    item.className = "ql-picker-item"
    item.setAttribute("data-selected", "true") // previously selected
    toolbar.appendChild(item)

    syncPickerSelected(toolbar)

    expect(item).not.toHaveAttribute("data-selected")
  })
})

// ────────────────────────────────────────────────────────────────────────────

describe("cleanupQuill", () => {
  it("removes direct .ql-toolbar children from surfaceEl", () => {
    const surface = document.createElement("div")
    const toolbar = document.createElement("div")
    toolbar.className = "ql-toolbar"
    const mount = document.createElement("div")
    surface.appendChild(toolbar)
    surface.appendChild(mount)

    cleanupQuill(surface, mount)

    expect(surface.querySelector(".ql-toolbar")).toBeNull()
  })

  it("removes .ql-tooltip elements from surfaceEl", () => {
    const surface = document.createElement("div")
    const tooltip = document.createElement("div")
    tooltip.className = "ql-tooltip"
    const mount = document.createElement("div")
    surface.appendChild(tooltip)
    surface.appendChild(mount)

    cleanupQuill(surface, mount)

    expect(surface.querySelector(".ql-tooltip")).toBeNull()
  })

  it("removes extra .ql-container elements but keeps mountEl", () => {
    const surface = document.createElement("div")
    const mount = document.createElement("div")
    mount.className = "ql-container"
    const extra = document.createElement("div")
    extra.className = "ql-container"
    surface.appendChild(mount)
    surface.appendChild(extra)

    cleanupQuill(surface, mount)

    // extra should be removed; mount itself should remain
    expect(surface.querySelectorAll(".ql-container")).toHaveLength(1)
    expect(surface.querySelector(".ql-container")).toBe(mount)
  })

  it("clears mountEl innerHTML", () => {
    const surface = document.createElement("div")
    const mount = document.createElement("div")
    mount.innerHTML = "<span>quill content</span>"
    surface.appendChild(mount)

    cleanupQuill(surface, mount)

    expect(mount).toBeEmptyDOMElement()
  })

  it("does nothing when either argument is null", () => {
    expect(() => cleanupQuill(null, null)).not.toThrow()
    const div = document.createElement("div")
    expect(() =>
      cleanupQuill(div as unknown as HTMLDivElement, null),
    ).not.toThrow()
    expect(() =>
      cleanupQuill(null, div as unknown as HTMLDivElement),
    ).not.toThrow()
  })
})
