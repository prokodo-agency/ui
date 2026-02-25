import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import PostWidgetCarouselServer from "./PostWidgetCarousel.server"

jest.mock("./PostWidgetCarousel.view", () => ({
  PostWidgetCarouselView: (_props: Record<string, unknown>) => (
    <div data-testid="view" />
  ),
}))

describe("PostWidgetCarouselServer", () => {
  it("renders without crashing", () => {
    render(<PostWidgetCarouselServer />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
