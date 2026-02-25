import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import ChipServer from "./Chip.server"

jest.mock("./Chip.view", () => ({
  ChipView: ({ label }: { label?: string }) => (
    <div data-label={label} data-testid="view" />
  ),
}))

describe("ChipServer", () => {
  it("renders with required label", () => {
    render(<ChipServer label="React" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-label", "React")
  })
})
