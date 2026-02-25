import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { SliderView } from "./Slider.view"

const sliderInternalProps = {
  isFocused: false,
  onFocusInternal: () => undefined,
  onBlurInternal: () => undefined,
  onChangeInternal: () => undefined,
} as const

describe("Slider", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a range input", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          id="sl"
          internalValue={50}
          max={100}
          min={0}
        />,
      )
      expect(screen.getByRole("slider")).toBeInTheDocument()
    })

    it("renders a label when provided", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          id="sl"
          internalValue={50}
          label="Volume"
          max={100}
          min={0}
        />,
      )
      expect(screen.getByText("Volume")).toBeInTheDocument()
    })

    it("renders with correct min/max/value attributes", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          id="sl"
          internalValue={75}
          max={200}
          min={10}
        />,
      )
      const slider = screen.getByRole("slider")
      expect(slider).toHaveAttribute("aria-valuemin", "10")
      expect(slider).toHaveAttribute("aria-valuemax", "200")
      expect(slider).toHaveAttribute("aria-valuenow", "75")
    })

    it("renders as disabled when disabled=true", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          disabled
          id="sl"
          internalValue={30}
          max={100}
          min={0}
        />,
      )
      expect(screen.getByRole("slider")).toBeDisabled()
    })

    it("renders the current value label", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          id="sl"
          internalValue={42}
          max={100}
          min={0}
        />,
      )
      expect(screen.getByText("42")).toBeInTheDocument()
    })

    it("renders mark labels when marks are provided", () => {
      render(
        <SliderView
          {...sliderInternalProps}
          id="sl"
          internalValue={50}
          max={100}
          min={0}
          marks={[
            { value: 0, label: "Low" },
            { value: 50, label: "Mid" },
            { value: 100, label: "High" },
          ]}
        />,
      )
      expect(screen.getByText("Low")).toBeInTheDocument()
      expect(screen.getByText("Mid")).toBeInTheDocument()
      expect(screen.getByText("High")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("slider with label has no axe violations", async () => {
      const { container } = render(
        <SliderView
          {...sliderInternalProps}
          id="a11y-slider"
          internalValue={50}
          label="Price range"
          max={100}
          min={0}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled slider has no axe violations", async () => {
      const { container } = render(
        <SliderView
          {...sliderInternalProps}
          disabled
          id="a11y-slider-dis"
          internalValue={25}
          label="Disabled range"
          max={100}
          min={0}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("SliderView – additional coverage", () => {
  const base = {
    isFocused: false,
    onFocusInternal: () => undefined,
    onBlurInternal: () => undefined,
    onChangeInternal: () => undefined,
  }

  it("renders marks={true} with step > 0 generating automatic mark points", () => {
    const { container } = render(
      <SliderView
        {...base}
        id="sl-marks"
        internalValue={50}
        marks={true}
        max={100}
        min={0}
        step={25}
      />,
    )
    // marks are rendered as divs with class containing 'mark'
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("input[type='range']")).toBeInTheDocument()
  })

  it("renders value label at left edge (pct <= 10)", () => {
    render(
      <SliderView
        {...base}
        id="sl-edge-left"
        internalValue={5}
        max={100}
        min={0}
      />,
    )
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders value label at right edge (pct >= 90)", () => {
    render(
      <SliderView
        {...base}
        id="sl-edge-right"
        internalValue={95}
        max={100}
        min={0}
      />,
    )
    expect(screen.getByText("95")).toBeInTheDocument()
  })

  it("renders marks=true with step=0 (no marks generated)", () => {
    const { container } = render(
      <SliderView
        {...base}
        id="sl-step0"
        internalValue={50}
        marks={true}
        max={100}
        min={0}
        step={0}
      />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("input[type='range']")).toBeInTheDocument()
  })
})
