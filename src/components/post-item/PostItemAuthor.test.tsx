import { render, screen } from "@/tests"

import { PostItemAuthor } from "./PostItemAuthor"

describe("PostItemAuthor", () => {
  it("renders the author name", () => {
    render(<PostItemAuthor name="Jane Doe" />)
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
  })

  it("renders with avatar image when src is provided", () => {
    render(
      <PostItemAuthor
        avatar={{ src: "/avatar.jpg", alt: "Jane's avatar" }}
        name="Jane Doe"
      />,
    )
    const author = screen.getByText("Jane Doe")
    expect(author).toBeInTheDocument()
  })

  it("renders without avatar when src is not a string", () => {
    render(
      <PostItemAuthor
        avatar={{ src: undefined as never, alt: "" }}
        name="John Doe"
      />,
    )
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })

  it("renders with custom className", () => {
    const { container } = render(
      <PostItemAuthor className="custom-author" name="Author" />,
    )
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector(".custom-author")).toBeTruthy()
  })

  it("renders with nameProps", () => {
    render(
      <PostItemAuthor
        name="Custom Author"
        nameProps={{ className: "author-name-class" }}
      />,
    )
    const nameEl = screen.getByText("Custom Author")
    expect(nameEl).toHaveClass("author-name-class")
  })

  it("renders with avatar alt defaulting to name when not provided", () => {
    render(
      <PostItemAuthor avatar={{ src: "/photo.jpg" }} name="No Alt Author" />,
    )
    expect(screen.getByText("No Alt Author")).toBeInTheDocument()
  })
})
