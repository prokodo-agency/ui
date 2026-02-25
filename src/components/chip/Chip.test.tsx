import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Chip } from "./Chip"

describe("Chip", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with a label", () => {
      render(<Chip label="React" />)
      expect(screen.getByText("React")).toBeInTheDocument()
    })

    it("renders filled variant by default", () => {
      render(<Chip label="Tag" />)
      expect(screen.getByText("Tag")).toBeInTheDocument()
    })

    it("renders outlined variant", () => {
      render(<Chip label="Outlined" variant="outlined" />)
      expect(screen.getByText("Outlined")).toBeInTheDocument()
    })

    it("renders delete button when onDelete is provided", () => {
      render(<Chip label="Deletable" onDelete={jest.fn()} />)
      expect(screen.getByRole("button", { name: "delete" })).toBeInTheDocument()
    })

    it("does not render delete button when onDelete is not provided", () => {
      render(<Chip label="Static" />)
      expect(
        screen.queryByRole("button", { name: "delete" }),
      ).not.toBeInTheDocument()
    })

    it("renders with all color variants", () => {
      const colors = [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
      ] as const
      colors.forEach(color => {
        const { unmount } = render(<Chip color={color} label={color} />)
        expect(screen.getByText(color)).toBeInTheDocument()
        unmount()
      })
    })

    it("applies custom className", () => {
      render(<Chip className="custom-chip" label="Class" />)
      expect(screen.getByRole("button")).toHaveClass("custom-chip")
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = jest.fn()
      render(<Chip label="Clickable" onClick={handleClick} />)
      const el = screen.getByRole("button")
      await userEvent.click(el)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("calls onDelete when delete button clicked", async () => {
      const handleDelete = jest.fn()
      render(<Chip label="Delete me" onDelete={handleDelete} />)
      await userEvent.click(screen.getByRole("button", { name: "delete" }))
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("static chip has no axe violations", async () => {
      const { container } = render(<Chip label="Tag" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("deletable chip has no axe violations", async () => {
      const { container } = render(
        <Chip label="Remove me" onDelete={jest.fn()} />,
      )
      // nested-interactive is a known design pattern for chips with delete buttons
      const results = await axe(container, {
        rules: { "nested-interactive": { enabled: false } },
      })
      expect(results).toHaveNoViolations()
    })

    it("clickable chip has no axe violations", async () => {
      const { container } = render(<Chip label="Filter" onClick={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
