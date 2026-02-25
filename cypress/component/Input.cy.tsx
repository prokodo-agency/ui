import { Input } from "../../src/components/input"
import InputClient from "../../src/components/input/Input.client"

describe("Input", () => {
  it("renders with a label", () => {
    cy.mount(<Input id="name" name="name" label="Full name" />)
    cy.contains("Full name").should("be.visible")
  })

  it("accepts typed text", () => {
    cy.mount(<InputClient id="search" name="search" label="Search" />)
    cy.get("input").type("Hello World", { force: true })
    cy.get("input").should("have.value", "Hello World")
  })

  it("shows error text", () => {
    cy.mount(
      <Input id="email" name="email" label="Email" errorText="Invalid email" />,
    )
    cy.contains("Invalid email").should("be.visible")
  })

  it("is disabled when disabled=true", () => {
    cy.mount(<Input disabled id="field" name="field" label="Disabled field" />)
    cy.get("input").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Input id="a11y-input" name="a11y-input" label="Your name" />)
    cy.checkAccessibility()
  })

  it("error state has no accessibility violations", () => {
    cy.mount(
      <Input
        id="err-input"
        name="err-input"
        label="Email address"
        errorText="Please enter a valid email"
      />,
    )
    cy.checkAccessibility()
  })

  it("renders helperText when provided", () => {
    cy.mount(
      <Input
        id="helper-input"
        name="helper-input"
        label="Username"
        helperText="3–20 characters, letters and numbers only"
      />,
    )
    cy.contains("3–20 characters, letters and numbers only").should(
      "be.visible",
    )
  })

  it("required prop marks input as required", () => {
    cy.mount(<Input id="req-input" name="req-input" label="Email" required />)
    cy.get("input").should("have.attr", "required")
  })

  it("renders password input when type=password", () => {
    cy.mount(
      <Input
        id="pwd-input"
        name="pwd-input"
        label="Password"
        type="password"
      />,
    )
    cy.get("input[type='password']").should("exist")
  })

  it("renders with different input types", () => {
    cy.mount(<Input id="num" name="num" label="Age" type="number" />)
    cy.get("input[type='number']").should("exist")
  })

  it("helper text has no accessibility violations", () => {
    cy.mount(
      <Input
        id="a11y-helper"
        name="a11y-helper"
        label="Username"
        helperText="Must be unique"
      />,
    )
    cy.checkAccessibility()
  })
})
