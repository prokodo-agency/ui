import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import PostItemServer from "./PostItem.server"

jest.mock("./PostItem.view", () => ({
  PostItemView: ({ readMinutes }: { readMinutes?: number }) => (
    <div data-read-minutes={readMinutes} data-testid="view" />
  ),
}))

jest.mock("./PostItemAuthor", () => ({
  PostItemAuthor: () => <div />,
}))

describe("PostItemServer", () => {
  it("renders with required title prop", () => {
    render(<PostItemServer title={{ content: "My Post" }} />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("calculates readMinutes=0 when wordCount is 0", () => {
    render(<PostItemServer title={{ content: "Post" }} wordCount={0} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "0")
  })

  it("calculates readMinutes from wordCount", () => {
    render(<PostItemServer title={{ content: "Post" }} wordCount={400} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "2")
  })

  it("calculates readMinutes=1 minimum from small wordCount", () => {
    render(<PostItemServer title={{ content: "Post" }} wordCount={50} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "1")
  })

  it("calculates readMinutes=0 when wordCount is undefined", () => {
    render(<PostItemServer title={{ content: "Post" }} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "0")
  })
})
