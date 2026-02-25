import { expect } from "@jest/globals"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Button } from "./Button"

describe("Button", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with a title", () => {
      render(<Button title="Click me" />)
      expect(
        screen.getByRole("button", { name: /click me/i }),
      ).toBeInTheDocument()
    })

    it("renders as disabled when disabled=true", () => {
      render(<Button disabled title="Disabled" />)
      expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled()
    })

    it("renders with loading prop without throwing", () => {
      render(<Button loading title="Loading" />)
      expect(
        screen.getByRole("button", { name: /loading/i }),
      ).toBeInTheDocument()
    })

    it("renders contained variant by default", () => {
      render(<Button title="Contained" />)
      expect(
        screen.getByRole("button", { name: /contained/i }),
      ).toBeInTheDocument()
    })

    it("renders outlined variant", () => {
      render(<Button title="Outlined" variant="outlined" />)
      expect(
        screen.getByRole("button", { name: /outlined/i }),
      ).toBeInTheDocument()
    })

    it("renders text variant", () => {
      render(<Button title="Text" variant="text" />)
      expect(screen.getByRole("button", { name: /text/i })).toBeInTheDocument()
    })

    it("renders all color variants without error", () => {
      const colors = [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "inherit",
      ] as const
      colors.forEach(color => {
        const { unmount } = render(<Button color={color} title={color} />)
        expect(screen.getByRole("button", { name: color })).toBeInTheDocument()
        unmount()
      })
    })

    it("renders fullWidth button", () => {
      render(<Button fullWidth title="Full" />)
      expect(screen.getByRole("button", { name: /full/i })).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = jest.fn()
      render(<Button title="Click" onClick={handleClick} />)
      await userEvent.click(screen.getByRole("button", { name: /click/i }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("does not call onClick when disabled", async () => {
      const handleClick = jest.fn()
      render(<Button disabled title="No click" onClick={handleClick} />)
      await userEvent.click(screen.getByRole("button", { name: /no click/i }))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it("is keyboard accessible via Enter key", async () => {
      const handleClick = jest.fn()
      render(<Button title="Enter" onClick={handleClick} />)
      screen.getByRole("button", { name: /enter/i }).focus()
      await userEvent.keyboard("{Enter}")
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("is keyboard accessible via Space key", async () => {
      const handleClick = jest.fn()
      render(<Button title="Space" onClick={handleClick} />)
      screen.getByRole("button", { name: /space/i }).focus()
      await userEvent.keyboard(" ")
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("default button has no axe violations", async () => {
      const { container } = render(<Button title="Accessible button" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled button has no axe violations", async () => {
      const { container } = render(<Button disabled title="Disabled button" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("loading button has no axe violations", async () => {
      const { container } = render(<Button loading title="Loading button" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("outlined variant has no axe violations", async () => {
      const { container } = render(
        <Button title="Outlined" variant="outlined" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("icon-only button with aria-label has no axe violations", async () => {
      const { container } = render(
        <Button
          aria-label="Close dialog"
          iconProps={{ name: "Cancel01Icon" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("button has accessible name via title", () => {
      render(<Button title="Save" />)
      expect(screen.getByRole("button")).toHaveAccessibleName()
    })
  })
})
