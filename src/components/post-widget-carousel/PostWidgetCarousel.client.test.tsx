import { render, screen } from "@/tests"

jest.mock("./PostWidgetCarousel.view", () => ({
  PostWidgetCarouselView: () => <div data-testid="carousel-view" />,
}))

const PostWidgetCarouselClient = require("./PostWidgetCarousel.client").default

describe("PostWidgetCarousel.client", () => {
  it("renders PostWidgetCarouselView", () => {
    render(<PostWidgetCarouselClient />)
    expect(screen.getByTestId("carousel-view")).toBeInTheDocument()
  })
})
