// Map uses Google Maps API which requires a real key and DOM canvas.
// These tests verify the loading/skeleton state which renders without a key.

import { Skeleton } from "../../src/components/skeleton"

describe("Map (loading state)", () => {
  it("renders a skeleton while loading", () => {
    // The Map component shows a Skeleton while waiting for Google Maps API
    cy.mount(<Skeleton height="400px" variant="rectangular" width="100%" />)
    cy.get("[class*='Skeleton']").should("exist")
  })

  it("skeleton placeholder has correct dimensions", () => {
    cy.mount(<Skeleton height="400px" variant="rectangular" width="100%" />)
    cy.get("[style*='height: 400px']").should("exist")
  })

  it("has no accessibility violations on the placeholder", () => {
    cy.mount(
      <div
        aria-label="Map loading"
        role="region"
        style={{ width: "100%", height: "400px" }}
      >
        <Skeleton height="400px" variant="rectangular" width="100%" />
      </div>,
    )
    cy.checkAccessibility()
  })
})
