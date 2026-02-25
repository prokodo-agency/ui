import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import DialogServer from "./Dialog.server"

jest.mock("./Dialog.view", () => ({
  DialogView: (_props: Record<string, unknown>) => <div data-testid="view" />,
}))

describe("DialogServer", () => {
  it("returns null when open is falsy", () => {
    const { container } = render(<DialogServer open={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders when open is true", () => {
    render(<DialogServer open />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
