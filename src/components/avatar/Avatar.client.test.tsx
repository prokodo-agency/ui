import { render, screen } from "@/tests"

jest.mock("./Avatar.view", () => ({
  AvatarView: (props: Record<string, unknown>) => (
    <div data-src={String(props.src ?? "")} data-testid="avatar-view" />
  ),
}))

const AvatarClient = require("./Avatar.client").default

describe("Avatar.client", () => {
  it("renders AvatarView", () => {
    render(<AvatarClient alt="User" src="https://example.com/avatar.png" />)
    expect(screen.getByTestId("avatar-view")).toBeInTheDocument()
  })

  it("passes props through to AvatarView", () => {
    render(<AvatarClient alt="Test" src="https://img.test/pic.jpg" />)
    expect(screen.getByTestId("avatar-view")).toHaveAttribute(
      "data-src",
      "https://img.test/pic.jpg",
    )
  })
})
