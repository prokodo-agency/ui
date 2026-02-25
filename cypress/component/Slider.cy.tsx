import { SliderView } from "../../src/components/slider/Slider.view"

const sliderInternalProps = {
  isFocused: false,
  onFocusInternal: () => undefined,
  onBlurInternal: () => undefined,
  onChangeInternal: () => undefined,
}

describe("Slider", () => {
  it("renders with a label", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        id="volume"
        internalValue={50}
        label="Volume"
        name="volume"
      />,
    )
    cy.contains("Volume").should("be.visible")
  })

  it("renders a range input with role=slider", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        id="brightness"
        internalValue={30}
        label="Brightness"
        name="brightness"
      />,
    )
    cy.get("input[type='range']").should("exist")
  })

  it("renders aria-valuemin and aria-valuemax", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        id="slider"
        internalValue={50}
        label="Range"
        max={200}
        min={10}
        name="slider"
      />,
    )
    cy.get("input[type='range']")
      .should("have.attr", "aria-valuemin", "10")
      .and("have.attr", "aria-valuemax", "200")
  })

  it("renders aria-valuenow with current value", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        id="slider"
        internalValue={75}
        label="Progress"
        name="slider"
      />,
    )
    cy.get("input[type='range']").should("have.attr", "aria-valuenow", "75")
  })

  it("renders as disabled", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        disabled
        id="slider"
        internalValue={50}
        label="Disabled"
        name="slider"
      />,
    )
    cy.get("input[type='range']").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <SliderView
        {...sliderInternalProps}
        id="a11y-slider"
        internalValue={50}
        label="Accessibility slider"
        name="a11ySlider"
      />,
    )
    cy.checkAccessibility()
  })
})
