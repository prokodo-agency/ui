import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import CardServer from "./Card.server"

jest.mock("./Card.view", () => ({
  CardView: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="view">{children}</div>
  ),
}))

describe("CardServer", () => {
  it("renders with children", () => {
    render(
      <CardServer>
        <span>content</span>
      </CardServer>,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
    expect(screen.getByText("content")).toBeInTheDocument()
  })
})
