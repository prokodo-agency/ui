import { FormView } from "../../src/components/form/Form.view"

const minimalHoneypot = { value: "", readOnly: true as const }

describe("Form", () => {
  it("renders with a label/headline", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="contact"
        isFormValid={false}
        label="Contact Us"
        onFormSubmit={cy.stub()}
      />,
    )
    cy.contains("Contact Us").should("be.visible")
  })

  it("renders a form element", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="form-test"
        isFormValid={false}
        label="Sign Up"
        onFormSubmit={cy.stub()}
      />,
    )
    cy.get("form").should("exist")
  })

  it("renders a hidden honeypot input", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="honeypot-form"
        isFormValid={false}
        label="Test Form"
        onFormSubmit={cy.stub()}
      />,
    )
    // Honeypot is a visually hidden input
    cy.get("input[tabindex='-1']").should("exist")
  })

  it("calls onFormSubmit when submitted", () => {
    // Use preventDefault in the stub to prevent form navigation which would
    // cause Cypress to re-run the spec file on each submit
    const onFormSubmit = cy
      .stub()
      .as("onFormSubmit")
      .callsFake((e: Event) => e.preventDefault())
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="submit-form"
        isFormValid
        label="Submit Form"
        onFormSubmit={onFormSubmit}
      />,
    )
    cy.get("form").submit()
    cy.get("@onFormSubmit").should("have.been.called")
  })

  it("submit button is disabled when isFormValid=false", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="invalid-form"
        isFormValid={false}
        isHoneypotEmpty
        label="Test Form"
        button={{}}
        onFormSubmit={cy.stub()}
      />,
    )
    // Button island renders as server (no onClick) -- disabled attr is set
    cy.get("button[type='submit']").should("be.disabled")
  })

  it("submit button is enabled when isFormValid=true", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="valid-form"
        isFormValid
        isHoneypotEmpty
        label="Test Form"
        button={{}}
        onFormSubmit={cy.stub()}
      />,
    )
    cy.get("button[type='submit']").should("not.be.disabled")
  })

  it("submit button renders when honeypot is empty and button is configured", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="btn-form"
        isFormValid
        isHoneypotEmpty
        label="Test Form"
        button={{}}
        onFormSubmit={cy.stub()}
      />,
    )
    cy.get("button[type='submit']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <FormView
        formState={[]}
        honeypot={minimalHoneypot}
        id="a11y-form"
        isFormValid={false}
        label="Accessible Form"
        onFormSubmit={cy.stub()}
      />,
    )
    cy.checkAccessibility()
  })
})
