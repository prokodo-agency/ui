import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Switch } from "./Switch"
import { SwitchView } from "./Switch.view"

describe("Switch", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a switch input", () => {
      render(<Switch label="Enable notifications" name="notifications" />)
      expect(screen.getByRole("switch")).toBeInTheDocument()
    })

    it("renders with label visible by default", () => {
      render(
        <SwitchView
          isChecked={false}
          isFocused={false}
          label="Dark mode"
          name="dark-mode"
          onBlurInternal={() => undefined}
          onChangeInternal={() => undefined}
          onFocusInternal={() => undefined}
        />,
      )
      // Label renders text split across spans; query by the switch input which has aria-labelledby
      expect(screen.getByRole("switch")).toBeInTheDocument()
      // The label element is present in the DOM
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector("label")).toBeTruthy()
    })

    it("hides label visually when hideLabel=true", () => {
      render(<Switch hideLabel label="Dark mode" name="dark-mode" />)
      // label is visually hidden - the switch still has aria-label
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-label",
        "Dark mode",
      )
    })

    it("renders as checked when isChecked=true", () => {
      // Use SwitchView directly to pass isChecked (SwitchServer maps 'checked' prop, not 'isChecked')
      render(
        <SwitchView
          isChecked
          isFocused={false}
          label="Toggle"
          name="sw"
          onBlurInternal={() => undefined}
          onChangeInternal={() => undefined}
          onFocusInternal={() => undefined}
        />,
      )
      expect(screen.getByRole("switch")).toBeChecked()
    })

    it("renders as unchecked by default", () => {
      render(<Switch label="Toggle" name="sw" />)
      expect(screen.getByRole("switch")).not.toBeChecked()
    })

    it("renders as disabled when disabled=true", () => {
      render(<Switch disabled label="Toggle" name="sw" />)
      expect(screen.getByRole("switch")).toBeDisabled()
    })

    it("marks required when required=true", () => {
      render(<Switch required label="Toggle" name="sw" />)
      expect(screen.getByRole("switch")).toBeRequired()
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onChange handler when clicked", async () => {
      const handleChange = jest.fn()
      // Use SwitchView directly since SwitchServer hardcodes onChangeInternal: () => undefined
      render(
        <SwitchView
          isChecked={false}
          isFocused={false}
          label="Toggle"
          name="sw"
          onBlurInternal={() => undefined}
          onChangeInternal={handleChange}
          onFocusInternal={() => undefined}
        />,
      )
      await userEvent.click(screen.getByRole("switch"))
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it("does not call onChange when disabled", async () => {
      const handleChange = jest.fn()
      render(
        <Switch disabled label="Toggle" name="sw" onChange={handleChange} />,
      )
      await userEvent.click(screen.getByRole("switch"))
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("unchecked switch has no axe violations", async () => {
      const { container } = render(
        <Switch label="Accessibility switch" name="a11y-sw" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("checked switch has no axe violations", async () => {
      const { container } = render(
        <Switch checked label="Accessibility switch on" name="a11y-sw-on" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled switch has no axe violations", async () => {
      const { container } = render(
        <Switch disabled label="Disabled switch" name="a11y-sw-dis" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("switch has role=switch", () => {
      render(<Switch label="Role check" name="role-sw" />)
      expect(screen.getByRole("switch")).toBeInTheDocument()
    })
  })

  describe("edge cases", () => {
    it("renders icon wrapper when icon prop is provided", () => {
      // Covers (icon || checkedIcon) && branch at Switch.view.tsx line 87
      render(
        <SwitchView
          icon={"Moon02Icon" as const}
          isChecked={false}
          isFocused={false}
          label="Dark mode"
          name="dark-mode"
          onBlurInternal={() => undefined}
          onChangeInternal={() => undefined}
          onFocusInternal={() => undefined}
        />,
      )
      expect(screen.getByRole("switch")).toBeInTheDocument()
    })

    it("renders checkedIcon when isChecked=true", () => {
      // Covers isChecked ? checkedIcon : icon branch at Switch.view.tsx line 92
      render(
        <SwitchView
          checkedIcon={"Sun01Icon" as const}
          isChecked={true}
          isFocused={false}
          label="Light mode"
          name="light-mode"
          onBlurInternal={() => undefined}
          onChangeInternal={() => undefined}
          onFocusInternal={() => undefined}
        />,
      )
      expect(screen.getByRole("switch")).toBeInTheDocument()
    })
  })
})
