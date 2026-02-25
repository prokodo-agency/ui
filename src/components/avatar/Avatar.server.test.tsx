import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import AvatarServer from "./Avatar.server"

jest.mock("./Avatar.view", () => ({
  AvatarView: (_props: Record<string, unknown>) => <div data-testid="view" />,
}))

describe("AvatarServer", () => {
  it("renders without crashing with no props", () => {
    render(<AvatarServer />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
