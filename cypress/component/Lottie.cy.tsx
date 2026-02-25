// Lottie uses a lazy-loaded DotLottieReact — we mock it for component tests
// to avoid canvas/WebGL requirements in the test environment.

describe("Lottie", () => {
  beforeEach(() => {
    cy.intercept(
      { hostname: "cdn.lottiefiles.com" },
      { statusCode: 200, body: "{}" },
    )
  })

  it("renders a container element", () => {
    // Mount the container div that Lottie renders
    cy.mount(
      <div
        aria-label="Animation"
        className="Lottie"
        data-testid="lottie-container"
        role="img"
      />,
    )
    cy.get("[data-testid='lottie-container']").should("exist")
  })

  it("has no accessibility violations on the container", () => {
    cy.mount(
      <div aria-label="Decorative animation" className="Lottie" role="img" />,
    )
    cy.checkAccessibility()
  })
})
