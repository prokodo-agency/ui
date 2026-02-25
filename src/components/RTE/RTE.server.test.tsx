import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import RTEServer from "./RTE.server"

jest.mock("./RTE.view", () => ({
  RTEView: ({ value, readOnly }: { value?: string; readOnly?: boolean }) => (
    <div
      data-readonly={String(readOnly)}
      data-testid="rte-view"
      data-value={value}
    />
  ),
}))

describe("RTEServer", () => {
  it("renders without crashing with no props", () => {
    render(<RTEServer name="rte" />)
    expect(screen.getByTestId("rte-view")).toBeInTheDocument()
  })

  it("strips angle-bracket characters from value", () => {
    render(<RTEServer name="rte" value="<p>Hello <b>world</b></p>" />)
    const view = screen.getByTestId("rte-view")
    // stripHtml replaces < and > chars individually, leaving tag names
    expect(view).toHaveAttribute("data-value", "pHello bworld/b/p")
  })

  it("sets readOnly to true", () => {
    render(<RTEServer name="rte" value="test" />)
    expect(screen.getByTestId("rte-view")).toHaveAttribute(
      "data-readonly",
      "true",
    )
  })
})
