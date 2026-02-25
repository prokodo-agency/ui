import { act, render, screen } from "@/tests"

const STORAGE_KEY = "prokodo-adminSidebarCollapsed"

// Default export mock - use factory returning proper ESM default
jest.mock("./SideNav.view", () => {
  const React = require("react")
  function MockSideNavView(props: Record<string, unknown>) {
    return React.createElement(
      "div",
      {
        "data-testid": "sidenav-view",
        "data-collapsed": String(props.collapsed ?? false),
      },
      React.createElement(
        "button",
        { "data-testid": "toggle-btn", onClick: props.onToggle },
        "Toggle",
      ),
      ...(Array.isArray(props.items)
        ? (props.items as Array<Record<string, unknown>>).map((item, i) =>
            React.createElement(
              "button",
              {
                key: i,
                "data-testid": `item-${i}`,
                onClick: () =>
                  (
                    item.redirect as { onClick?: (e: unknown) => void }
                  )?.onClick?.({}),
              },
              String(item.label ?? ""),
            ),
          )
        : []),
    )
  }
  return { __esModule: true, default: MockSideNavView }
})

const SidebarClient = require("./SideNav.client").default

beforeEach(() => {
  localStorage.clear()
})

describe("SideNav.client", () => {
  it("initializes as not collapsed by default", () => {
    render(<SidebarClient items={[]} />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "false",
    )
  })

  it("initializes with initialCollapsed=true", () => {
    render(<SidebarClient initialCollapsed={true} items={[]} />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
  })

  it("reads collapsed state from localStorage on mount", () => {
    localStorage.setItem(STORAGE_KEY, "1")
    render(<SidebarClient initialCollapsed={false} items={[]} />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
  })

  it("reads expanded state (0) from localStorage on mount", () => {
    localStorage.setItem(STORAGE_KEY, "0")
    render(<SidebarClient initialCollapsed={true} items={[]} />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "false",
    )
  })

  it("toggles collapsed state on handleToggle", () => {
    render(<SidebarClient initialCollapsed={false} items={[]} />)
    act(() => screen.getByTestId("toggle-btn").click())
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
  })

  it("saves '1' to localStorage when collapsing", () => {
    render(<SidebarClient initialCollapsed={false} items={[]} />)
    act(() => screen.getByTestId("toggle-btn").click())
    expect(localStorage.getItem(STORAGE_KEY)).toBe("1")
  })

  it("saves '0' to localStorage when expanding", () => {
    localStorage.setItem(STORAGE_KEY, "1")
    render(<SidebarClient initialCollapsed={true} items={[]} />)
    act(() => screen.getByTestId("toggle-btn").click())
    expect(localStorage.getItem(STORAGE_KEY)).toBe("0")
  })

  describe("formatedItems", () => {
    it("passes items without redirect unchanged (except adding redirect=undefined branch)", () => {
      render(<SidebarClient items={[{ label: "Dashboard" }]} />)
      expect(screen.getByTestId("item-0")).toBeInTheDocument()
    })

    it("calls redirect.onClick and onChange when item redirect is clicked", () => {
      const redirectOnClick = jest.fn()
      const onChangeMock = jest.fn()
      const item = {
        label: "Settings",
        redirect: { href: "/settings", onClick: redirectOnClick },
      }
      render(<SidebarClient items={[item]} onChange={onChangeMock} />)

      act(() => screen.getByTestId("item-0").click())
      expect(redirectOnClick).toHaveBeenCalledTimes(1)
      expect(onChangeMock).toHaveBeenCalledWith(item)
    })

    it("handles items with redirect but no onClick gracefully", () => {
      const onChangeMock = jest.fn()
      const item = { label: "Link", redirect: { href: "/link" } }
      render(<SidebarClient items={[item]} onChange={onChangeMock} />)

      act(() => screen.getByTestId("item-0").click())
      // onClick was undefined — no crash
      expect(onChangeMock).toHaveBeenCalledWith(item)
    })

    it("defaults redirect.href to empty string when not provided", () => {
      render(<SidebarClient items={[{ label: "NoHref", redirect: {} }]} />)
      // should render without crashing
      expect(screen.getByTestId("item-0")).toBeInTheDocument()
    })
  })
})
