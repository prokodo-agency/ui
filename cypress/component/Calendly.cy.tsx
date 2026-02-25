import { CalendlyView } from "../../src/components/calendly/Calendly.view"

describe("Calendly", () => {
  it("renders calendly embed container", () => {
    cy.mount(<CalendlyView calendlyId="test-user/meeting" />)
    cy.get("[data-calendly]").should("exist")
  })

  it("renders loading spinner by default", () => {
    cy.mount(<CalendlyView calendlyId="test-user/meeting" />)
    cy.get("[role='status']").should("exist")
  })

  it("hides loading spinner when hideLoading=true", () => {
    cy.mount(<CalendlyView calendlyId="test-user/call" hideLoading />)
    cy.get("[role='status']").should("not.exist")
  })

  it("embed container has minimum height", () => {
    cy.mount(<CalendlyView calendlyId="test-user/meeting" />)
    cy.get("[data-calendly]").should("have.css", "min-width", "320px")
  })

  it("has no accessibility violations", () => {
    cy.mount(<CalendlyView calendlyId="test-user/meeting" hideLoading />)
    cy.checkAccessibility()
  })
})
