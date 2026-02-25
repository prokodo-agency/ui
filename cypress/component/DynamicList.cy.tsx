import { DynamicListView } from "../../src/components/dynamic-list/DynamicList.view"
import DynamicListClient from "../../src/components/dynamic-list/DynamicList.client"

const singleField = [
  { fieldType: "input" as const, name: "email", label: "Email", type: "email" },
]

describe("DynamicList", () => {
  it("renders a fieldset", () => {
    cy.mount(
      <DynamicListView
        fields={singleField}
        id="emails"
        name="emails"
        value={[]}
      />,
    )
    cy.get("fieldset").should("exist")
  })

  it("renders with a label", () => {
    cy.mount(
      <DynamicListView
        fields={singleField}
        id="emails"
        label="Email addresses"
        name="emails"
        value={[]}
      />,
    )
    cy.contains("Email addresses").should("be.visible")
  })

  it("renders existing value rows", () => {
    cy.mount(
      <DynamicListView
        fields={singleField}
        id="emails"
        name="emails"
        value={["test@example.com"]}
      />,
    )
    cy.get("input[type='email']").should("have.value", "test@example.com")
  })

  it("renders error text", () => {
    cy.mount(
      <DynamicListView
        errorText="At least one entry is required"
        fields={singleField}
        id="emails"
        name="emails"
        value={[]}
      />,
    )
    cy.contains("At least one entry is required").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <DynamicListView
        fields={singleField}
        id="a11y-list"
        label="Contact emails"
        name="contactEmails"
        value={[]}
      />,
    )
    cy.checkAccessibility()
  })

  it("Add item button adds a new row", () => {
    cy.mount(
      <DynamicListClient
        fields={singleField}
        id="dynamic-add"
        name="emails"
        value={[]}
      />,
    )
    // Wait for island to hydrate (button visible = JS attached)
    cy.get("[title='Add item']").should("be.visible")
    // starts with no rows (empty value)
    cy.get("input[type='email']").should("have.length", 0)
    // The Add-item Button uses createIsland (React.lazy). A short wait ensures
    // the lazy chunk resolves so the click fires on the hydrated client button.
    cy.wait(300)
    cy.get("[title='Add item']").click()
    cy.get("input[type='email']").should("have.length", 1)
  })

  it("Add item again creates a second row", () => {
    cy.mount(
      <DynamicListClient
        fields={singleField}
        id="dynamic-multi"
        name="emails"
        value={[]}
      />,
    )
    cy.get("[title='Add item']").should("be.visible").click()
    cy.get("[title='Add item']").click()
    cy.get("input[type='email']").should("have.length", 2)
  })

  it("Remove button removes the row", () => {
    cy.mount(
      <DynamicListClient
        fields={singleField}
        id="dynamic-remove"
        label="Email"
        name="emails"
        value={[{ email: "test@example.com" }]}
      />,
    )
    cy.get("input[type='email']").should("have.length", 1)
    cy.get("[aria-label='Remove Email entry 1']").should("be.visible").click()
    cy.get("input[type='email']").should("have.length", 0)
  })

  it("calls onChange when a row is added", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <DynamicListClient
        fields={singleField}
        id="dynamic-onchange"
        name="emails"
        value={[]}
        onChange={onChange}
      />,
    )
    cy.get("[title='Add item']").should("be.visible").click()
    cy.get("@onChange").should("have.been.called")
  })
})
