import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import DrawerServer from "./Drawer.server"

jest.mock("./Drawer.view", () => ({
  DrawerView: (_props: Record<string, unknown>) => <div data-testid="view" />,
}))

describe("DrawerServer", () => {
  it("returns null when open is falsy", () => {
    const { container } = render(<DrawerServer open={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders when open is true", () => {
    render(<DrawerServer open />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
