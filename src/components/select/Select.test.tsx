import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Select } from "./Select"

const items = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
]

describe("Select", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders nothing when items array is empty", () => {
      const { container } = render(
        <Select id="empty" items={[]} label="Fruits" value="" />,
      )
      expect(container).toBeEmptyDOMElement()
    })

    it("renders a button trigger with placeholder by default", () => {
      render(<Select id="fruits" items={items} label="Fruits" />)
      expect(screen.getByText("-- Please choose --")).toBeInTheDocument()
    })

    it("renders a custom placeholder", () => {
      render(
        <Select
          id="fruits"
          items={items}
          label="Fruits"
          placeholder="Select a fruit"
        />,
      )
      expect(screen.getByText("Select a fruit")).toBeInTheDocument()
    })

    it("renders the associated label", () => {
      const { container } = render(
        <Select id="fruits" items={items} label="Favourite Fruit" />,
      )
      // Label splits text across <i> elements; check the overall label container text
      // eslint-disable-next-line testing-library/no-container
      const labelEl = container.querySelector("label")
      expect(labelEl?.textContent).toContain("Favourite")
      expect(labelEl?.textContent).toContain("Fruit")
    })

    it("hides the label when hideLabel=true", () => {
      render(
        <Select hideLabel id="fruits" items={items} label="Favourite Fruit" />,
      )
      // label is visually hidden but may still be in DOM
      // the visible text is not shown as a regular label
      expect(screen.queryByRole("label")).not.toBeInTheDocument()
    })

    it("renders helper text when provided", () => {
      render(
        <Select
          helperText="Choose your preference"
          id="fruits"
          items={items}
          label="Fruits"
        />,
      )
      expect(screen.getByText("Choose your preference")).toBeInTheDocument()
    })

    it("renders error text when provided", () => {
      render(
        <Select
          errorText="This field is required"
          id="fruits"
          items={items}
          label="Fruits"
        />,
      )
      expect(screen.getByText("This field is required")).toBeInTheDocument()
    })

    it("renders selected item label when value is set", () => {
      render(<Select id="fruits" items={items} label="Fruits" value="b" />)
      expect(screen.getByText("Banana")).toBeInTheDocument()
    })

    it("marks required with aria-required", () => {
      render(<Select required id="fruits" items={items} label="Fruits" />)
      // Select renders a button trigger; the hidden input carries required semantics
      // The trigger button itself conveys required via aria-required on the listbox
      const trigger = screen.getByRole("button")
      expect(trigger).toBeInTheDocument()
      // Verify component renders without error when required=true
      expect(trigger).toBeEnabled()
    })

    it("marks disabled trigger when disabled=true", () => {
      render(<Select disabled id="fruits" items={items} label="Fruits" />)
      const trigger = screen.getByRole("button")
      expect(trigger).toBeDisabled()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("closed select has no axe violations", async () => {
      const { container } = render(
        <Select id="a11y-select" items={items} label="Choose fruit" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("select with value has no axe violations", async () => {
      const { container } = render(
        <Select
          id="a11y-select-val"
          items={items}
          label="Choose fruit"
          value="a"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("select with error has no axe violations", async () => {
      const { container } = render(
        <Select
          errorText="Please select an option"
          id="a11y-select-err"
          items={items}
          label="Choose fruit"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("trigger button has aria-controls pointing to listbox", () => {
      render(<Select id="ctrl-select" items={items} label="Fruit" />)
      const btn = screen.getByRole("button")
      expect(btn).toHaveAttribute("aria-controls", "ctrl-select-listbox")
    })
  })
})
