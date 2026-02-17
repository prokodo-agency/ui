import { render, screen } from "@testing-library/react"

import CheckboxServer from "./Checkbox.server"

jest.mock("./Checkbox.view", () => ({
  CheckboxView: ({ isChecked }: { isChecked: boolean }) => (
    <div data-checked={isChecked} data-testid="checkbox-view" />
  ),
}))

describe("CheckboxServer", () => {
  it("uses checked when controlled", () => {
    render(
      <CheckboxServer
        checked={true}
        defaultChecked={false}
        name="server"
        title="Server"
        value="v"
      />,
    )

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "true",
    )
  })

  it("falls back to defaultChecked when uncontrolled", () => {
    render(
      <CheckboxServer
        defaultChecked={true}
        name="server2"
        title="Server2"
        value="v"
      />,
    )

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "true",
    )
  })

  it("defaults to false when no checked values are provided", () => {
    render(<CheckboxServer name="server3" title="Server3" value="v" />)

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "false",
    )
  })
})
