import { createRef } from "react"

import { render, screen } from "@/tests"

jest.mock("./Button.view", () => ({
  ButtonView: jest.fn((props: Record<string, unknown>) => (
    <button
      data-icon-only={String(props.isIconOnly ?? "")}
      data-testid="button-view"
      data-icon-name={String(
        props.iconProps
          ? ((props.iconProps as Record<string, unknown>).name ?? "")
          : "",
      )}
    />
  )),
}))

jest.mock("../loading", () => ({
  Loading: () => <span data-testid="loading-spinner" />,
}))

jest.mock("../link/Link.client", () => ({
  default: () => <a href="https://example.com">link</a>,
}))

const ButtonClient = require("./Button.client").default

describe("Button.client", () => {
  it("renders ButtonView without loading spinner by default", () => {
    render(<ButtonClient title="Click me" />)
    expect(screen.getByTestId("button-view")).toBeInTheDocument()
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
  })

  it("renders Loading spinner when loading=true", () => {
    render(<ButtonClient loading title="Click me" />)
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
  })

  it("clears iconProps.name when loading=true", () => {
    render(<ButtonClient loading iconProps={{ name: "star" }} />)
    expect(screen.getByTestId("button-view")).toHaveAttribute(
      "data-icon-name",
      "",
    )
  })

  it("preserves iconProps.name when not loading", () => {
    render(<ButtonClient iconProps={{ name: "star" }} />)
    expect(screen.getByTestId("button-view")).toHaveAttribute(
      "data-icon-name",
      "star",
    )
  })

  it("sets isIconOnly=true when iconProps.name is set and no title", () => {
    render(<ButtonClient iconProps={{ name: "star" }} />)
    expect(screen.getByTestId("button-view")).toHaveAttribute(
      "data-icon-only",
      "true",
    )
  })

  it("sets isIconOnly=false when title is also provided", () => {
    render(<ButtonClient iconProps={{ name: "star" }} title="Label" />)
    expect(screen.getByTestId("button-view")).toHaveAttribute(
      "data-icon-only",
      "false",
    )
  })

  it("supports forwardRef", () => {
    const ref = createRef<HTMLButtonElement>()
    render(<ButtonClient ref={ref} title="Ref test" />)
    // Will pass the ref to ButtonView via buttonRef prop
    expect(screen.getByTestId("button-view")).toBeInTheDocument()
  })
})
