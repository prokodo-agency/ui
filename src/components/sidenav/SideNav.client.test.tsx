import { act, render, screen } from "@/tests"

const STORAGE_KEY = "prokodo-adminSidebarCollapsed"

// Default export mock - use factory returning proper ESM default
jest.mock("./SideNav.view", () => {
  const React = require("react")
  function MockSideNavView(props: Record<string, unknown>) {
    const sectionItemButtons = Array.isArray(props.sections)
      ? (
          props.sections as Array<{
            items: Array<Record<string, unknown>>
          }>
        ).flatMap((section, si) =>
          section.items.map((item, ii) =>
            React.createElement(
              "button",
              {
                key: `s${si}-i${ii}`,
                "data-testid": `section-${si}-item-${ii}`,
                onClick: () =>
                  (
                    item.redirect as { onClick?: (e: unknown) => void }
                  )?.onClick?.({}),
              },
              String(item.label ?? ""),
            ),
          ),
        )
      : []
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
      ...sectionItemButtons,
    )
  }
  return { __esModule: true, default: MockSideNavView }
})

const SidebarClient = require("./SideNav.client").default

beforeEach(() => {
  localStorage.clear()
})

describe("SideNav.client", () => {
  it("leaves controlled state and persistence to the owner", () => {
    localStorage.setItem(STORAGE_KEY, "1")
    const onCollapsedChange = jest.fn()
    const { rerender } = render(
      <SidebarClient collapsed={false} onCollapsedChange={onCollapsedChange} />,
    )
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "false",
    )
    act(() => screen.getByTestId("toggle-btn").click())
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "false",
    )
    expect(localStorage.getItem(STORAGE_KEY)).toBe("1")
    rerender(<SidebarClient collapsed onCollapsedChange={onCollapsedChange} />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
    act(() => screen.getByTestId("toggle-btn").click())
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
  })

  it("still toggles when browser storage cannot be read or written", () => {
    const read = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked")
      })
    const write = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("blocked")
      })
    render(<SidebarClient />)
    act(() => screen.getByTestId("toggle-btn").click())
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
    read.mockRestore()
    write.mockRestore()
  })

  it("ignores malformed stored preferences", () => {
    localStorage.setItem(STORAGE_KEY, "invalid")
    render(<SidebarClient initialCollapsed />)
    expect(screen.getByTestId("sidenav-view")).toHaveAttribute(
      "data-collapsed",
      "true",
    )
  })

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

  describe("formatedSections", () => {
    it("processes sections with redirect items and calls onClick and onChange", () => {
      const redirectOnClick = jest.fn()
      const onChangeMock = jest.fn()
      const item = {
        label: "Section Link",
        redirect: { href: "/section", onClick: redirectOnClick },
      }
      render(
        <SidebarClient
          items={[]}
          sections={[{ headline: "Section", items: [item] }]}
          onChange={onChangeMock}
        />,
      )
      act(() => screen.getByTestId("section-0-item-0").click())
      expect(redirectOnClick).toHaveBeenCalledTimes(1)
      expect(onChangeMock).toHaveBeenCalledWith(item)
    })

    it("processes sections with redirect but no onClick gracefully", () => {
      const onChangeMock = jest.fn()
      const item = { label: "NoClick", redirect: { href: "/page" } }
      render(
        <SidebarClient
          items={[]}
          sections={[{ headline: "Nav", items: [item] }]}
          onChange={onChangeMock}
        />,
      )
      act(() => screen.getByTestId("section-0-item-0").click())
      expect(onChangeMock).toHaveBeenCalledWith(item)
    })

    it("processes section items without redirect (covers falsy redirect branch)", () => {
      render(
        <SidebarClient
          items={[]}
          sections={[{ headline: "Nav", items: [{ label: "NoRedirect" }] }]}
        />,
      )
      expect(screen.getByTestId("section-0-item-0")).toBeInTheDocument()
    })

    it("defaults section redirect.href to empty string when not provided", () => {
      render(
        <SidebarClient
          items={[]}
          sections={[
            { headline: "Nav", items: [{ label: "NoHref", redirect: {} }] },
          ]}
        />,
      )
      expect(screen.getByTestId("section-0-item-0")).toBeInTheDocument()
    })
  })
})
