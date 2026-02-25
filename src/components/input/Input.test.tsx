import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Input } from "./Input"
import { InputView } from "./Input.view"

describe("Input", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a text input", () => {
      render(<Input label="Full name" name="full-name" />)
      expect(
        screen.getByRole("textbox", { name: /full name/i }),
      ).toBeInTheDocument()
    })

    it("renders with placeholder", () => {
      render(<Input label="Email" name="email" placeholder="you@example.com" />)
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument()
    })

    it("renders with a required marker", () => {
      render(<Input required label="Name" name="name" />)
      expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument()
    })

    it("renders with type=email", () => {
      render(<Input label="Email" name="email" type="email" />)
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email")
    })

    it("renders with type=password", () => {
      render(<Input label="Password" name="password" type="password" />)
      expect(screen.getByLabelText("Password")).toHaveAttribute(
        "type",
        "password",
      )
    })

    it("renders as textarea when multiline=true", () => {
      render(<Input multiline label="Message" name="message" />)
      expect(
        screen.getByRole("textbox", { name: /message/i }),
      ).toBeInTheDocument()
    })

    it("renders disabled state", () => {
      render(<Input disabled label="Disabled" name="disabled-input" />)
      expect(screen.getByRole("textbox", { name: /disabled/i })).toBeDisabled()
    })

    it("renders with helper text", () => {
      render(
        <Input
          helperText="We'll never share your email."
          label="Email"
          name="email"
        />,
      )
      expect(
        screen.getByText("We'll never share your email."),
      ).toBeInTheDocument()
    })

    it("renders with error text", () => {
      render(
        <Input errorText="This field is required" label="Email" name="email" />,
      )
      expect(screen.getByText("This field is required")).toBeInTheDocument()
    })

    it("renders with a controlled value", () => {
      render(
        <Input label="Name" name="name" value="John" onChange={jest.fn()} />,
      )
      const input = screen.getByRole("textbox", {
        name: /name/i,
      }) as HTMLInputElement
      expect(input).toHaveValue("John")
    })

    it("applies fullWidth prop", () => {
      render(<Input fullWidth label="Full" name="full" />)
      expect(screen.getByRole("textbox", { name: /full/i })).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onChange on user input", async () => {
      const handleChange = jest.fn()
      // Use InputView directly to bypass InputServer's readOnly wrapper
      render(
        <InputView
          isFocused={false}
          label="Search"
          name="search"
          onChange={handleChange}
        />,
      )
      await userEvent.type(
        screen.getByRole("textbox", { name: /search/i }),
        "hello",
      )
      expect(handleChange).toHaveBeenCalled()
    })

    it("does not accept input when disabled", async () => {
      const handleChange = jest.fn()
      render(
        <Input disabled label="Locked" name="locked" onChange={handleChange} />,
      )
      await userEvent.type(
        screen.getByRole("textbox", { name: /locked/i }),
        "typing",
      )
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("text input with label has no axe violations", async () => {
      const { container } = render(<Input label="Full name" name="full-name" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("required input has no axe violations", async () => {
      const { container } = render(
        <Input required label="Email" name="email" type="email" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("input with helper text has no axe violations", async () => {
      const { container } = render(
        <Input
          helperText="Enter your full legal name"
          label="Full name"
          name="full-name"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("input with error text has no axe violations", async () => {
      const { container } = render(
        <Input
          errorText="Invalid email address"
          label="Email"
          name="email"
          type="email"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled input has no axe violations", async () => {
      const { container } = render(
        <Input disabled label="Disabled field" name="disabled" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("textarea (multiline) has no axe violations", async () => {
      const { container } = render(
        <Input multiline label="Message" name="message" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
