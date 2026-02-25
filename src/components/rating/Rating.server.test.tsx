import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import RatingServer from "./Rating.server"

jest.mock("./Rating.view", () => ({
  RatingView: ({ name, readOnly }: { name?: string; readOnly?: boolean }) => (
    <div data-name={name} data-readonly={String(readOnly)} data-testid="view" />
  ),
}))

describe("RatingServer", () => {
  it("renders with required name prop", () => {
    render(<RatingServer name="rating" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces readOnly=true", () => {
    render(<RatingServer name="rating" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-readonly", "true")
  })
})
