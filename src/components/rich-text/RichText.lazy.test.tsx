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

describe("RichText.lazy", () => {
  it("creates lazy wrapper with name 'RichText' and is always interactive", () => {
    const RichTextLazy = require("./RichText.lazy").default
    render(<RichTextLazy content="" />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "RichText")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
