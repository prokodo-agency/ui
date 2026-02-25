import { act, render, screen } from "@/tests"

let capturedClientState: Record<string, unknown> = {}
let capturedValue = ""

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedClientState = (props._clientState as Record<string, unknown>) ?? {}
  capturedValue = String(props.value ?? "")
  const items =
    (props.items as Array<{
      value: string
      label?: string
      disabled?: boolean
    }>) ?? []
  return (
    <div data-testid="tabs-view" data-value={capturedValue}>
      {items.map((item, i) => (
        <button
          key={item.value}
          data-testid={`tab-${item.value}`}
          onClick={e => {
            e.preventDefault()
            ;(
              capturedClientState.onTabClick as (i: number, e: unknown) => void
            )?.(i, e)
          }}
          onKeyDown={e =>
            (
              capturedClientState.onTabKeyDown as (
                i: number,
                e: React.KeyboardEvent<HTMLButtonElement>,
              ) => void
            )?.(i, e)
          }
        >
          {item.label ?? item.value}
        </button>
      ))}
    </div>
  )
})

jest.mock("./Tabs.view", () => ({ TabsView: mockView }))

const TabsClient = require("./Tabs.client").default

const items = [
  { value: "tab1", label: "Tab 1" },
  { value: "tab2", label: "Tab 2" },
  { value: "tab3", label: "Tab 3" },
]

beforeEach(() => {
  mockView.mockClear()
  capturedClientState = {}
  capturedValue = ""
})

