import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import BaseLinkClient from "./BaseLink.client"

describe("BaseLinkClient", () => {
  it("should render link with href", () => {
    render(<BaseLinkClient href="/">Home</BaseLinkClient>)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/")
    expect(link).toHaveTextContent("Home")
  })

  it("should render external link with target and rel", () => {
    render(<BaseLinkClient href="https://example.com">External</BaseLinkClient>)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("should handle disabled state", () => {
    render(
      <BaseLinkClient disabled href="/">
        Disabled
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("tabindex", "-1")
    expect(link).toHaveStyle({ pointerEvents: "none" })
  })

  it("should handle custom link component", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomLink = ({ href, children, ...props }: any) => (
      <a data-testid="custom-link" href={href} {...props}>
        {children}
      </a>
    )

    render(
      <BaseLinkClient href="/page" linkComponent={CustomLink}>
        Custom
      </BaseLinkClient>,
    )

    const link = screen.getByTestId("custom-link")
    expect(link).toHaveAttribute("href", "/page")
  })

  it("should apply style prop", () => {
    render(
      <BaseLinkClient href="/" style={{ color: "blue" }}>
        Styled
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveStyle({ color: "blue" })
  })

  it("should handle download attribute for absolute URLs", () => {
    render(
      <BaseLinkClient download="file.pdf" href="https://example.com/file.pdf">
        Download
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("download", "file.pdf")
  })

  it("should pass through standard HTML attributes", () => {
    render(
      <BaseLinkClient
        aria-label="Test Link"
        className="btn btn-primary"
        href="/"
        id="my-link"
        title="Test Title"
      >
        Link
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("id", "my-link")
    expect(link).toHaveClass("btn")
    expect(link).toHaveClass("btn-primary")
    expect(link).toHaveAttribute("title", "Test Title")
  })

  it("should handle target override", () => {
    render(
      <BaseLinkClient href="https://example.com" target="_self">
        Link
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_self")
  })

  it("should handle rel override", () => {
    render(
      <BaseLinkClient href="https://example.com" rel="external">
        Link
      </BaseLinkClient>,
    )

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("rel", "external")
  })

  it("should render with children elements", () => {
    render(
      <BaseLinkClient href="/">
        <span>Icon</span>
        <span>Text</span>
      </BaseLinkClient>,
    )

    expect(screen.getByText("Icon")).toBeInTheDocument()
    expect(screen.getByText("Text")).toBeInTheDocument()
  })
})
