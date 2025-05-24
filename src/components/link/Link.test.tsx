import { render, screen } from "@/tests"

import { Link } from "./Link"

describe("The common link component", () => {
  it("should render primary", () => {
    render(
      <Link href="/" variant="primary">
        Primary link
      </Link>,
    )
    expect(screen.getByText("Primary link")).toMatchSnapshot()
  })

  it("should render secondary", () => {
    render(
      <Link href="/" variant="secondary">
        Secondary link
      </Link>,
    )
    expect(screen.getByText("Secondary link")).toMatchSnapshot()
  })

  it("should not open inbound links in a new tab", () => {
    render(
      <Link href="/" variant="primary">
        Inbound link
      </Link>,
    )
    const inbound = screen.getByText("Inbound link")
    expect(inbound).not.toHaveAttribute("rel")
    expect(inbound).not.toHaveAttribute("target")
  })
})
