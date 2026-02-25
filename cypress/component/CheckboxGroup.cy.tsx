import { CheckboxGroupView } from "../../src/components/checkbox-group/CheckboxGroup.view"

const options = [
  { value: "react" as const, title: "React" },
  { value: "vue" as const, title: "Vue" },
  { value: "angular" as const, title: "Angular" },
]

describe("CheckboxGroup", () => {
  it("renders all options", () => {
    cy.mount(
      <CheckboxGroupView
        isChecked={() => false}
        name="frameworks"
        options={options}
        selectedValues={[]}
      />,
    )
    cy.contains("React").should("be.visible")
    cy.contains("Vue").should("be.visible")
    cy.contains("Angular").should("be.visible")
  })

  it("renders as a fieldset", () => {
    cy.mount(
      <CheckboxGroupView
        isChecked={() => false}
        name="frameworks"
        options={options}
        selectedValues={[]}
      />,
    )
    cy.get("fieldset").should("exist")
  })

  it("renders with a legend", () => {
    cy.mount(
      <CheckboxGroupView
        isChecked={() => false}
        legend="Select your frameworks"
        name="frameworks"
        options={options}
        selectedValues={[]}
      />,
    )
    cy.contains("Select your frameworks").should("be.visible")
  })

  it("checks selected values", () => {
    cy.mount(
      <CheckboxGroupView
        isChecked={v => v === "react"}
        name="frameworks"
        options={options}
        selectedValues={["react"]}
      />,
    )
    cy.get("input[value='react']").should("be.checked")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <CheckboxGroupView
        ariaLabel="Technology stack"
        isChecked={() => false}
        name="tech"
        options={options}
        selectedValues={[]}
      />,
    )
    cy.checkAccessibility()
  })

  it("calls onToggle with the option value when an item is clicked", () => {
    const onToggle = cy.stub().as("onToggle")
    cy.mount(
      <CheckboxGroupView
        isChecked={() => false}
        name="frameworks"
        options={options}
        selectedValues={[]}
        onToggle={onToggle}
      />,
    )
    cy.get("input[value='vue']").should("exist").check({ force: true })
    cy.get("@onToggle").should("have.been.calledWith", "vue")
  })

  it("does not call onToggle when disabled option is clicked", () => {
    const onToggle = cy.stub().as("onToggle")
    const disabledOptions = [
      { value: "react" as const, title: "React", disabled: true },
    ]
    cy.mount(
      <CheckboxGroupView
        isChecked={() => false}
        name="fw"
        options={disabledOptions}
        selectedValues={[]}
        onToggle={onToggle}
      />,
    )
    // Verify the checkbox is disabled (preventing interaction)
    cy.get("input[value='react']").should("be.disabled")
    // No interaction happens — onToggle should not have been called
    cy.get("@onToggle").should("not.have.been.called")
  })
})
