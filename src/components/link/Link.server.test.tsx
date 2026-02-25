import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import LinkServer from "./Link.server"

jest.mock("./Link.view", () => ({
  LinkView: ({ href }: { href?: string }) => (
    <a data-testid="view" href={href}>
      link
    </a>
  ),
}))

jest.mock("../base-link/BaseLink.server", () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href?: string
    children?: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

describe("LinkServer", () => {
  it("renders with href", () => {
    render(<LinkServer href="/about" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })
})
