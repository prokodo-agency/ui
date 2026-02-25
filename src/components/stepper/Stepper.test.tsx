import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Stepper } from "./Stepper"
import { StepperView } from "./Stepper.view"

const defaultSteps = [
  { label: "Personal Info", key: "step-0" },
  { label: "Contact Details", key: "step-1" },
  { label: "Confirmation", key: "step-2" },
]

describe("Stepper", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders an ordered list", () => {
      render(<StepperView activeStep={0} steps={defaultSteps} />)
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("renders all step labels", () => {
      render(<StepperView activeStep={0} steps={defaultSteps} />)
      expect(screen.getByText("Personal Info")).toBeInTheDocument()
      expect(screen.getByText("Contact Details")).toBeInTheDocument()
      expect(screen.getByText("Confirmation")).toBeInTheDocument()
    })

    it("marks the active step with aria-current='step'", () => {
      render(<StepperView activeStep={1} steps={defaultSteps} />)
      const items = screen.getAllByRole("listitem")
      expect(items[1]).toHaveAttribute("aria-current", "step")
    })

    it("marks future steps as aria-disabled='true'", () => {
      render(<StepperView activeStep={1} steps={defaultSteps} />)
      const items = screen.getAllByRole("listitem")
      expect(items[2]).toHaveAttribute("aria-disabled", "true")
    })

    it("does not mark completed steps as aria-disabled", () => {
      render(<StepperView activeStep={2} steps={defaultSteps} />)
      const items = screen.getAllByRole("listitem")
      expect(items[0]).not.toHaveAttribute("aria-disabled")
    })

    it("renders with default 'Stepper Navigation' aria-label", () => {
      render(<StepperView activeStep={0} steps={defaultSteps} />)
      expect(
        screen.getByRole("list", { name: /stepper navigation/i }),
      ).toBeInTheDocument()
    })

    it("renders with custom translations", () => {
      render(
        <StepperView
          activeStep={0}
          steps={defaultSteps}
          translations={{
            stepper: "Fortschrittsanzeige",
            step: "Schritt",
            status: {
              open: "Offen",
              completed: "Erledigt",
            },
          }}
        />,
      )
      expect(
        screen.getByRole("list", { name: "Fortschrittsanzeige" }),
      ).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("stepper at first step has no axe violations", async () => {
      const { container } = render(
        <StepperView activeStep={0} steps={defaultSteps} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("stepper at middle step has no axe violations", async () => {
      const { container } = render(
        <StepperView activeStep={1} steps={defaultSteps} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("stepper at last step has no axe violations", async () => {
      const { container } = render(
        <StepperView activeStep={2} steps={defaultSteps} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Stepper island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<Stepper steps={[]} />)
  })
})

describe("StepperView steps without key property", () => {
  it("renders steps without key prop using fallback step-i key", () => {
    render(
      <StepperView
        activeStep={0}
        steps={[{ label: "Step 1" }, { label: "Step 2" }]}
      />,
    )
    expect(screen.getByText("Step 1")).toBeInTheDocument()
    expect(screen.getByText("Step 2")).toBeInTheDocument()
  })
})
