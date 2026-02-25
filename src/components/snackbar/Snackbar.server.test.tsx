import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import SnackbarServer from "./Snackbar.server"

jest.mock("./Snackbar.view", () => ({
  SnackbarView: (_props: Record<string, unknown>) => <div data-testid="view" />,
}))

describe("SnackbarServer", () => {
  it("returns null when open is falsy", () => {
    const { container } = render(
      <SnackbarServer message="Hello" open={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("renders when open is true", () => {
    render(<SnackbarServer open message="Hello" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
