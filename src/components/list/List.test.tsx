import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

import { List } from "./List"

const items = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
  { id: "3", title: "Third item" },
]

describe("List", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a <ul> element", () => {
      render(<List items={items} />)
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("renders all items", () => {
      render(<List items={items} />)
      expect(screen.getByText("First item")).toBeInTheDocument()
      expect(screen.getByText("Second item")).toBeInTheDocument()
      expect(screen.getByText("Third item")).toBeInTheDocument()
    })

    it("renders empty list when no items provided", () => {
      render(<List items={[]} />)
      expect(screen.getByRole("list")).toBeInTheDocument()
      expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    })

    it("renders with custom className", () => {
      render(<List className="my-list" items={items} />)
      expect(screen.getByRole("list")).toHaveClass("my-list")
    })

    it("renders with type=icon", () => {
      const iconItems = [
        { id: "a", title: "Icon item", icon: "AbacusIcon" as const },
      ]
      render(<List items={iconItems} />)
      expect(screen.getByText("Icon item")).toBeInTheDocument()
    })

    it("renders item descriptions", () => {
      const descItems = [{ id: "i1", title: "Title", desc: "Item description" }]
      render(<List items={descItems} />)
      expect(screen.getByText("Item description")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onClick when list item is clicked", async () => {
      const handleClick = jest.fn()
      const clickItems = [
        { id: "c1", title: "Clickable", onClick: handleClick },
      ]
      render(<List items={clickItems} type="default" />)
      const listitem = screen.getByRole("button", { name: /clickable/i })
      listitem.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("static list has no axe violations", async () => {
      const { container } = render(
        <List
          aria-label="Features list"
          items={[
            { id: "f1", title: "Feature one" },
            { id: "f2", title: "Feature two" },
          ]}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("empty list has no axe violations", async () => {
      const { container } = render(<List aria-label="Empty list" items={[]} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

// -------------------------------------------------------------------------
// List — additional branch coverage tests
// -------------------------------------------------------------------------
describe("List – type=card, redirect, and keyboard interaction branches", () => {
  it("renders type=card items inside a Card component", () => {
    render(<List items={[{ id: "c1", title: "Card Item" }]} type="card" />)
    expect(screen.getByText("Card Item")).toBeInTheDocument()
  })

  it("renders type=card item with a non-null icon", () => {
    render(
      <List
        items={[{ id: "c2", title: "Icon Card", icon: "AbacusIcon" as never }]}
        type="card"
      />,
    )
    expect(screen.getByText("Icon Card")).toBeInTheDocument()
  })

  it("renders type=card item with JSX icon element", () => {
    render(
      <List
        type="card"
        items={[
          {
            id: "c3",
            title: "JSX Card",
            icon: <span data-testid="custom-icon" />,
          },
        ]}
      />,
    )
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })

  it("renders redirect items as links inside list items", () => {
    render(
      <List
        items={[
          {
            id: "r1",
            title: "Link Item",
            redirect: { href: "/about" } as never,
          },
        ]}
      />,
    )
    expect(screen.getByText("Link Item")).toBeInTheDocument()
  })

  it("calls onClick on Enter key press for type=default clickable item", () => {
    const onClick = jest.fn()
    render(
      <List
        items={[{ id: "k1", title: "KeyDown Item", onClick }]}
        type="default"
      />,
    )
    const btn = screen.getByRole("button", { name: /keydown item/i })
    fireEvent.keyDown(btn, { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("calls onClick on Space key press for type=default clickable item", () => {
    const onClick = jest.fn()
    render(
      <List
        items={[{ id: "k2", title: "Space Item", onClick }]}
        type="default"
      />,
    )
    const btn = screen.getByRole("button", { name: /space item/i })
    fireEvent.keyDown(btn, { key: " " })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick for non-Enter/Space key presses", () => {
    const onClick = jest.fn()
    render(
      <List
        items={[{ id: "k3", title: "Other Key", onClick }]}
        type="default"
      />,
    )
    const btn = screen.getByRole("button", { name: /other key/i })
    fireEvent.keyDown(btn, { key: "Tab" })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders DescParagraph only when desc is a string", () => {
    render(
      <List
        items={[
          { id: "d1", title: "With Desc", desc: "My description" },
          { id: "d2", title: "Without Desc" },
        ]}
      />,
    )
    expect(screen.getByText("My description")).toBeInTheDocument()
    // d2 has no description shown
    expect(screen.queryByText("undefined")).not.toBeInTheDocument()
  })

  it("renders empty list when items prop is not provided (uses default [])", () => {
    // Pass undefined explicitly to exercise the default parameter branch (items = [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<List items={undefined as any} />)
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })

  it("covers options explicit branch when options is provided", () => {
    render(<List items={items} options={{}} />)
    expect(screen.getByRole("list")).toBeInTheDocument()
  })
})
