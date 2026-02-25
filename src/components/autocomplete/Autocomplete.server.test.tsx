import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import AutocompleteServer from "./Autocomplete.server"

jest.mock("./Autocomplete.view", () => ({
  AutocompleteView: ({
    name,
    readOnly,
  }: {
    name?: string
    readOnly?: boolean
  }) => (
    <div data-name={name} data-readonly={String(readOnly)} data-testid="view" />
  ),
}))

describe("AutocompleteServer", () => {
  it("renders with required name prop", () => {
    render(<AutocompleteServer name="search" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("passes readOnly=true", () => {
    render(<AutocompleteServer name="search" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-readonly", "true")
  })
})
