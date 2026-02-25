import { InputOTP } from "../../src/components/inputOTP"

describe("InputOTP", () => {
  it("renders 6 inputs by default", () => {
    cy.mount(<InputOTP groupLabel="One-time password" />)
    cy.get("input").should("have.length", 6)
  })

  it("renders with a group label", () => {
    cy.mount(<InputOTP groupLabel="Verification code" />)
    cy.contains("Verification code").should("be.visible")
  })

  it("renders custom length inputs", () => {
    cy.mount(<InputOTP groupLabel="PIN" length={4} />)
    cy.get("input").should("have.length", 4)
  })

  it("all inputs start empty", () => {
    cy.mount(<InputOTP groupLabel="OTP" />)
    cy.get("input").each($input => {
      cy.wrap($input).should("have.value", "")
    })
  })

  it("has no accessibility violations", () => {
    cy.mount(<InputOTP groupLabel="Enter verification code" />)
    cy.checkAccessibility()
  })

  it("accepts a digit in the first cell", () => {
    cy.mount(<InputOTP groupLabel="OTP" />)
    cy.get("input").first().type("5")
    cy.get("input").first().should("have.value", "5")
  })

  it("moves focus to next cell after typing a digit", () => {
    cy.mount(<InputOTP groupLabel="OTP" />)
    cy.get("input").first().type("3")
    cy.get("input").eq(1).should("be.focused")
  })

  it("accepts digits for each cell individually", () => {
    cy.mount(<InputOTP groupLabel="OTP" length={4} />)
    cy.get("input").each(($input, idx) => {
      cy.wrap($input).type(String(idx + 1))
    })
    cy.get("input").eq(0).should("have.value", "1")
    cy.get("input").eq(1).should("have.value", "2")
    cy.get("input").eq(2).should("have.value", "3")
    cy.get("input").eq(3).should("have.value", "4")
  })
})
