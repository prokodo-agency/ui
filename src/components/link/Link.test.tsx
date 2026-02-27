import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

import { Link } from "./Link"
import { LinkView } from "./Link.view"

describe("The common link component", () => {
  it("should render primary", async () => {
    render(
      <Link href="/" variant="primary">
        Primary link
      </Link>,
    )
    expect(screen.getByText("Primary link")).toMatchSnapshot()
  })

  it("should render secondary", async () => {
    render(
      <Link href="/" variant="secondary">
        Secondary link
      </Link>,
    )
    expect(screen.getByText("Secondary link")).toMatchSnapshot()
  })

  it("should not open inbound links in a new tab", async () => {
    render(
      <Link href="/" variant="primary">
        Inbound link
      </Link>,
    )
    const inbound = screen.getByText("Inbound link")
    expect(inbound).not.toHaveAttribute("rel")
    expect(inbound).not.toHaveAttribute("target")
  })

  it("primary link has no axe violations", async () => {
    const { container } = render(
      <Link href="/about" variant="primary">
        About us
      </Link>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("secondary link has no axe violations", async () => {
    const { container } = render(
      <Link href="/contact" variant="secondary">
        Contact
      </Link>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// -------------------------------------------------------------------------
// LinkView – direct rendering for span (LinkTag="span") branch coverage
// -------------------------------------------------------------------------
describe("LinkView span branch", () => {
  const FakeBase = ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href?: string
    [k: string]: unknown
  }) => (
    <a href={href as string} {...rest}>
      {children}
    </a>
  )

  it("renders non-interactive span without button role when hasHandlers=false", () => {
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={false}
        href="/"
        LinkTag="span"
      >
        Click me
      </LinkView>,
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("fires onClick when span is clicked and hasHandlers=true", () => {
    const onClick = jest.fn()
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={true}
        href="/"
        LinkTag="span"
        onClick={onClick as never}
      >
        Click me
      </LinkView>,
    )
    screen.getByRole("button").click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick when Enter key is pressed and hasHandlers=true", () => {
    const onClick = jest.fn()
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={true}
        href="/"
        LinkTag="span"
        onClick={onClick as never}
      >
        Span link
      </LinkView>,
    )
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick when Space key is pressed and hasHandlers=true", () => {
    const onClick = jest.fn()
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={true}
        href="/"
        LinkTag="span"
        onClick={onClick as never}
      >
        Span link
      </LinkView>,
    )
    fireEvent.keyDown(screen.getByRole("button"), { key: " " })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does NOT fire onClick for non-Enter/Space keys with hasHandlers=true", () => {
    const onClick = jest.fn()
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={true}
        href="/"
        LinkTag="span"
        onClick={onClick as never}
      >
        Span link
      </LinkView>,
    )
    fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("does NOT fire onClick when hasHandlers=false", () => {
    const onClick = jest.fn()
    render(
      <LinkView
        BaseLinkComponent={FakeBase as never}
        hasHandlers={false}
        href="/"
        LinkTag="span"
        onClick={onClick as never}
      >
        Span link
      </LinkView>,
    )
    screen.getByText("Span link").click()
    // onClick is undefined when hasHandlers=false, so it should not be called
    expect(onClick).not.toHaveBeenCalled()
  })
})
