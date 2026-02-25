import { render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-read-minutes={String(props.readMinutes ?? "")}
    data-testid="post-item-view"
  />
))

jest.mock("./PostItem.view", () => ({ PostItemView: mockView }))

const PostItemClient = require("./PostItem.client").default

beforeEach(() => mockView.mockClear())

describe("PostItem.client", () => {
  describe("readMinutes computation", () => {
    it("returns 0 when wordCount is undefined", () => {
      render(<PostItemClient title={{ content: "Test" }} />)
      expect(screen.getByTestId("post-item-view")).toHaveAttribute(
        "data-read-minutes",
        "0",
      )
    })

    it("returns 0 when wordCount is 0", () => {
      render(<PostItemClient title={{ content: "Test" }} wordCount={0} />)
      expect(screen.getByTestId("post-item-view")).toHaveAttribute(
        "data-read-minutes",
        "0",
      )
    })

    it("computes ceiling of wordCount / readingWpm", () => {
      // 500 words / 200 wpm = 2.5 → ceil → 3
      render(
        <PostItemClient
          readingWpm={200}
          title={{ content: "Test" }}
          wordCount={500}
        />,
      )
      expect(screen.getByTestId("post-item-view")).toHaveAttribute(
        "data-read-minutes",
        "3",
      )
    })

    it("returns minimum of 1 for very short reads", () => {
      // 10 words / 200 wpm = 0.05 → ceil → 1 minimum
      render(
        <PostItemClient
          readingWpm={200}
          title={{ content: "Test" }}
          wordCount={10}
        />,
      )
      expect(screen.getByTestId("post-item-view")).toHaveAttribute(
        "data-read-minutes",
        "1",
      )
    })

    it("uses default readingWpm of 200 when not provided", () => {
      // 400 words / 200 wpm = 2 min
      render(<PostItemClient title={{ content: "Test" }} wordCount={400} />)
      expect(screen.getByTestId("post-item-view")).toHaveAttribute(
        "data-read-minutes",
        "2",
      )
    })
  })
})
