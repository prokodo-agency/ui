import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import SelectServer from "./Select.server"

jest.mock("./Select.view", () => ({
  SelectView: ({ id, label }: { id?: string; label?: string }) => (
    <div data-id={id} data-label={label} data-testid="view" />
  ),
}))

describe("SelectServer", () => {
  it("renders with required props", () => {
    render(
      <SelectServer
        id="select-1"
        items={[{ value: "a", label: "Option A" }]}
        label="Choose"
      />,
    )
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
