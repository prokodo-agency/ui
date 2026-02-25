import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import DatePickerServer from "./DatePicker.server"

jest.mock("./DatePicker.view", () => ({
  DatePickerView: ({
    name,
    readOnly,
  }: {
    name?: string
    readOnly?: boolean
  }) => (
    <div data-name={name} data-readonly={String(readOnly)} data-testid="view" />
  ),
}))

describe("DatePickerServer", () => {
  it("renders with required props", () => {
    render(<DatePickerServer label="Birth Date" name="birthDate" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces readOnly=true", () => {
    render(<DatePickerServer label="Birth Date" name="birthDate" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-readonly", "true")
  })
})
