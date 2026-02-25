import { SwitchView } from "../../src/components/switch/Switch.view"

const switchInternalProps = {
  isChecked: false,
  isFocused: false,
  onChangeInternal: () => undefined,
  onFocusInternal: () => undefined,
  onBlurInternal: () => undefined,
}

describe("Switch", () => {
  it("renders with a label", () => {
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        label="Enable notifications"
        name="notifications"
      />,
    )
    cy.contains("Enable notifications").should("be.visible")
  })

  it("renders as unchecked by default", () => {
    cy.mount(
      <SwitchView {...switchInternalProps} label="Dark mode" name="darkMode" />,
    )
    cy.get("[role='switch']").should("have.attr", "aria-checked", "false")
  })

  it("renders as checked when isChecked=true", () => {
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        isChecked
        label="Dark mode"
        name="darkMode"
      />,
    )
    cy.get("[role='switch']").should("have.attr", "aria-checked", "true")
  })

  it("calls onChangeInternal when toggled", () => {
    const onChangeInternal = cy.stub().as("onChange")
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        label="Toggle me"
        name="toggle"
        onChangeInternal={onChangeInternal}
      />,
    )
    cy.get("[role='switch']").click()
    cy.get("@onChange").should("have.been.called")
  })

  it("renders as disabled", () => {
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        disabled
        label="Disabled switch"
        name="disabled"
      />,
    )
    cy.get("[role='switch']").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        label="Accessibility test"
        name="a11y"
      />,
    )
    cy.checkAccessibility()
  })

  it("checked switch has no accessibility violations", () => {
    cy.mount(
      <SwitchView
        {...switchInternalProps}
        isChecked
        label="Active feature"
        name="feature"
      />,
    )
    cy.checkAccessibility()
  })
})
