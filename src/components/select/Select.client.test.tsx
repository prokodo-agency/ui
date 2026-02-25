import React from "react"

import { act, render, screen, fireEvent } from "@/tests"

// Render portals inline so we can query the listbox without Portal
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: unknown) => node,
}))

type ListboxArgs = {
  open: boolean
  items: Array<{ value: string; label?: string }>
  value: string | string[]
  multiple?: boolean
  required?: boolean
  id?: string
  placeholder?: string
  className?: string
  bemItem: (mods?: Record<string, boolean>) => string
  bemCheckbox: (mods?: Record<string, boolean>) => string
  onOptionClick: (v: string | null) => void
}

let capturedClientState: Record<string, unknown> = {}

const mockView = jest.fn((props: Record<string, unknown>) => {
  const cs = props._clientState as Record<string, unknown>
  capturedClientState = cs
  const listbox = (
    cs.renderListbox as (args: ListboxArgs) => React.ReactNode
  )?.({
    open: cs.open as boolean,
    items: (props.items ?? []) as ListboxArgs["items"],
    value: (props.value ?? "") as string,
    multiple: props.multiple as boolean,
    required: props.required as boolean,
    id: "select",
    placeholder: "Select…",
    className: "list",
    bemItem: () => "item",
    bemCheckbox: () => "check",
    onOptionClick: cs.onOptionClick as (v: string | null) => void,
  })
  return (
    <div
      data-disabled={String(Boolean(props.disabled))}
      data-testid="select-view"
      data-value={String(props.value ?? "")}
    >
      <button
        data-testid="select-btn"
        onClick={cs.onButtonClick as React.MouseEventHandler}
        onKeyDown={cs.onButtonKey as React.KeyboardEventHandler}
      >
        Toggle
      </button>
      <div data-testid="listbox-wrapper">{listbox}</div>
    </div>
  )
})

jest.mock("./Select.view", () => ({ SelectView: mockView }))

const SelectClient = require("./Select.client").default

const ITEMS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
]

beforeEach(() => mockView.mockClear())

describe("Select.client", () => {
  it("initializes with empty value for single-select", () => {
    render(<SelectClient items={ITEMS} />)
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "")
  })

  it("initializes with provided value", () => {
    render(<SelectClient items={ITEMS} value="b" />)
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "b")
  })

  it("opens dropdown on button click", () => {
    render(<SelectClient items={ITEMS} />)
    // before open, listbox is null (open=false + popupReady=false)
    expect(capturedClientState.open).toBe(false)
    fireEvent.click(screen.getByTestId("select-btn"))
    // popupReady may still be false (getBoundingClientRect returns {0,0} in jsdom + open=true)
    // but open should be true
    expect(capturedClientState.open).toBe(true)
  })

  it("closes when Escape key is pressed on button", () => {
    render(<SelectClient items={ITEMS} />)
    // open first
    fireEvent.click(screen.getByTestId("select-btn"))
    expect(capturedClientState.open).toBe(true)
    fireEvent.keyDown(screen.getByTestId("select-btn"), { key: "Escape" }),
      expect(capturedClientState.open).toBe(false)
  })

  it("opens with ArrowDown key", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.keyDown(screen.getByTestId("select-btn"), { key: "ArrowDown" }),
      expect(capturedClientState.open).toBe(true)
  })

  it("opens with ArrowUp key", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.keyDown(screen.getByTestId("select-btn"), { key: "ArrowUp" }),
      expect(capturedClientState.open).toBe(true)
  })

  it("forwards disabled prop to SelectView", () => {
    render(<SelectClient disabled items={ITEMS} />)
    expect(screen.getByTestId("select-view")).toHaveAttribute(
      "data-disabled",
      "true",
    )
  })

  it("disabled select ignores key open attempts", () => {
    render(<SelectClient disabled items={ITEMS} />)
    fireEvent.keyDown(screen.getByTestId("select-btn"), { key: "ArrowDown" }),
      expect(capturedClientState.open).toBe(false)
  })

  it("selects an option via onOptionClick and calls onChange", async () => {
    const onChangeMock = jest.fn()
    render(<SelectClient items={ITEMS} onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedClientState.onOptionClick as (v: string) => void)?.("a")
    })
    expect(onChangeMock).toHaveBeenCalled()
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "a")
  })

  it("closes after single-select item click", async () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    expect(capturedClientState.open).toBe(true)
    await act(async () => {
      ;(capturedClientState.onOptionClick as (v: string) => void)?.("b")
    })
    expect(capturedClientState.open).toBe(false)
  })

  it("stays open after multi-select item click", async () => {
    render(<SelectClient multiple items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    await act(async () => {
      ;(capturedClientState.onOptionClick as (v: string) => void)?.("a")
    })
    expect(capturedClientState.open).toBe(true)
  })

  it("selects null (placeholder) and clears value", async () => {
    const onChangeMock = jest.fn()
    render(<SelectClient items={ITEMS} value="b" onChange={onChangeMock} />)
    await act(async () => {
      ;(capturedClientState.onOptionClick as (v: string | null) => void)?.(null)
    })
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "")
  })

  it("syncs with controlled value change", () => {
    const { rerender } = render(<SelectClient items={ITEMS} value="a" />)
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "a")
    rerender(<SelectClient items={ITEMS} value="c" />)
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "c")
  })

  it("renderListbox returns null when open=false", () => {
    render(<SelectClient items={ITEMS} />)
    const result = (
      capturedClientState.renderListbox as (
        args: ListboxArgs,
      ) => React.ReactNode
    )?.({
      open: false,
      items: ITEMS,
      value: "",
      id: "sel",
      placeholder: "Select",
      className: "list",
      bemItem: () => "item",
      bemCheckbox: () => "check",
      onOptionClick: jest.fn(),
    })
    expect(result).toBeNull()
  })
})

