import { getTracking } from "./getTracking"

describe("getTracking", () => {
  it("returns tracking data from document element attributes", () => {
    document.documentElement.setAttribute("data-gclid", "test-gclid")
    document.documentElement.setAttribute("data-gaclientid", "test-ga-id")

    const result = getTracking()
    expect(result).toEqual({
      gclid: "test-gclid",
      gaClientId: "test-ga-id",
    })

    // cleanup
    document.documentElement.removeAttribute("data-gclid")
    document.documentElement.removeAttribute("data-gaclientid")
  })

  it("returns null values when attributes are not set", () => {
    document.documentElement.removeAttribute("data-gclid")
    document.documentElement.removeAttribute("data-gaclientid")

    const result = getTracking()
    expect(result).toEqual({
      gclid: null,
      gaClientId: null,
    })
  })
})
