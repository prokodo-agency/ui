import { getTheme } from "./theme"

describe("getTheme", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme")
  })

  it("returns 'light' when data-theme is set to light", () => {
    document.documentElement.setAttribute("data-theme", "light")
    expect(getTheme()).toBe("light")
  })

  it("returns 'dark' when data-theme is set to dark", () => {
    document.documentElement.setAttribute("data-theme", "dark")
    expect(getTheme()).toBe("dark")
  })

  it("returns null when data-theme attribute is not set", () => {
    expect(getTheme()).toBeNull()
  })
})
