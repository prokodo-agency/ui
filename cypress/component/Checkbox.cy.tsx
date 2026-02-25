import { Checkbox } from "../../src/components/checkbox"
import CheckboxClient from "../../src/components/checkbox/Checkbox.client"

describe("Checkbox", () => {
  it("renders with a label", () => {
    cy.mount(
      <Checkbox
        id="terms"
        name="terms"
        title="I agree to terms"
        value="terms"
      />,
    )
    cy.contains("I agree to terms").should("be.visible")
  })

  it("starts unchecked by default", () => {
    cy.mount(
      <Checkbox
        id="news"
        name="news"
        title="Subscribe to newsletter"
        value="news"
      />,
    )
    cy.get("input[type='checkbox']").should("not.be.checked")
  })

  it("can be toggled by clicking", () => {
    cy.mount(<CheckboxClient id="ch1" name="ch1" title="Accept" value="ch1" />)
    cy.get("input[type='checkbox']").check({ force: true })
    cy.get("input[type='checkbox']").should("be.checked")
  })

  it("is disabled when disabled=true", () => {
    cy.mount(
      <Checkbox
        disabled
        id="dis"
        name="dis"
        title="Disabled option"
        value="dis"
      />,
    )
    cy.get("input[type='checkbox']").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Checkbox
        id="a11y-ch"
        name="a11y-ch"
        title="Accessible checkbox"
        value="a11y-ch"
      />,
    )
    cy.checkAccessibility()
  })

  it("checked state has no accessibility violations", () => {
    cy.mount(
      <Checkbox
        checked
        id="checked-ch"
        name="checked-ch"
        title="Checked option"
        value="checked-ch"
      />,
    )
    cy.checkAccessibility()
  })

  it("calls onChange when toggled", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <CheckboxClient
        id="ch-cb"
        name="ch-cb"
        title="Accept"
        value="ch-cb"
        onChange={onChange}
      />,
    )
    cy.get("input[type='checkbox']").check({ force: true })
    cy.get("@onChange").should("have.been.called")
  })

  it("onChange receives checked=true when checking", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <CheckboxClient
        id="ch-true"
        name="ch-true"
        title="Accept"
        value="ch-true"
        onChange={onChange}
      />,
    )
    cy.get("input[type='checkbox']").check({ force: true })
    cy.get("@onChange").should(
      "have.been.calledWith",
      Cypress.sinon.match.any,
      true,
    )
  })

  it("onChange receives checked=false when unchecking", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <CheckboxClient
        id="ch-false"
        name="ch-false"
        title="Accept"
        value="ch-false"
        defaultChecked
        onChange={onChange}
      />,
    )
    cy.get("input[type='checkbox']").uncheck({ force: true })
    cy.get("@onChange").should(
      "have.been.calledWith",
      Cypress.sinon.match.any,
      false,
    )
  })
})
