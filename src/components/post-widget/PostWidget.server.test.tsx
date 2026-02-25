import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import PostWidgetServer from "./PostWidget.server"

jest.mock("./PostWidget.view", () => ({
  PostWidgetView: (_props: Record<string, unknown>) => (
    <div data-testid="view" />
  ),
}))

describe("PostWidgetServer", () => {
  it("renders without crashing", () => {
    render(<PostWidgetServer />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
