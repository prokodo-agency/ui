import { act, render, screen } from "@/tests"

let capturedAddProps: Record<string, unknown> = {}
let capturedDeleteProps: Record<string, unknown> = {}
let capturedFields: unknown[] = []
let capturedValue: unknown[] = []

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedAddProps = (props.buttonAddProps as Record<string, unknown>) ?? {}
  capturedDeleteProps =
    (props.buttonDeleteProps as Record<string, unknown>) ?? {}
  capturedFields = (props.fields as unknown[]) ?? []
  capturedValue = (props.value as unknown[]) ?? []
  return (
    <div
      data-count={String(capturedValue.length)}
      data-testid="dynamiclist-view"
    >
      <button data-testid="add-btn" onClick={capturedAddProps.onClick as never}>
        Add
      </button>
      {capturedValue.map((_, i) => (
        <button
          key={i}
          data-index={String(i)}
          data-testid={`delete-btn-${i}`}
          onClick={e => {
            ;(capturedDeleteProps.onClick as (e: unknown, i: number) => void)?.(
              e,
              i,
            )
          }}
        >
          Delete {i}
        </button>
      ))}
    </div>
  )
})

jest.mock("./DynamicList.view", () => ({ DynamicListView: mockView }))

const DynamicListClient = require("./DynamicList.client").default

const singleField = [{ fieldType: "input" as const, name: "email" }]
const multiFields = [
  { fieldType: "input" as const, name: "first" },
  { fieldType: "input" as const, name: "last" },
]

beforeEach(() => {
  mockView.mockClear()
  capturedAddProps = {}
  capturedDeleteProps = {}
  capturedFields = []
  capturedValue = []
})

describe("DynamicList.client", () => {
  it("renders with empty items by default", () => {
    render(<DynamicListClient fields={singleField} />)
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "0",
    )
  })

  it("initializes with controlled items", () => {
    render(
      <DynamicListClient
        fields={singleField}
        value={["a@b.com", "c@d.com"] as never}
      />,
    )
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "2",
    )
  })

  it("adds a single-field empty string item", async () => {
    render(<DynamicListClient fields={singleField} />)
    await act(async () => {
      screen
        .getByTestId("add-btn")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "1",
    )
  })

  it("adds a multi-field empty object item", async () => {
    render(<DynamicListClient fields={multiFields} />)
    await act(async () => {
      screen
        .getByTestId("add-btn")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "1",
    )
  })

  it("calls onChange after adding item", async () => {
    const onChangeMock = jest.fn()
    render(<DynamicListClient fields={singleField} onChange={onChangeMock} />)
    await act(async () => {
      screen
        .getByTestId("add-btn")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(onChangeMock).toHaveBeenCalledWith([""])
  })

  it("deletes item by index", async () => {
    render(
      <DynamicListClient
        fields={singleField}
        value={["a@b.com", "c@d.com"] as never}
      />,
    )
    const deleteBtn = screen.getByTestId("delete-btn-0")
    deleteBtn.setAttribute("data-index", "0")
    await act(async () => {
      deleteBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "1",
    )
  })

  it("calls onChange on delete", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={singleField}
        value={["a@b.com", "c@d.com"] as never}
        onChange={onChangeMock}
      />,
    )
    await act(async () => {
      screen
        .getByTestId("delete-btn-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(onChangeMock).toHaveBeenCalledWith(["c@d.com"])
  })

  it("handles input change via formatedField onChange (single-field)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={singleField}
        value={["old"] as never}
        onChange={onChangeMock}
      />,
    )
    const inputField = capturedFields[0] as { onChange?: (e: unknown) => void }
    await act(async () => {
      inputField.onChange?.({
        target: {
          dataset: { index: "0", field: "email" },
          value: "new@email.com",
        },
      })
    })
    expect(onChangeMock).toHaveBeenCalledWith(["new@email.com"])
  })

  it("handles input change for multi-field item", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={multiFields}
        value={[{ first: "John", last: "Doe" }] as never}
        onChange={onChangeMock}
      />,
    )
    const inputField = capturedFields[0] as { onChange?: (e: unknown) => void }
    await act(async () => {
      inputField.onChange?.({
        target: { dataset: { index: "0", field: "first" }, value: "Jane" },
      })
    })
    expect(onChangeMock).toHaveBeenCalledWith([{ first: "Jane", last: "Doe" }])
  })

  it("syncs controlled value changes", async () => {
    const { rerender } = render(
      <DynamicListClient fields={singleField} value={["a"] as never} />,
    )
    rerender(
      <DynamicListClient fields={singleField} value={["a", "b"] as never} />,
    )
    expect(screen.getByTestId("dynamiclist-view")).toHaveAttribute(
      "data-count",
      "2",
    )
  })
})

const selectField = [
  {
    fieldType: "select" as const,
    name: "category",
    options: [{ label: "Tech", value: "tech" }],
  },
]

