jest.mock("./iconsMap", () => {
  const mkSvg = (label: string) =>
    function Svg(props: any) {
      return (
        <svg aria-hidden={props["aria-hidden"]} role={props.role} {...props}>
          <text>{label}</text>
        </svg>
      )
    }

  return {
    ICONS: {
      abacus_icon: () => Promise.resolve(mkSvg("abacus")),
      absolute_icon: () => Promise.resolve(mkSvg("absolute")),
      access_icon: () => Promise.resolve(mkSvg("access")),
    },
  }
})

import { render, screen } from "@/tests"

import { Icon } from "./Icon"

describe("The common icon component", () => {
  it("should render a svg icon", async () => {
    render(<Icon name="AbacusIcon" />)

    const svg = await screen.findByRole("presentation")
    expect(svg).toBeInTheDocument()
  })

  it("should render with default accessibility attributes", async () => {
    render(<Icon name="AbsoluteIcon" />)

    const svg = await screen.findByRole("presentation", { hidden: true })
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("should allow to overwrite accessibility attributes", async () => {
    render(<Icon aria-hidden="false" name="AccessIcon" role="alert" />)

    const svg = await screen.findByRole("alert")
    expect(svg).toHaveAttribute("role", "alert")
    expect(svg).toHaveAttribute("aria-hidden", "false")
  })
})
