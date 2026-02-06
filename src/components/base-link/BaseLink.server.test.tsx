import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import BaseLinkServer from "./BaseLink.server"

describe("BaseLinkServer", () => {
  it("should render with basic props", () => {
    render(<BaseLinkServer href="/">Home</BaseLinkServer>)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/")
    expect(link).toHaveTextContent("Home")
  })

  it("should render with external URL", () => {
    render(<BaseLinkServer href="https://example.com">External</BaseLinkServer>)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("should render with disabled state", () => {
    render(
      <BaseLinkServer disabled href="/">
        Disabled
      </BaseLinkServer>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("tabindex", "-1")
  })

  it("should render with custom className", () => {
    render(
      <BaseLinkServer className="custom-class" href="/">
        Link
      </BaseLinkServer>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveClass("custom-class")
  })

  it("should render with children nodes", () => {
    render(
      <BaseLinkServer href="/">
        <span>Icon</span>
        <span>Text</span>
      </BaseLinkServer>,
    )

    expect(screen.getByText("Icon")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
  })

  it("should pass through all props to view component", () => {
    render(
      <BaseLinkServer
        aria-label="Test Link"
        href="/page"
        id="my-link"
        title="Test Title"
      >
        Link
      </BaseLinkServer>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("id", "my-link")
    expect(link).toHaveAttribute("title", "Test Title")
  })
})
