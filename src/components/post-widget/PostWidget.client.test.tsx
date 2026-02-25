import { render, screen } from "@/tests"

jest.mock("./PostWidget.view", () => ({
  PostWidgetView: () => <div data-testid="post-widget-view" />,
}))

const PostWidgetClient = require("./PostWidget.client").default

describe("PostWidget.client", () => {
  it("renders PostWidgetView", () => {
    render(<PostWidgetClient />)
    expect(screen.getByTestId("post-widget-view")).toBeInTheDocument()
  })
})
