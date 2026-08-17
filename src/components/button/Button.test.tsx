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
      expect(screen.getByText("Click me").className).toMatch(/Button__label/)
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

    it("renders loading spinner inside button when loading=true", () => {
      render(<Button loading title="Save" />)
      // Spinner SVG is rendered inside the button
      expect(screen.getByRole("status")).toBeInTheDocument()
      // Title text is STILL visible alongside the spinner (button keeps its width)
      expect(screen.getByText("Save")).toBeInTheDocument()
    })

    it("renders title when loading=false", () => {
      render(<Button loading={false} title="Save" />)
      expect(screen.getByText("Save")).toBeInTheDocument()
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })

    it("applies is-loading CSS modifier when loading=true", () => {
      render(<Button loading title="Save" />)
      const btn = screen.getByRole("button")
      expect(btn.className).toMatch(/is-loading/)
      expect(btn).toHaveAttribute("aria-busy", "true")
    })

    it("applies opacity style via is-disabled class when disabled=true", () => {
      render(<Button disabled title="Disabled" />)
      const btn = screen.getByRole("button")
      expect(btn.className).toMatch(/is-disabled/)
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

    it("renders every color and visual variant with the expected modifiers", () => {
      const colors = [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "inherit",
      ] as const
      const variants = ["contained", "outlined", "text"] as const

      variants.forEach(variant => {
        colors.forEach(color => {
          const label = `${variant}-${color}`
          const { unmount } = render(
            <Button color={color} title={label} variant={variant} />,
          )
          const button = screen.getByRole("button", { name: label })

          expect(button.className).toMatch(new RegExp(`has-variant-${variant}`))
          expect(button.className).toMatch(
            variant === "contained"
              ? new RegExp(`has-bg-${color}`)
              : variant === "outlined"
                ? new RegExp(`has-outline-${color}`)
                : new RegExp(`has-text-${color}`),
          )
          unmount()
        })
      })
    })

    it("styles icon-only buttons across every visual variant", () => {
      const variants = ["contained", "outlined", "text"] as const

      variants.forEach(variant => {
        const label = `${variant} icon`
        const { unmount } = render(
          <Button
            aria-label={label}
            color="primary"
            iconProps={{ name: "ArrowRight01Icon" }}
            variant={variant}
          />,
        )
        const button = screen.getByRole("button", { name: label })

        expect(button.className).toMatch(/icon-only/)
        expect(
          screen.getByRole("presentation", { hidden: true }),
        ).toBeInTheDocument()
        unmount()
      })
    })

    it("supports placing an existing icon after the label", () => {
      render(
        <Button
          iconPosition="end"
          iconProps={{ name: "ArrowRight01Icon" }}
          title="Continue"
        />,
      )

      expect(
        screen.getByRole("button", { name: /continue/i }).className,
      ).toMatch(/has-icon-end/)
    })

    it("keeps redirect buttons on the same root and content structure", () => {
      render(
        <Button
          color="primary"
          iconProps={{ name: "ArrowRight01Icon" }}
          redirect={{ href: "/next", target: "_self" }}
          title="Continue"
          variant="contained"
        />,
      )

      const link = screen.getByRole("link", { name: /continue/i })
      expect(link.className).toMatch(/Button/)
      expect(link.className).toMatch(/has-variant-contained/)
      expect(link.className).toMatch(/has-bg-primary/)
      expect(link).toHaveAttribute("href", "/next")
      expect(link).toHaveAttribute("target", "_self")
      expect(screen.getByText("Continue").className).toMatch(/Button__label/)
    })

    it("preserves the accessible name for redirected icon-only buttons", () => {
      render(
        <Button
          aria-label="Open details"
          iconProps={{ name: "ArrowRight01Icon" }}
          redirect={{ href: "/details" }}
        />,
      )

      expect(
        screen.getByRole("link", { name: "Open details" }),
      ).toBeInTheDocument()
    })

    it("removes disabled redirect buttons from the tab order", () => {
      render(
        <Button
          disabled
          redirect={{ href: "/checkout", tabIndex: 2 }}
          title="Checkout"
        />,
      )

      const link = screen.getByRole("link", { name: "Checkout" })
      expect(link).toHaveAttribute("aria-disabled", "true")
      expect(link).toHaveAttribute("tabindex", "-1")
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
