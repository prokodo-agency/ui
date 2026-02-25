import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import InputServer from "./Input.server"

jest.mock("./Input.view", () => ({
  InputView: ({ name, readOnly }: { name?: string; readOnly?: boolean }) => (
    <input data-testid="view" name={name} readOnly={readOnly} />
  ),
}))

describe("InputServer", () => {
  it("renders with required name prop", () => {
    render(<InputServer name="email" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces readOnly=true", () => {
    render(<InputServer name="email" />)
    expect(screen.getByTestId("view")).toHaveAttribute("readonly")
  })
})
