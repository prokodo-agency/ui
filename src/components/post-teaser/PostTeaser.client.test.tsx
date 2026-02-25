/* eslint-disable jsx-a11y/no-static-element-interactions */
import { fireEvent, render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-is-hovered={String(props.isHovered ?? "")}
    data-read-minutes={String(props.readMinutes ?? "")}
    data-testid="post-teaser-view"
    onMouseEnter={props.onMouseEnter as () => void}
    onMouseLeave={props.onMouseLeave as () => void}
  />
))

jest.mock("./PostTeaser.view", () => ({ PostTeaserView: mockView }))

const PostTeaserClient = require("./PostTeaser.client").default

beforeEach(() => mockView.mockClear())

describe("PostTeaser.client", () => {
  describe("readMinutes computation", () => {
    it("returns 0 when readCount is undefined", () => {
      render(<PostTeaserClient title={{ content: "Test" }} />)
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-read-minutes",
        "0",
      )
    })

    it("returns 0 when readCount is 0", () => {
      render(<PostTeaserClient readCount={0} title={{ content: "Test" }} />)
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-read-minutes",
        "0",
      )
    })

    it("computes readMinutes from readCount / readingWpm", () => {
      // 500 / 200 = 2.5 → ceil → 3
      render(
        <PostTeaserClient
          readCount={500}
          readingWpm={200}
          title={{ content: "Test" }}
        />,
      )
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-read-minutes",
        "3",
      )
    })

    it("enforces minimum of 1 minute", () => {
      render(
        <PostTeaserClient
          readCount={10}
          readingWpm={200}
          title={{ content: "Test" }}
        />,
      )
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-read-minutes",
        "1",
      )
    })
  })

  describe("hover state", () => {
    it("starts as not hovered", () => {
      render(<PostTeaserClient title={{ content: "Test" }} />)
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-is-hovered",
        "false",
      )
    })

    it("sets isHovered=true on mouse enter", () => {
      render(<PostTeaserClient title={{ content: "Test" }} />)
      fireEvent.mouseEnter(screen.getByTestId("post-teaser-view"))
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-is-hovered",
        "true",
      )
    })

    it("sets isHovered=false on mouse leave", () => {
      render(<PostTeaserClient title={{ content: "Test" }} />)
      fireEvent.mouseEnter(screen.getByTestId("post-teaser-view"))
      fireEvent.mouseLeave(screen.getByTestId("post-teaser-view"))
      expect(screen.getByTestId("post-teaser-view")).toHaveAttribute(
        "data-is-hovered",
        "false",
      )
    })
  })
})
