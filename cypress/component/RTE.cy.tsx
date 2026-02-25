import { RTEView } from "../../src/components/RTE/RTE.view"

describe("RTE (Rich Text Editor)", () => {
  it("renders the editable surface", () => {
    cy.mount(<RTEView name="content" placeholder="Start typing..." value="" />)
    // RTEView uses Input island; server fallback renders a textarea (multiline)
    cy.get("textarea, [class*='Input']").should("exist")
  })

  it("renders with a placeholder", () => {
    cy.mount(
      <RTEView name="editor" placeholder="Enter rich content here" value="" />,
    )
    // Placeholder attribute is on the underlying textarea element
    cy.get("textarea").should(
      "have.attr",
      "placeholder",
      "Enter rich content here",
    )
  })

  it("renders in read-only mode", () => {
    cy.mount(
      <RTEView name="readonly" readOnly value="<p>Read-only content</p>" />,
    )
    cy.get("textarea[readonly], input[readonly]").should("exist")
  })

  it("renders error text", () => {
    cy.mount(
      <RTEView errorText="Content is required" name="required" value="" />,
    )
    cy.contains("Content is required").should("be.visible")
  })

  it("has no accessibility violations", () => {
    cy.mount(<RTEView name="a11y-editor" placeholder="Enter text" value="" />)
    cy.checkAccessibility()
  })
})
