import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import ProgressBarServer from "./ProgressBar.server"

jest.mock("./ProgressBar.view", () => ({
  ProgressBarView: ({ id }: { id?: string }) => (
    <div data-testid="view" id={id} />
  ),
}))

describe("ProgressBarServer", () => {
  it("renders with required id prop", () => {
    render(<ProgressBarServer id="progress-1" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
