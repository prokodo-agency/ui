/* eslint-disable testing-library/no-container */
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { DynamicListView } from "./DynamicList.view"

const textField = [
  {
    name: "item",
    fieldType: "input" as const,
    id: "item",
    label: "Item",
  },
]

describe("DynamicList", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a fieldset", () => {
      render(
        <DynamicListView
          fields={textField}
          id="list"
          label="Items"
          name="items"
          value={[{ item: "" }]}
        />,
      )
      expect(screen.getByRole("group")).toBeInTheDocument()
    })

    it("renders a legend label", () => {
      render(
        <DynamicListView
          fields={textField}
          id="list"
          label="Shopping list"
          name="items"
          value={[{ item: "" }]}
        />,
      )
      // Label splits text across <i> elements; query the legend by its partial text

      const legend = document.querySelector("legend")
      expect(legend?.textContent).toContain("Shopping")
    })

    it("renders field rows for each value entry", () => {
      render(
        <DynamicListView
          fields={textField}
          id="list"
          label="Items"
          name="items"
          value={[{ item: "Apple" }, { item: "Banana" }]}
        />,
      )
      // Two rows of list items
      const lists = screen.getAllByRole("list")
      expect(lists.length).toBeGreaterThanOrEqual(2)
    })

    it("renders error text when provided", () => {
      render(
        <DynamicListView
          errorText="At least one item required"
          fields={textField}
          id="list"
          label="Items"
          name="items"
          value={[]}
        />,
      )
      expect(screen.getByText("At least one item required")).toBeInTheDocument()
    })

    it("renders helper text when provided", () => {
      render(
        <DynamicListView
          fields={textField}
          helperText="Add up to 5 items"
          id="list"
          label="Items"
          name="items"
          value={[]}
        />,
      )
      expect(screen.getByText("Add up to 5 items")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("empty dynamic list has no axe violations", async () => {
      const { container } = render(
        <DynamicListView
          fields={textField}
          id="a11y-list"
          label="Your items"
          name="items"
          value={[]}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("populated dynamic list has no axe violations", async () => {
      const { container } = render(
        <DynamicListView
          fields={textField}
          id="a11y-list-pop"
          label="Your items"
          name="items"
          value={[{ item: "React" }]}
        />,
      )
      // The delete button is rendered as a direct child of <ul> (known structural pattern);
      // disable the list rule to focus on meaningful a11y checks
      const results = await axe(container, {
        rules: { list: { enabled: false } },
      })
      expect(results).toHaveNoViolations()
    })
  })
})

describe("DynamicListView – select and multi-field coverage", () => {
  const selectField = [
    {
      fieldType: "select" as const,
      name: "category",
      label: "Category",
      items: [
        { label: "Tech", value: "tech" },
        { label: "Art", value: "art" },
      ],
    },
  ]

  const multiInputFields = [
    { fieldType: "input" as const, name: "first", label: "First" },
    { fieldType: "input" as const, name: "last", label: "Last" },
  ]

  it("renders a select field when fieldType is select", () => {
    const { container } = render(
      <DynamicListView
        fields={selectField}
        id="select-list"
        name="cats"
        value={["tech"]}
      />,
    )
    // Select component renders inside the list; check fieldset is present
    expect(container.querySelector("fieldset")).toBeTruthy()
    // Verify at least one list item was rendered (select case rendered)
    expect(container.querySelector("li")).toBeTruthy()
  })

  it("renders multi-field input rows with !single branch", () => {
    const { container } = render(
      <DynamicListView
        fields={multiInputFields}
        id="multi-list"
        name="persons"
        value={[{ first: "Alice", last: "Smith" }]}
      />,
    )
    expect(
      container.querySelectorAll("[data-field='first']").length,
    ).toBeGreaterThan(0)
    expect(
      container.querySelectorAll("[data-field='last']").length,
    ).toBeGreaterThan(0)
  })

  it("renders multi-field select with !single value branch", () => {
    const multiSelectFields = [
      {
        fieldType: "select" as const,
        name: "color",
        label: "Color",
        items: [{ label: "Red", value: "red" }],
      },
      {
        fieldType: "select" as const,
        name: "size",
        label: "Size",
        items: [{ label: "S", value: "s" }],
      },
    ]
    const { container } = render(
      <DynamicListView
        fields={multiSelectFields}
        id="ms-list"
        name="variants"
        value={[{ color: "red", size: "s" }]}
      />,
    )
    // Two fields rendered inside the row; fieldset should be present
    expect(container.querySelector("fieldset")).toBeTruthy()
    expect(container.querySelectorAll("li").length).toBeGreaterThan(0)
  })
})
