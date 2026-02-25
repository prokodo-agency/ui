import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import CarouselServer from "./Carousel.server"

jest.mock("./Carousel.view", () => ({
  CarouselView: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="view">{children}</div>
  ),
}))

describe("CarouselServer", () => {
  it("renders with children", () => {
    render(
      <CarouselServer>
        <div>Slide</div>
      </CarouselServer>,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