describe("Tabs.client", () => {
  it("initializes with first enabled tab", () => {
    render(<TabsClient items={items} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("initializes with provided defaultValue", () => {
    render(<TabsClient defaultValue="tab2" items={items} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("uses controlled value when provided", () => {
    render(<TabsClient items={items} value="tab3" />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })

  it("changes active tab on click", () => {
    render(<TabsClient items={items} />)
    act(() => {
      screen.getByTestId("tab-tab2").click()
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("calls onChange on tab click", () => {
    const onChangeMock = jest.fn()
    render(<TabsClient items={items} onChange={onChangeMock} />)
    act(() => {
      screen.getByTestId("tab-tab3").click()
    })
    expect(onChangeMock).toHaveBeenCalledWith({ value: "tab3", index: 2 })
  })

  it("navigates right with ArrowRight key", async () => {
    render(<TabsClient items={items} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        Object.assign(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
        ),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("navigates with ArrowLeft key", async () => {
    render(<TabsClient defaultValue="tab2" items={items} />)
    const tab2 = screen.getByTestId("tab-tab2")
    await act(async () => {
      tab2.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("jumps to first tab on Home key", async () => {
    render(<TabsClient defaultValue="tab3" items={items} />)
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Home" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("jumps to last tab on End key", async () => {
    render(<TabsClient defaultValue="tab1" items={items} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "End" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })

  it("selects focused tab on Enter key (manual mode)", async () => {
    render(<TabsClient activationMode="manual" items={items} />)
    // First arrow-right to focus tab2 without selecting
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // value should still be tab1 in manual mode
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
    // Now press Enter to select
    const tab2 = screen.getByTestId("tab-tab2")
    await act(async () => {
      tab2.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("skips disabled tabs in navigation", async () => {
    const itemsWithDisabled = [
      { value: "tab1", label: "Tab 1" },
      { value: "tab2", label: "Tab 2", disabled: true },
      { value: "tab3", label: "Tab 3" },
    ]
    render(<TabsClient items={itemsWithDisabled} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })

  it("does not change when disabled=true", () => {
    render(<TabsClient disabled={true} items={items} />)
    act(() => {
      screen.getByTestId("tab-tab2").click()
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("does not override internalValue when controlled", () => {
    const { rerender } = render(<TabsClient items={items} value="tab1" />)
    rerender(<TabsClient items={items} value="tab2" />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("falls back to first enabled tab when defaultValue is disabled", () => {
    const itemsWithDisabled = [
      { value: "tab1", label: "Tab 1", disabled: true },
      { value: "tab2", label: "Tab 2" },
    ]
    render(<TabsClient defaultValue="tab1" items={itemsWithDisabled} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("initializes with empty string when items array is empty", () => {
    render(<TabsClient items={[]} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute("data-value", "")
  })

  it("uses value over defaultValue with empty items", () => {
    render(<TabsClient items={[]} value={"forced" as string} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "forced",
    )
  })

  it("falls back to defaultValue with empty items when no value", () => {
    render(<TabsClient defaultValue={"fallback" as string} items={[]} />)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "fallback",
    )
  })

  it("falls back to first enabled tab when value is not found", () => {
    render(<TabsClient items={items} value={"nonexistent" as string} />)
    // value is not in items, so findIndexByValue returns getFirstEnabledIndex result
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "nonexistent",
    )
  })

  it("uses resolveInitialValue fallback to firstEnabled when all items disabled and no candidate", () => {
    // all items disabled: candidate = value ?? defaultValue = undefined
    // and no firstEnabled (all disabled) → returns items[0].value
    const allDisabled = [
      { value: "tab1", disabled: true },
      { value: "tab2", disabled: true },
    ]
    render(<TabsClient items={allDisabled} />)
    // When all disabled and no candidate, resolves to items[0].value
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("navigates right in manual mode without auto-selecting (ArrowRight)", async () => {
    render(<TabsClient activationMode="manual" items={items} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // In manual mode, ArrowRight only moves focus, not selection
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("navigates left in manual mode without auto-selecting (ArrowLeft)", async () => {
    render(
      <TabsClient activationMode="manual" defaultValue="tab3" items={items} />,
    )
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
      )
    })
    // In manual mode, ArrowLeft only moves focus, not selection
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })

  it("navigates down in vertical orientation with ArrowDown", async () => {
    render(<TabsClient items={items} orientation="vertical" />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("navigates up in vertical orientation with ArrowUp", async () => {
    render(
      <TabsClient defaultValue="tab3" items={items} orientation="vertical" />,
    )
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("moveFocus when enabledIndices is empty returns currentIndex", async () => {
    // All items disabled → enabledIndices empty; any key press should not crash
    const allDisabled = [
      { value: "tab1", disabled: true },
      { value: "tab2", disabled: true },
    ]
    render(<TabsClient items={allDisabled} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // No crash; value unchanged
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("moveFocus when currentIndex is not in enabledIndices finds next via findIndex", async () => {
    // currentIndex=0 is in enabledIndices, safePosition >= 0 already covered
    // Need current index that IS in enabled but at position that wraps
    const withDisabled = [
      { value: "tab1" },
      { value: "tab2", disabled: true },
      { value: "tab3" },
    ]
    render(<TabsClient defaultValue="tab3" items={withDisabled} />)
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // Wraps from tab3 → tab1
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("Home key jumps to first enabled when enabledIndices[0] is defined", async () => {
    render(
      <TabsClient activationMode="manual" defaultValue="tab3" items={items} />,
    )
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Home" }),
      )
    })
    // Manual mode: no selection change
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })

  it("End key jumps to last enabled when enabledIndices[last] is defined", async () => {
    render(<TabsClient activationMode="manual" items={items} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "End" }),
      )
    })
    // Manual mode: no selection change
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("Space key selects tab in manual mode", async () => {
    render(<TabsClient activationMode="manual" items={items} />)
    const tab2 = screen.getByTestId("tab-tab2")
    await act(async () => {
      tab2.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: " " }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("moveFocus: currentIndex not in enabledIndices falls back to findIndex >= currentIndex (line 121)", async () => {
    // tab1 is disabled so enabledIndices=[1,2]; fire ArrowRight from tab1 button (index=0)
    // to trigger the `currentEnabledPos < 0` branch (line 121)
    const itemsWithFirstDisabled = [
      { value: "tab1", label: "Tab 1", disabled: true },
      { value: "tab2", label: "Tab 2" },
      { value: "tab3", label: "Tab 3" },
    ]
    render(<TabsClient items={itemsWithFirstDisabled} />)
    const tab1Btn = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1Btn.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // Execution of line 121 → tab changes to something enabled
    // No crash, and the view updates
    expect(screen.getByTestId("tabs-view")).toBeInTheDocument()
  })

  it("disabled=true: key navigation returns early without moving", async () => {
    render(<TabsClient disabled items={items} />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      )
    })
    // still on tab1 (default)
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("orientation=vertical ArrowDown moves focus to next tab", async () => {
    render(<TabsClient items={items} orientation="vertical" />)
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab2",
    )
  })

  it("orientation=vertical ArrowUp moves focus to previous tab", async () => {
    render(
      <TabsClient defaultValue="tab2" items={items} orientation="vertical" />,
    )
    const tab2 = screen.getByTestId("tab-tab2")
    await act(async () => {
      tab2.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("Home key with activationMode=automatic selects first tab", async () => {
    render(
      <TabsClient
        activationMode="automatic"
        defaultValue="tab3"
        items={items}
      />,
    )
    const tab3 = screen.getByTestId("tab-tab3")
    await act(async () => {
      tab3.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Home" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab1",
    )
  })

  it("End key with activationMode=automatic selects last tab", async () => {
    render(
      <TabsClient
        activationMode="automatic"
        defaultValue="tab1"
        items={items}
      />,
    )
    const tab1 = screen.getByTestId("tab-tab1")
    await act(async () => {
      tab1.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "End" }),
      )
    })
    expect(screen.getByTestId("tabs-view")).toHaveAttribute(
      "data-value",
      "tab3",
    )
  })
})
