import { Table } from "../../src/components/table"

const tableData = {
  header: [{ label: "Name" }, { label: "Role" }, { label: "Status" }],
  body: [
    { cells: [{ label: "Alice" }, { label: "Admin" }, { label: "Active" }] },
    { cells: [{ label: "Bob" }, { label: "Editor" }, { label: "Inactive" }] },
  ],
}

describe("Table", () => {
  it("renders table headers", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="Test table"
        caption="Test table"
        id="test-table"
      />,
    )
    cy.get("th").should("have.length", 3)
    cy.contains("Name").should("be.visible")
    cy.contains("Role").should("be.visible")
  })

  it("renders table rows", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="Test table"
        caption="Test table"
        id="test-table"
      />,
    )
    cy.get("tbody tr").should("have.length", 2)
  })

  it("renders cell values", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="Test table"
        caption="Test table"
        id="test-table"
      />,
    )
    cy.contains("Alice").should("be.visible")
    cy.contains("Bob").should("be.visible")
  })

  it("renders with title", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="User list"
        caption="User list"
        id="titled"
        title="User List"
      />,
    )
    cy.contains("User List").should("be.visible")
  })

  it("renders with aria-label", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="User data table"
        caption="User data"
        id="aria-table"
      />,
    )
    cy.get("table").should("have.attr", "aria-label", "User data table")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Table
        {...tableData}
        ariaLabel="User table"
        caption="User table"
        id="a11y-table"
      />,
    )
    cy.checkAccessibility()
  })
})
