import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import PostTeaserServer from "./PostTeaser.server"

jest.mock("./PostTeaser.view", () => ({
  PostTeaserView: ({
    readMinutes,
    isHovered,
  }: {
    readMinutes?: number
    isHovered?: boolean
  }) => (
    <div
      data-is-hovered={String(isHovered)}
      data-read-minutes={readMinutes}
      data-testid="view"
    />
  ),
}))

describe("PostTeaserServer", () => {
  it("renders with required title prop", () => {
    render(<PostTeaserServer title={{ content: "My Teaser" }} />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("sets isHovered=false", () => {
    render(<PostTeaserServer title={{ content: "Teaser" }} />)
    expect(screen.getByTestId("view")).toHaveAttribute(
      "data-is-hovered",
      "false",
    )
  })

  it("calculates readMinutes from wordCount", () => {
    render(<PostTeaserServer title={{ content: "Teaser" }} wordCount={200} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "1")
  })

  it("returns readMinutes=0 when wordCount is 0", () => {
    render(<PostTeaserServer title={{ content: "Teaser" }} wordCount={0} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-read-minutes", "0")
  })
})
