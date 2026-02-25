import { Icon } from "../../src/components/icon"

describe("Icon", () => {
  it("renders an icon", () => {
    cy.mount(<Icon name="Home01Icon" />)
    cy.get("[class*='Icon']").should("exist")
  })

  it("renders with a custom size", () => {
    cy.mount(<Icon name="Home01Icon" size={32} />)
    cy.get("[class*='Icon']").invoke("attr", "style").should("include", "32")
  })

  it("renders with an aria-label for accessibility", () => {
    cy.mount(<Icon label="Home icon" name="Home01Icon" />)
    cy.get("[aria-label='Home icon']").should("exist")
  })

  it("renders presentational icon with aria-hidden", () => {
    cy.mount(<Icon name="Home01Icon" />)
    // Icons without label should be hidden from screen readers
    cy.get("[aria-hidden='true'], img[alt='']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Icon label="Navigation icon" name="Home01Icon" />)
    cy.checkAccessibility()
  })
})
