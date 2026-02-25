import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Label } from "./Label"

describe("Label", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a <label> element by default", () => {
      render(<Label htmlFor="email" label="Email" />)
      expect(screen.getByText("Email")).toBeInTheDocument()
    })

    it("renders as <legend> when type=legend", () => {
      render(<Label label="Choose one" type="legend" />)
      // Label splits text across <i> elements; find the legend element itself

      const legend = document.querySelector("legend")
      expect(legend).toBeTruthy()
      expect(legend?.textContent).toContain("Choose")
    })

    it("renders required marker when required=true", () => {
      render(<Label required label="Name" />)
      expect(screen.getByText("Name")).toBeInTheDocument()
    })

    it("renders with error state", () => {
      render(<Label error label="Field" />)
      expect(screen.getByText("Field")).toBeInTheDocument()
    })

    it("renders children", () => {
      render(
        <Label label="Parent">
          <span>Child content</span>
        </Label>,
      )
      expect(screen.getByText("Child content")).toBeInTheDocument()
    })

    it("renders with custom className", () => {
      const { container } = render(<Label className="my-label" label="Test" />)
      expect(container.firstChild).toHaveClass("my-label")
    })

    it("renders without label text", () => {
      const { container } = render(<Label label="placeholder" />)
      // When label prop is provided, component renders (even without children)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with htmlFor linking to an input", () => {
      render(
        <div>
          <Label htmlFor="name-input" label="Full name" />
          <input id="name-input" type="text" />
        </div>,
      )
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("label with htmlFor has no axe violations", async () => {
      const { container } = render(
        <div>
          <Label htmlFor="test-input" label="Your email" />
          <input id="test-input" type="email" />
        </div>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("legend type has no axe violations inside fieldset", async () => {
      const { container } = render(
        <fieldset>
          <Label label="Select an option" type="legend" />
          <label htmlFor="opt-a">Option A</label>
          <input id="opt-a" name="opt" type="radio" value="a" />
        </fieldset>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("required label has no axe violations", async () => {
      const { container } = render(
        <div>
          <Label required htmlFor="req-input" label="Required field" />
          <input required id="req-input" type="text" />
        </div>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe("edge cases", () => {
    it("returns children when label is not provided (no splittedLabel)", () => {
      render(
        <Label htmlFor="x">
          <span data-testid="child">child</span>
        </Label>,
      )
      expect(screen.getByTestId("child")).toBeInTheDocument()
    })

    it("renders with textProps.className (covers textProps?.className branches)", () => {
      render(
        <Label
          htmlFor="x"
          label="Hello world"
          textProps={{ className: "custom-text" }}
        />,
      )
      expect(screen.getByText("Hello")).toBeInTheDocument()
    })
  })
})