describe("DynamicList.client – select field (handleSelectChange + formatedFields)", () => {
  it("maps select fieldType to a wrapped onChange in formatedFields", () => {
    render(<DynamicListClient fields={selectField} value={["tech"] as never} />)
    const selectF = capturedFields[0] as { fieldType: string }
    expect(selectF.fieldType).toBe("select")
  })

  it("handleSelectChange with string value (single-field select)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, "art")
    })
    expect(onChangeMock).toHaveBeenCalledWith(["art"])
  })

  it("handleSelectChange with array value (single-field select)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, ["art"])
    })
    expect(onChangeMock).toHaveBeenCalledWith(["art"])
  })

  it("handleSelectChange with null value (single-field select clears)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, null)
    })
    expect(onChangeMock).toHaveBeenCalledWith([""])
  })

  it("handleSelectChange with empty string value (single-field select clears)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, "")
    })
    expect(onChangeMock).toHaveBeenCalledWith([""])
  })

  it("handleSelectChange with multi-field select updates object", async () => {
    const onChangeMock = jest.fn()
    const multiSelectFields = [
      { fieldType: "select" as const, name: "color" },
      { fieldType: "input" as const, name: "size" },
    ]
    render(
      <DynamicListClient
        fields={multiSelectFields}
        value={[{ color: "red", size: "s" }] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, "blue")
    })
    expect(onChangeMock).toHaveBeenCalledWith([{ color: "blue", size: "s" }])
  })

  it("handleSelectChange with empty string in multi-field deletes the key", async () => {
    const onChangeMock = jest.fn()
    const multiSelectFields = [
      { fieldType: "select" as const, name: "color" },
      { fieldType: "input" as const, name: "size" },
    ]
    render(
      <DynamicListClient
        fields={multiSelectFields}
        value={[{ color: "red", size: "s" }] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, "")
    })
    // color key should be deleted
    expect(onChangeMock).toHaveBeenCalledWith([{ size: "s" }])
  })

  it("handleSelectChange with NaN index (invalid dataset.index) does nothing", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.(
        { target: { dataset: { index: "not-a-number" } } },
        "art",
      )
    })
    expect(onChangeMock).not.toHaveBeenCalled()
  })
})

describe("DynamicList.client – edge case branches (early returns + callbacks)", () => {
  it("handleChange ignores event with NaN index (line 52 early return)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={singleField}
        value={["old"] as never}
        onChange={onChangeMock}
      />,
    )
    const inputF = capturedFields[0] as { onChange?: (e: unknown) => void }
    await act(async () => {
      inputF.onChange?.({
        target: {
          dataset: { index: "not-a-number", field: "email" },
          value: "new",
        },
      })
    })
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("handleChange with multi-item list covers i !== idx branch (line 55)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={singleField}
        value={["a", "b"] as never}
        onChange={onChangeMock}
      />,
    )
    const inputF = capturedFields[0] as { onChange?: (e: unknown) => void }
    await act(async () => {
      inputF.onChange?.({
        target: { dataset: { index: "0", field: "email" }, value: "new" },
      })
    })
    // item at index 1 should remain "b"
    expect(onChangeMock).toHaveBeenCalledWith(["new", "b"])
  })

  it("handleSelectChange with empty array value (v[0] ?? '' branch)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, [])
    })
    // empty array → v[0] = undefined → "" fallback
    expect(onChangeMock).toHaveBeenCalledWith([""])
  })

  it("handleSelectChange with multi-item list covers i !== idx branch (line 76)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={selectField}
        value={["tech", "art"] as never}
        onChange={onChangeMock}
      />,
    )
    const selectF = capturedFields[0] as {
      onChange?: (e: unknown, v: unknown) => void
    }
    await act(async () => {
      selectF.onChange?.({ target: { dataset: { index: "0" } } }, "design")
    })
    expect(onChangeMock).toHaveBeenCalledWith(["design", "art"])
  })

  it("calls buttonAddProps.onClick when Add is clicked (line 116)", async () => {
    const addClickMock = jest.fn()
    render(
      <DynamicListClient
        buttonAddProps={{ onClick: addClickMock } as never}
        fields={singleField}
      />,
    )
    await act(async () => {
      screen
        .getByTestId("add-btn")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(addClickMock).toHaveBeenCalled()
  })

  it("handleDelete ignores NaN index (line 125 early return)", async () => {
    const onChangeMock = jest.fn()
    render(
      <DynamicListClient
        fields={singleField}
        value={["a"] as never}
        onChange={onChangeMock}
      />,
    )
    const deleteBtn = screen.getByTestId("delete-btn-0")
    deleteBtn.removeAttribute("data-index")
    await act(async () => {
      deleteBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("calls buttonDeleteProps.onClick when Delete is clicked (line 130)", async () => {
    const deleteClickMock = jest.fn()
    render(
      <DynamicListClient
        buttonDeleteProps={{ onClick: deleteClickMock } as never}
        fields={singleField}
        value={["a"] as never}
      />,
    )
    await act(async () => {
      screen
        .getByTestId("delete-btn-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(deleteClickMock).toHaveBeenCalled()
  })
})
