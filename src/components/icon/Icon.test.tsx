import { expect } from "@jest/globals"

import { render, screen } from "@/tests"

import { Icon } from "./Icon"

import type { FC, SVGProps } from "react"

jest.mock("@/assets/icons/tire.svg", () => {
  const svg = "<svg><text>tire icon</text></svg>"
  const ReactComponent: FC<SVGProps<SVGSVGElement>> = props => (
    <svg {...props}>
      <text>tire icon</text>
    </svg>
  )

  return {
    default: svg,
    ReactComponent,
  }
})

describe("The common icon component", () => {
  it("should render a svg icon", () => {
    render(<Icon name="AbacusIcon" />)
    const svgIcon = screen.getByRole("img") // Assuming the svg has the role "img"
    expect(svgIcon).toMatchSnapshot()
  })

  it("should render with default accessibility attributes", () => {
    render(<Icon name="AbsoluteIcon" />)
    const svgIcon = screen.getByRole("img", { hidden: true }) // For hidden elements
    expect(svgIcon).toHaveAttribute("role", "presentation")
    expect(svgIcon).toHaveAttribute("aria-hidden", "true")
  })

  it("should allow to overwrite accessibility attributes", () => {
    render(<Icon aria-hidden="false" name="AccessIcon" role="alert" />)
    const svgIcon = screen.getByRole("alert") // Now querying by the role set to "alert"
    expect(svgIcon).toHaveAttribute("role", "alert")
    expect(svgIcon).toHaveAttribute("aria-hidden", "false")
  })
})
