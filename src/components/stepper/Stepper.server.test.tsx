import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import StepperServer from "./Stepper.server"

jest.mock("./Stepper.view", () => ({
  StepperView: ({ activeStep }: { activeStep?: number }) => (
    <div data-active-step={activeStep} data-testid="view" />
  ),
}))

describe("StepperServer", () => {
  it("renders with required steps", () => {
    render(<StepperServer steps={[{ label: "Step 1" }, { label: "Step 2" }]} />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("defaults activeStep to 0", () => {
    render(<StepperServer steps={[{ label: "Step 1" }]} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-active-step", "0")
  })

  it("uses initialStep when provided", () => {
    render(
      <StepperServer
        initialStep={1}
        steps={[{ label: "Step 1" }, { label: "Step 2" }]}
      />,
    )
    expect(screen.getByTestId("view")).toHaveAttribute("data-active-step", "1")
  })
})
