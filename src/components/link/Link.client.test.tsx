import { render, screen } from "@/tests"

jest.mock("@/helpers/runtime.client", () => ({
  useUIRuntime: jest.fn(() => ({ linkComponent: undefined })),
}))

jest.mock("./Link.view", () => ({
  LinkView: jest.fn(
    (props: { LinkTag?: string; hasHandlers?: boolean; href?: string }) => (
      <div
        data-has-handlers={String(props.hasHandlers ?? false)}
        data-link-tag={String(props.LinkTag ?? "")}
        data-testid="link-view"
      />
    ),
  ),
}))

jest.mock("../base-link/BaseLink.server", () => ({
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  default: () => <a href="#">link</a>,
}))

const LinkClient = require("./Link.client").default

describe("Link.client", () => {
  it("uses 'a' tag when only href provided", () => {
    render(<LinkClient href="/page" />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-link-tag",
      "a",
    )
  })

  it("uses 'span' tag when only onClick provided (no href)", () => {
    render(<LinkClient onClick={() => {}} />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-link-tag",
      "span",
    )
  })

  it("uses 'a' tag when both href and onClick are provided", () => {
    render(<LinkClient href="/page" onClick={() => {}} />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-link-tag",
      "a",
    )
  })

  it("sets hasHandlers=true when onClick provided", () => {
    render(<LinkClient onClick={() => {}} />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-has-handlers",
      "true",
    )
  })

  it("sets hasHandlers=true when onKeyDown provided", () => {
    render(<LinkClient href="/page" onKeyDown={() => {}} />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-has-handlers",
      "true",
    )
  })

  it("sets hasHandlers=false when no event handlers", () => {
    render(<LinkClient href="/page" />)
    expect(screen.getByTestId("link-view")).toHaveAttribute(
      "data-has-handlers",
      "false",
    )
  })

  it("uses ctxLink from UIRuntime context when available", () => {
    const mockRuntime = require("@/helpers/runtime.client")

    const CustomLink = () => (
      <a data-testid="ctx-link" href="/test">
        link
      </a>
    )
    mockRuntime.useUIRuntime.mockReturnValueOnce({
      linkComponent: CustomLink,
    })
    render(<LinkClient href="/page" />)
    expect(screen.getByTestId("link-view")).toBeInTheDocument()
  })
})
