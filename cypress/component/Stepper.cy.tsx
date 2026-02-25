import { StepperView } from "../../src/components/stepper/Stepper.view"
import StepperClient from "../../src/components/stepper/Stepper.client"

const steps = [
  { label: "Account" },
  { label: "Personal Info" },
  { label: "Confirmation" },
]

describe("Stepper", () => {
  it("renders all step labels", () => {
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.contains("Account").should("be.visible")
    cy.contains("Personal Info").should("be.visible")
    cy.contains("Confirmation").should("be.visible")
  })

  it("renders an ordered list", () => {
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.get("ol").should("exist")
  })

  it("has aria-label on the step list", () => {
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.get("ol").should("have.attr", "aria-label")
  })

  it("marks the active step with aria-current=step", () => {
    cy.mount(<StepperView activeStep={1} steps={steps} />)
    cy.get("[aria-current='step']").should("exist")
  })

  it("marks future steps as disabled", () => {
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.get("[aria-disabled='true']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.checkAccessibility()
  })

  it("mid-step has no accessibility violations", () => {
    cy.mount(<StepperView activeStep={1} steps={steps} />)
    cy.checkAccessibility()
  })

  it("completed step does not have aria-disabled", () => {
    // With activeStep=2, steps 0 and 1 are completed
    cy.mount(<StepperView activeStep={2} steps={steps} />)
    // The first step (index 0) is completed, should NOT have aria-disabled
    cy.get("li").first().should("not.have.attr", "aria-disabled", "true")
  })

  it("future step has aria-disabled=true", () => {
    // With activeStep=0, steps 1 and 2 are future
    cy.mount(<StepperView activeStep={0} steps={steps} />)
    cy.get("li").eq(1).should("have.attr", "aria-disabled", "true")
  })

  it("clicking a completed step fires onChange", () => {
    const onChange = cy.stub().as("onChange")
    // Use StepperClient directly to avoid island lazy-loading race condition
    cy.mount(
      <StepperClient steps={steps} initialStep={2} onChange={onChange} />,
    )
    // Step 0 is completed (activeStep=2 > 0), clicking it should fire onChange
    cy.get("[role='button']").first().click()
    cy.get("@onChange").should("have.been.called")
  })

  it("completed steps stepper has no accessibility violations", () => {
    cy.mount(<StepperView activeStep={2} steps={steps} />)
    cy.checkAccessibility()
  })
})
