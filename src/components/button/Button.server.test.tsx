import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import ButtonServer from "./Button.server"

jest.mock("./Button.view", () => ({
  ButtonView: ({ isIconOnly }: { isIconOnly?: boolean }) => (
    <button data-icon-only={String(isIconOnly)} data-testid="view" />
  ),
}))

jest.mock("../link/Link.server", () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  default: (props: Record<string, unknown>) => <a {...props} />,
}))

describe("ButtonServer", () => {
  it("renders with title", () => {
    render(<ButtonServer title="Click me" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("sets isIconOnly=false when title provided", () => {
    render(<ButtonServer title="Label" />)
    expect(screen.getByTestId("view")).toHaveAttribute(
      "data-icon-only",
      "false",
    )
  })

  it("sets isIconOnly=true for icon-only button", () => {
    render(
      <ButtonServer aria-label="Cancel" iconProps={{ name: "Cancel01Icon" }} />,
    )
    expect(screen.getByTestId("view")).toHaveAttribute("data-icon-only", "true")
  })

  it("sets isIconOnly=true when iconProps.name exists and title is empty string", () => {
    render(<ButtonServer iconProps={{ name: "Cancel01Icon" }} title="" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-icon-only", "true")
  })
})
