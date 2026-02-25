import { act, render, screen } from "@/tests"

let capturedClientState: Record<string, unknown> = {}

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedClientState = (props._clientState as Record<string, unknown>) ?? {}
  return (
    <div
      data-open={String(props.open ?? false)}
      data-testid="autocomplete-view"
      data-value={String(props.value ?? "")}
    />
  )
})

jest.mock("./Autocomplete.view", () => ({ AutocompleteView: mockView }))

const AutocompleteClient = require("./Autocomplete.client").default

const items = [
  { label: "Apple", value: "apple" },
  { label: "Apricot", value: "apricot" },
  { label: "Banana", value: "banana" },
]

beforeEach(() => {
  mockView.mockClear()
  capturedClientState = {}
})

describe("Autocomplete.client", () => {
  it("renders with empty initial value", () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-value",
      "",
    )
  })

  it("initializes with provided value", () => {
    render(<AutocompleteClient items={items} name="fruit" value="Apple" />)
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-value",
      "Apple",
    )
  })

  it("opens dropdown and updates query on input change", async () => {
    const onChangeMock = jest.fn()
    render(
      <AutocompleteClient items={items} name="fruit" onChange={onChangeMock} />,
    )
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-value",
      "app",
    )
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
    expect(onChangeMock).toHaveBeenCalledWith({ query: "app" })
  })

  it("opens on focus when query length >= minQueryLength", async () => {
    render(
      <AutocompleteClient
        items={items}
        minQueryLength={2}
        name="fruit"
        value="ap"
      />,
    )
    await act(async () => {
      ;(capturedClientState.onInputFocus as () => void)?.()
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("does not open on focus when query is too short", async () => {
    render(
      <AutocompleteClient
        items={items}
        minQueryLength={2}
        name="fruit"
        value="a"
      />,
    )
    await act(async () => {
      ;(capturedClientState.onInputFocus as () => void)?.()
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("selects item and closes dropdown", async () => {
    const onSelectMock = jest.fn()
    render(
      <AutocompleteClient
        items={items}
        name="fruit"
        value="app"
        onSelect={onSelectMock}
      />,
    )
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    await act(async () => {
      ;(capturedClientState.onSelectItem as (item: unknown) => void)?.(items[0])
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-value",
      "Apple",
    )
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "false",
    )
    expect(onSelectMock).toHaveBeenCalledWith(items[0])
  })

  it("closes dropdown on Escape key", async () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "Escape",
        preventDefault: jest.fn(),
      })
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("navigates down with ArrowDown key", async () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("a")
    })
    // Navigate down
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "ArrowDown",
        preventDefault: jest.fn(),
      })
    })
    // list should still be open
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("navigates up with ArrowUp key", async () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("a")
    })
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "ArrowDown",
        preventDefault: jest.fn(),
      })
    })
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "ArrowUp",
        preventDefault: jest.fn(),
      })
    })
    // still open
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("selects item on Enter key when open", async () => {
    const onSelectMock = jest.fn()
    render(
      <AutocompleteClient items={items} name="fruit" onSelect={onSelectMock} />,
    )
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "Enter",
        preventDefault: jest.fn(),
      })
    })
    expect(onSelectMock).toHaveBeenCalledWith(items[0])
  })

  it("does not select on Enter when list is closed", async () => {
    const onSelectMock = jest.fn()
    render(
      <AutocompleteClient items={items} name="fruit" onSelect={onSelectMock} />,
    )
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "Enter",
        preventDefault: jest.fn(),
      })
    })
    expect(onSelectMock).not.toHaveBeenCalled()
  })

  it("syncs with controlled value change", () => {
    const { rerender } = render(
      <AutocompleteClient items={items} name="fruit" value="old" />,
    )
    rerender(<AutocompleteClient items={items} name="fruit" value="new" />)
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-value",
      "new",
    )
  })

  it("closes dropdown on click outside the root element", async () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    // open first
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
    // Click outside: dispatch mousedown on document body
    await act(async () => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      )
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("does not close dropdown on click inside the root element", async () => {
    const { container } = render(
      <AutocompleteClient items={items} name="fruit" />,
    )
    // open first
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    // Click inside the component's root div
    await act(async () => {
      container.firstChild!.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      )
    })
    // Should remain open since click was inside
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("updates list anchor on resize/scroll events when open (onLayoutChange)", async () => {
    render(<AutocompleteClient items={items} name="fruit" />)
    // open first
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    // Trigger resize/scroll → onLayoutChange fires updateListAnchor
    await act(async () => {
      window.dispatchEvent(new Event("resize"))
      window.dispatchEvent(new Event("scroll", { bubbles: true }))
    })
    expect(screen.getByTestId("autocomplete-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("does not select on Enter when activeIndex is out of range (empty items)", async () => {
    const onSelectMock = jest.fn()
    render(
      <AutocompleteClient items={[]} name="fruit" onSelect={onSelectMock} />,
    )
    // open dropdown
    await act(async () => {
      ;(capturedClientState.onInputChange as (q: string) => void)?.("app")
    })
    // Press Enter with no items → selected is undefined → return early
    await act(async () => {
      ;(capturedClientState.onInputKeyDown as (e: unknown) => void)?.({
        key: "Enter",
        preventDefault: jest.fn(),
      })
    })
    expect(onSelectMock).not.toHaveBeenCalled()
  })
})