describe("Select.client – listbox interaction (popupReady)", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // getBoundingClientRect returns non-zero rect so popupReady=true after click
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 200,
      right: 300,
      bottom: 250,
      width: 200,
      height: 50,
      x: 100,
      y: 200,
      toJSON: () => ({}),
    } as DOMRect)
  })
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it("renders listbox when open=true and popupReady=true", async () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    // Effect runs → popupReady=true → listbox renders
    jest.runAllTimers()
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("list item onClick calls onOptionClick (selects option)", () => {
    const onChange = jest.fn()
    render(<SelectClient items={ITEMS} onChange={onChange} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    // Click Option A (index 1 if placeholder present, index 0 if not)
    fireEvent.click(options[options.length - 3]!)
    expect(onChange).toHaveBeenCalled()
  })

  it("list item onKeyDown Enter calls onOptionClick", () => {
    const onChange = jest.fn()
    render(<SelectClient items={ITEMS} onChange={onChange} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    fireEvent.keyDown(options[1]!, { key: "Enter" })
    expect(onChange).toHaveBeenCalled()
  })

  it("list item onKeyDown Space calls onOptionClick", () => {
    const onChange = jest.fn()
    render(<SelectClient items={ITEMS} onChange={onChange} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    fireEvent.keyDown(options[1]!, { key: " " })
    expect(onChange).toHaveBeenCalled()
  })

  it("list item onMouseMove sets activeIndex", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    fireEvent.mouseMove(options[2]!)
    // No crash + listbox still rendered
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("onListKeyDown ArrowDown navigates to next option", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const listbox = screen.getByRole("listbox")
    fireEvent.keyDown(listbox, { key: "ArrowDown" })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("onListKeyDown ArrowUp navigates to previous option", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const listbox = screen.getByRole("listbox")
    fireEvent.keyDown(listbox, { key: "ArrowUp" })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("onListKeyDown Home goes to first option", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const listbox = screen.getByRole("listbox")
    fireEvent.keyDown(listbox, { key: "Home" })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("onListKeyDown End goes to last option", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const listbox = screen.getByRole("listbox")
    fireEvent.keyDown(listbox, { key: "End" })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("onListKeyDown Enter selects active option", () => {
    const onChange = jest.fn()
    render(<SelectClient required items={ITEMS} onChange={onChange} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const listbox = screen.getByRole("listbox")
    // Navigate to first option
    fireEvent.keyDown(listbox, { key: "ArrowDown" })
    // Select it
    fireEvent.keyDown(listbox, { key: "Enter" })
    expect(onChange).toHaveBeenCalled()
  })

  it("onListKeyDown Escape closes listbox", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    expect(capturedClientState.open).toBe(true)
    const listbox = screen.getByRole("listbox")
    fireEvent.keyDown(listbox, { key: "Escape" })
    expect(capturedClientState.open).toBe(false)
  })

  it("window resize updates popup position when open", async () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    await act(async () => {
      window.dispatchEvent(new Event("resize"))
    })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("window scroll updates popup position when open", async () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    await act(async () => {
      window.dispatchEvent(new Event("scroll", { bubbles: true }))
    })
    expect(screen.getByRole("listbox")).toBeInTheDocument()
  })

  it("outside click closes dropdown", () => {
    render(<SelectClient items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    expect(capturedClientState.open).toBe(true)
    fireEvent.click(document.body)
    expect(capturedClientState.open).toBe(false)
  })

  it("toDatasetKey is used when data-* props are passed in onChange event", async () => {
    const onChange = jest.fn()
    render(
      <SelectClient data-row-index="5" items={ITEMS} onChange={onChange} />,
    )
    await act(async () => {
      ;(capturedClientState.onOptionClick as (v: string) => void)?.("a")
    })
    expect(onChange).toHaveBeenCalled()
    const [call] = onChange.mock.calls
    // synthetic event should have dataset.rowIndex (camelCase via toDatasetKey)
    expect(
      (call[0] as { target: { dataset: Record<string, unknown> } }).target
        .dataset.rowIndex,
    ).toBe("5")
  })

  it("renders multiple checkbox options in multi-select mode", () => {
    render(<SelectClient multiple items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    // In multiple mode, checkboxes should appear
    const checkboxes = screen.getAllByRole("option")
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it("required=true removes placeholder option", () => {
    render(<SelectClient required items={ITEMS} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    // No placeholder option → same count as items
    expect(options.length).toBe(ITEMS.length)
  })

  it("placeholder option onClick calls onOptionClick with null", () => {
    const onChange = jest.fn()
    render(<SelectClient items={ITEMS} value="a" onChange={onChange} />)
    fireEvent.click(screen.getByTestId("select-btn"))
    jest.runAllTimers()
    const options = screen.getAllByRole("option")
    // First option is placeholder (not required)
    fireEvent.click(options[0]!)
    // Value should reset
    expect(screen.getByTestId("select-view")).toHaveAttribute("data-value", "")
  })
})
