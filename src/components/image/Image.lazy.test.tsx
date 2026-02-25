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

describe("Image.lazy", () => {
  it("creates lazy wrapper with name 'Image' and is always interactive", () => {
    const ImageLazy = require("./Image.lazy").default
    render(<ImageLazy alt="test" src="/img.jpg" />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Image")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
