/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Form } from "./Form"
import { FormView } from "./Form.view"

const minimalHoneypot = {
  value: "",
  readOnly: true,
}

describe("Form", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a form element", () => {
      render(
        <FormView
          formState={[]}
          honeypot={minimalHoneypot}
          id="contact"
          isFormValid={false}
          label="Contact Us"
          onFormSubmit={() => undefined}
        />,
      )
      expect(
        screen.getByRole("form", { name: /contact us/i }),
      ).toBeInTheDocument()
    })

    it("renders the aria-labelledby heading", () => {
      render(
        <FormView
          formState={[]}
          honeypot={minimalHoneypot}
          id="subscribe"
          isFormValid={false}
          label="Subscribe to newsletter"
          onFormSubmit={() => undefined}
        />,
      )
      expect(screen.getByText("Subscribe to newsletter")).toBeInTheDocument()
    })

    it("hides the heading when hideHeadline=true", () => {
      const { container } = render(
        <FormView
          hideHeadline
          formState={[]}
          honeypot={minimalHoneypot}
          id="hidden-form"
          isFormValid={false}
          label="Hidden headline"
          onFormSubmit={() => undefined}
        />,
      )
      // headline rendered but visually hidden

      expect(
        container.querySelector(".prokodo-Form__label--is-hidden"),
      ).toBeTruthy()
    })

    it("renders the submit button when button prop is provided and honeypot is empty", () => {
      render(
        <FormView
          isFormValid
          isHoneypotEmpty
          button={{ title: "Register now" }}
          formState={[]}
          honeypot={minimalHoneypot}
          id="cta-form"
          label="Register"
          onFormSubmit={() => undefined}
        />,
      )
      expect(
        screen.getByRole("button", { name: /submit form/i }),
      ).toBeInTheDocument()
    })

    it("disables the submit button when isFormValid=false", () => {
      render(
        <FormView
          isHoneypotEmpty
          button={{ title: "Submit" }}
          formState={[]}
          honeypot={minimalHoneypot}
          id="invalid-form"
          isFormValid={false}
          label="Form"
          onFormSubmit={() => undefined}
        />,
      )
      expect(
        screen.getByRole("button", { name: /submit form/i }),
      ).toBeDisabled()
    })

    it("hides the submit button when honeypot is not empty", () => {
      render(
        <FormView
          isFormValid
          button={{ title: "Submit" }}
          formState={[]}
          id="hp-form"
          isHoneypotEmpty={false}
          label="Form"
          honeypot={{
            value: "bot-filled",
            readOnly: false,
            onChange: () => {},
          }}
          onFormSubmit={() => undefined}
        />,
      )
      expect(
        screen.queryByRole("button", { name: /submit form/i }),
      ).not.toBeInTheDocument()
    })

    it("renders with noValidate attribute", () => {
      render(
        <FormView
          formState={[]}
          honeypot={minimalHoneypot}
          id="no-val-form"
          isFormValid={false}
          label="Form"
          onFormSubmit={() => undefined}
        />,
      )
      expect(screen.getByRole("form")).toHaveAttribute("novalidate")
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onFormSubmit on submit", async () => {
      const handleSubmit = jest.fn(e => e.preventDefault())
      render(
        <FormView
          isFormValid
          isHoneypotEmpty
          button={{ title: "Submit" }}
          formState={[]}
          honeypot={minimalHoneypot}
          id="submit-form"
          label="Submit test"
          onFormSubmit={handleSubmit}
        />,
      )
      await userEvent.click(
        screen.getByRole("button", { name: /submit form/i }),
      )
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("empty form has no axe violations", async () => {
      const { container } = render(
        <FormView
          formState={[]}
          honeypot={minimalHoneypot}
          id="a11y-form"
          isFormValid={false}
          label="Accessibility form"
          onFormSubmit={() => undefined}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("form with submit button has no axe violations", async () => {
      const { container } = render(
        <FormView
          isFormValid
          isHoneypotEmpty
          button={{ title: "Send message" }}
          formState={[]}
          honeypot={minimalHoneypot}
          id="a11y-form-btn"
          label="Contact form"
          onFormSubmit={() => undefined}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Form island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<Form label="Test" />)
  })
})

describe("FormView – comprehensive prop branch coverage", () => {
  const sampleField = {
    fieldType: "input" as const,
    name: "email",
    label: "Email",
    visible: true,
  }

  it("renders with action as string (onSubmit = undefined, line 63)", () => {
    const { container } = render(
      <FormView
        action="https://example.com/submit"
        formState={[]}
        honeypot={minimalHoneypot}
        id="action-form"
        isFormValid={false}
        label="Action Form"
        onFormSubmit={() => undefined}
      />,
    )
    // form should not have onSubmit when action is string
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("renders with action as function (onSubmit = undefined, line 63)", () => {
    const { container } = render(
      <FormView
        action={async (_fd: FormData): Promise<void> => {}}
        formState={[]}
        honeypot={minimalHoneypot}
        id="fn-action-form"
        isFormValid={false}
        label="Fn Action Form"
        onFormSubmit={() => undefined}
      />,
    )
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("renders formState fields with explicit disabled prop (lines 86-94, 90)", () => {
    render(
      <FormView
        disabled
        formState={[sampleField] as never}
        honeypot={minimalHoneypot}
        id="disabled-form"
        isFormValid={false}
        label="Disabled Form"
        onFormSubmit={() => undefined}
      />,
    )
    expect(screen.getByRole("form")).toBeInTheDocument()
  })

  it("renders formState fields without explicit disabled (field.disabled branch)", () => {
    render(
      <FormView
        formState={[sampleField] as never}
        honeypot={minimalHoneypot}
        id="nodisabled-form"
        isFormValid={false}
        label="No Disabled Form"
        onFormSubmit={() => undefined}
      />,
    )
    expect(screen.getByRole("form")).toBeInTheDocument()
  })

  it("renders FormResponse when hideResponse=true and formMessages provided (line 116)", () => {
    render(
      <FormView
        hideResponse
        formState={[]}
        honeypot={minimalHoneypot}
        id="response-form"
        isFormValid={false}
        label="Response Form"
        formMessages={{
          message: "Success!",
          errors: { email: ["Email required"] },
        }}
        onFormSubmit={() => undefined}
      />,
    )
    expect(screen.getByText("Success!")).toBeInTheDocument()
  })

  it("renders with headlineProps.className set (line 77 branch)", () => {
    render(
      <FormView
        formState={[]}
        headlineProps={{ className: "custom-headline-class" }}
        honeypot={minimalHoneypot}
        id="headline-form"
        isFormValid={false}
        label="Headline Form"
        onFormSubmit={() => undefined}
      />,
    )
    expect(screen.getByRole("form")).toBeInTheDocument()
  })
})
