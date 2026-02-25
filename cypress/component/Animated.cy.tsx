import { AnimatedView } from "../../src/components/animated/Animated.view"

describe("Animated", () => {
  it("renders children content", () => {
    cy.mount(
      <AnimatedView isVisible>
        <p>Animated content</p>
      </AnimatedView>,
    )
    cy.contains("Animated content").should("exist")
  })

  it("renders with fade-in animation class", () => {
    cy.mount(
      <AnimatedView animation="bottom-top" isVisible>
        <span>Fade in</span>
      </AnimatedView>,
    )
    cy.get("[class*='animate']").should("exist")
  })

  it("renders as visible when isVisible=true", () => {
    cy.mount(
      <AnimatedView isVisible>
        <span>Visible</span>
      </AnimatedView>,
    )
    cy.get("[class*='is-visible']").should("exist")
  })

  it("renders as disabled", () => {
    cy.mount(
      <AnimatedView disabled isVisible>
        <span>Disabled animation</span>
      </AnimatedView>,
    )
    cy.get("[class*='is-disabled']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <AnimatedView isVisible>
        <p>Accessible animated content</p>
      </AnimatedView>,
    )
    cy.checkAccessibility()
  })
})
