import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config =>
    // Return a component that validates the config
    (props: { linkComponent?: unknown }) => {
      const isInteractive = String(
        config.isInteractive ? config.isInteractive(props) : false,
      )

      return (
        <div
          data-interactive={isInteractive}
          data-name={config.name}
          data-testid="lazy-wrapper"
        >
          Lazy Wrapper Component
        </div>
      )
    },
  ),
}))

import BaseLinkLazy from "./BaseLink.lazy"

describe("BaseLink.lazy", () => {
  it("should create lazy wrapper with correct config", () => {
    render(<BaseLinkLazy href="/">Link</BaseLinkLazy>)

    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "BaseLink")
    expect(wrapper).toHaveAttribute("data-interactive", "false")
  })

  it("should mark as interactive when linkComponent is provided", () => {
    const LinkComponent = () => <a href="/">Link</a>

    render(
      <BaseLinkLazy href="/page" linkComponent={LinkComponent}>
        Link
      </BaseLinkLazy>,
    )

    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
