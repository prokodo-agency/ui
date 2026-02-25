import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import TooltipServer from "./Tooltip.server"

jest.mock("./Tooltip.view", () => ({
  TooltipView: ({
    __renderVisualBubble,
  }: {
    __renderVisualBubble?: boolean
  }) => <div data-bubble={String(__renderVisualBubble)} data-testid="view" />,
}))

describe("TooltipServer", () => {
  it("renders with required content and children", () => {
    render(
      <TooltipServer content="Tooltip text">
        <button>Hover me</button>
      </TooltipServer>,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("sets __renderVisualBubble=false when portal=true (default)", () => {
    render(
      <TooltipServer content="Tip">
        <button>btn</button>
      </TooltipServer>,
    )
    expect(screen.getByTestId("view")).toHaveAttribute("data-bubble", "false")
  })

  it("sets __renderVisualBubble=true when portal=false", () => {
    render(
      <TooltipServer content="Tip" portal={false}>
        <button>btn</button>
      </TooltipServer>,
    )
    expect(screen.getByTestId("view")).toHaveAttribute("data-bubble", "true")
  })
})
