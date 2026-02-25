import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Table } from "./Table"

const defaultHeader = [{ label: "Name" }, { label: "Age" }, { label: "Role" }]
const defaultBody = [
  { cells: [{ label: "Alice" }, { label: "30" }, { label: "Admin" }] },
  { cells: [{ label: "Bob" }, { label: "25" }, { label: "User" }] },
]

describe("Table", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a table element", () => {
      render(
        <Table
          ariaLabel="Users table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="t1"
        />,
      )
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    it("renders all header cells", () => {
      render(
        <Table
          ariaLabel="Users table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="t1"
        />,
      )
      expect(screen.getByText("Name")).toBeInTheDocument()
      expect(screen.getByText("Age")).toBeInTheDocument()
      expect(screen.getByText("Role")).toBeInTheDocument()
    })

    it("renders all body cells", () => {
      render(
        <Table
          ariaLabel="Users table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="t1"
        />,
      )
      expect(screen.getByText("Alice")).toBeInTheDocument()
      expect(screen.getByText("30")).toBeInTheDocument()
      expect(screen.getByText("Bob")).toBeInTheDocument()
    })

    it("renders an aria-label on the table when provided", () => {
      render(
        <Table
          ariaLabel="User data table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="t1"
        />,
      )
      expect(
        screen.getByRole("table", { name: "User data table" }),
      ).toBeInTheDocument()
    })

    it("renders a title headline when title is a string", () => {
      render(
        <Table
          ariaLabel="Users table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="t1"
          title="Our Team"
        />,
      )
      expect(screen.getByText("Our Team")).toBeInTheDocument()
    })

    it("handles empty body rows gracefully", () => {
      render(
        <Table
          ariaLabel="Users table"
          body={[]}
          caption="Users"
          header={defaultHeader}
          id="t1"
        />,
      )
      expect(screen.getByRole("table")).toBeInTheDocument()
      // Both <thead> and <tbody> have rowgroup role; verify at least one exists
      expect(screen.getAllByRole("rowgroup").length).toBeGreaterThanOrEqual(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("table with aria-label has no axe violations", async () => {
      const { container } = render(
        <Table
          ariaLabel="A11y user table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="a11y-table"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("table with title has no axe violations", async () => {
      const { container } = render(
        <Table
          ariaLabel="Users table"
          body={defaultBody}
          caption="Users"
          header={defaultHeader}
          id="a11y-table-titled"
          title="Team members"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Table – additional coverage", () => {
  it("renders with content prop (RichText block)", () => {
    render(
      <Table
        ariaLabel="Content table"
        body={defaultBody}
        caption="Info"
        content="Additional table context."
        header={defaultHeader}
        id="t-content"
      />,
    )
    expect(screen.getByText("Additional table context.")).toBeInTheDocument()
  })

  it("renders cell with icon", () => {
    const bodyWithIcon = [
      {
        cells: [
          { label: "Alice", icon: { name: "CheckmarkBadge01Icon" as const } },
          { label: "30" },
          { label: "Admin" },
        ],
      },
    ]
    const { container } = render(
      <Table
        ariaLabel="Icon table"
        body={bodyWithIcon}
        caption="Users"
        header={defaultHeader}
        id="t-icon"
      />,
    )
    // The Icon component renders a <span> with a mask (not an SVG)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".prokodo-Icon")).toBeInTheDocument()
  })

  it("renders cell as link when row has redirect", () => {
    const bodyWithRedirect = [
      {
        redirect: { href: "/users/alice" },
        cells: [{ label: "Alice" }, { label: "30" }, { label: "Admin" }],
      },
    ]
    render(
      <Table
        ariaLabel="Redirect table"
        body={bodyWithRedirect}
        caption="Users"
        header={defaultHeader}
        id="t-redirect"
      />,
    )
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0)
  })

  it("renders cells with type=double (scope=row)", () => {
    const { container } = render(
      <Table
        ariaLabel="Double table"
        body={defaultBody}
        caption="Users"
        header={defaultHeader}
        id="t-double"
        type="double"
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("td[scope='row']")).toBeInTheDocument()
  })
})
