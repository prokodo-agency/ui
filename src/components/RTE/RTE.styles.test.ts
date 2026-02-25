/* eslint-disable testing-library/no-node-access */
import "@testing-library/jest-dom"

// NOTE: ensureQuillSnowStyles relies on a module-level `injected` boolean.
// To test all branches we must reload the module in each test with jest.isolateModules.

describe("ensureQuillSnowStyles", () => {
  beforeEach(() => {
    document.head.innerHTML = ""
  })

  it("appends a <style> element with the provided CSS text on first call", () => {
    jest.isolateModules(() => {
      const { ensureQuillSnowStyles } = require("./RTE.styles") as {
        ensureQuillSnowStyles: (css: string) => void
      }
      ensureQuillSnowStyles("body { color: red; }")
      const el = document.getElementById("rte-quill-snow")
      expect(el).not.toBeNull()
      expect(el!).toHaveTextContent("body { color: red; }")
      expect(el!.tagName.toLowerCase()).toBe("style")
    })
  })

  it("does not append a second element on repeated calls (injected guard)", () => {
    jest.isolateModules(() => {
      const { ensureQuillSnowStyles } = require("./RTE.styles") as {
        ensureQuillSnowStyles: (css: string) => void
      }
      ensureQuillSnowStyles("first call")
      ensureQuillSnowStyles("second call") // should be ignored
      const els = document.querySelectorAll("#rte-quill-snow")
      expect(els).toHaveLength(1)
      expect(els[0]).toHaveTextContent("first call")
    })
  })

  it("recognises a pre-existing element and sets injected=true without re-appending", () => {
    jest.isolateModules(() => {
      const existing = document.createElement("style")
      existing.id = "rte-quill-snow"
      existing.textContent = "pre-existing"
      document.head.appendChild(existing)

      const { ensureQuillSnowStyles } = require("./RTE.styles") as {
        ensureQuillSnowStyles: (css: string) => void
      }
      ensureQuillSnowStyles("new css")

      const els = document.querySelectorAll("#rte-quill-snow")
      expect(els).toHaveLength(1)
      expect(els[0]).toHaveTextContent("pre-existing")
    })
  })
})
