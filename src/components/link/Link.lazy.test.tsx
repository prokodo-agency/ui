import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config => (props: Record<string, unknown>) => (
    <div
      data-name={config.name}
      data-testid="lazy-wrapper"
      data-interactive={
        config.isInteractive ? String(config.isInteractive(props)) : "false"
      }
    />
  )),
}))

describe("Link.lazy", () => {
  it("creates lazy wrapper with name 'Link'", () => {
    const LinkLazy = require("./Link.lazy").default
    render(<LinkLazy href="/" />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Link")
  })

  it("is interactive when linkComponent is a function", () => {
    const LinkLazy = require("./Link.lazy").default
    const CustomLink = ({
      href,
      children,
    }: {
      href: string
      children: React.ReactNode
    }) => <a href={href}>{children}</a>
    render(<LinkLazy href="/" linkComponent={CustomLink} />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "true",
    )
  })

  it("is NOT interactive when no linkComponent is provided", () => {
    const LinkLazy = require("./Link.lazy").default
    render(<LinkLazy href="/" />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "false",
    )
  })
})
