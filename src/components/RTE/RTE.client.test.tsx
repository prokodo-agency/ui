/* eslint-disable testing-library/no-node-access, @typescript-eslint/no-explicit-any */
// RTE.client.test.tsx
//
// Strategy:
// - jest.mock() factories use no `document` (not allowed at hoisting time)
// - Instance setup (document.createElement etc.) is done in beforeEach
// - RTEView mock forwards surfaceRef + mountRef so Quill init runs
// - flushInit() flushes the async dynamic import via setTimeout(0)
// ---------------------------------------------------------------------------

import { render, act } from "@testing-library/react"
import React from "react"

// ── module-level state accessible in jest.mock factories (prefixed `mock`) ─
let mockQuillInst: any
let mockLastRTEProps: any = null

// ── minimal factories: no `document` usage inside jest.mock() ─────────────
jest.mock("quill/dist/quill", () => {
  const MockCtor: any = jest.fn()
  MockCtor.import = jest.fn()
  MockCtor.register = jest.fn()
  MockCtor.find = jest.fn()
  return { __esModule: true, default: MockCtor }
})

jest.mock("./RTE.theme", () => ({ __esModule: true, default: "" }))

jest.mock("./RTE.styles", () => ({ ensureQuillSnowStyles: jest.fn() }))

jest.mock("./RTE.utils", () => ({
  addClasses: jest.fn(),
  decorateToolbar: jest.fn(),
  syncPickerSelected: jest.fn(),
  cleanupQuill: jest.fn(),
}))

jest.mock("./RTE.view", () => ({ RTEView: jest.fn() }))

// ── imports after all mocks ────────────────────────────────────────────────
import RTEClient from "./RTE.client"

// ── helpers ───────────────────────────────────────────────────────────────
const flushInit = async () =>
  act(async () => {
    await new Promise<void>(r => setTimeout(r, 0))
  })

const getQuillMock = (): jest.Mock & {
  import: jest.Mock
  find: jest.Mock
  register: jest.Mock
} => jest.requireMock("quill/dist/quill").default

const getUtilsMock = () =>
  jest.requireMock("./RTE.utils") as {
    addClasses: jest.Mock
    decorateToolbar: jest.Mock
    syncPickerSelected: jest.Mock
    cleanupQuill: jest.Mock
  }

// ── fresh mock setup before each test ────────────────────────────────────
beforeEach(() => {
  mockLastRTEProps = null
  mockQuillInst = undefined

  // ── Quill constructor: build a fresh instance per construction ─────────
  const MockQuill = getQuillMock()
  MockQuill.mockImplementation(() => {
    mockQuillInst = {
      root: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        innerHTML: "",
      },
      container: document.createElement("div"),
      clipboard: { dangerouslyPasteHTML: jest.fn() },
      getText: jest.fn(() => ""),
      on: jest.fn(),
      hasFocus: jest.fn(() => false),
      getModule: jest.fn(() => ({ container: null, addBinding: jest.fn() })),
      update: jest.fn(),
      insertText: jest.fn(),
      formatLine: jest.fn(),
      setSelection: jest.fn(),
    }
    return mockQuillInst
  })
  MockQuill.import.mockReturnValue(
    class {
      static formats() {
        return {}
      }

      format() {}
    },
  )
  MockQuill.find.mockReturnValue(null)

  // ── RTEView forwards refs so init() can access mount/surface elements ──
  const { RTEView } = jest.requireMock("./RTE.view") as { RTEView: jest.Mock }
  RTEView.mockImplementation((props: any) => {
    mockLastRTEProps = props
    return (
      <div ref={props.surfaceRef} data-testid="rte-surface">
        <div className="ql-container" data-testid="ql-container" />
        <div ref={props.mountRef} data-testid="rte-mount" />
      </div>
    )
  })
})

// ── tests ─────────────────────────────────────────────────────────────────

describe("RTEClient – rendering", () => {
  it("renders RTEView and captures props", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(mockLastRTEProps).not.toBeNull()
  })

  it("forwards errorText to RTEView (checked before async init so emitValidation has not run)", async () => {
    // errorText initialises err via useState; we check BEFORE flushInit because
    // the init() effect calls emitValidation("") which resets err to undefined
    // when required is not set.
    render(<RTEClient errorText="required" label="Editor" name="rte" />)
    // After synchronous effects, err === "required" (init() async hasn't resolved yet)
    expect(mockLastRTEProps.errorText).toBe("required")
    await flushInit() // flush pending timers to avoid act() warning
  })

  it("showResize=false when disabled", async () => {
    render(<RTEClient disabled label="Editor" name="rte" />)
    await flushInit()
    expect(mockLastRTEProps.showResize).toBe(false)
  })

  it("showResize=false when readOnly", async () => {
    render(<RTEClient readOnly label="Editor" name="rte" />)
    await flushInit()
    expect(mockLastRTEProps.showResize).toBe(false)
  })

  it("showResize=true when active (not disabled, not readOnly)", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(mockLastRTEProps.showResize).toBe(true)
  })

  it("calls ensureQuillSnowStyles on mount", async () => {
    const { ensureQuillSnowStyles } = jest.requireMock("./RTE.styles") as {
      ensureQuillSnowStyles: jest.Mock
    }
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(ensureQuillSnowStyles).toHaveBeenCalledWith("")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – Quill initialisation", () => {
  it("Quill NOT instantiated when disabled=true", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient disabled label="Editor" name="rte" />)
    await flushInit()
    expect(MockQuill).not.toHaveBeenCalled()
  })

  it("Quill NOT instantiated when readOnly=true", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient readOnly label="Editor" name="rte" />)
    await flushInit()
    expect(MockQuill).not.toHaveBeenCalled()
  })

  it("Quill instantiated when active", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(MockQuill).toHaveBeenCalledTimes(1)
    expect(mockQuillInst).not.toBeNull()
    expect(mockQuillInst.on).toHaveBeenCalledWith(
      "text-change",
      expect.any(Function),
    )
  })

  it("rteOptions.onInit is called with the Quill instance after init", async () => {
    const onInit = jest.fn()
    render(<RTEClient label="Editor" name="rte" rteOptions={{ onInit }} />)
    await flushInit()
    expect(onInit).toHaveBeenCalledWith(mockQuillInst)
  })

  it("init() is skipped when mountRef is null (RTEView does not forward mountRef)", async () => {
    const MockQuill = getQuillMock()
    const { RTEView } = jest.requireMock("./RTE.view") as { RTEView: jest.Mock }
    RTEView.mockImplementationOnce((props: any) => {
      mockLastRTEProps = props
      return (
        <div ref={props.surfaceRef} data-testid="rte-surface">
          {/* No mountRef forwarding → mountRef.current stays null */}
          <div data-testid="rte-mount" />
        </div>
      )
    })
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(MockQuill).not.toHaveBeenCalled()
  })

  it("handles Quill.import() throwing gracefully (catch block)", async () => {
    const MockQuill = getQuillMock()
    MockQuill.import.mockImplementationOnce(() => {
      throw new Error("import failed")
    })
    render(<RTEClient label="Editor" name="rte" />)
    // Should not throw; Quill constructor still called
    await flushInit()
    expect(MockQuill).toHaveBeenCalledTimes(1)
  })

  it("loads initial value via dangerouslyPasteHTML when value is non-empty", async () => {
    render(<RTEClient label="Editor" name="rte" value="<p>hello</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).toHaveBeenCalledWith(
      "<p>hello</p>",
      "silent",
    )
  })

  it("does NOT call dangerouslyPasteHTML when value is empty string", async () => {
    render(<RTEClient label="Editor" name="rte" value="" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).not.toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – toolbar decoration with container", () => {
  const makeInstanceWithToolbar = (toolbarEl: HTMLElement) => {
    const MockQuill = getQuillMock()
    MockQuill.mockImplementationOnce(() => {
      mockQuillInst = {
        root: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          innerHTML: "",
        },
        container: document.createElement("div"),
        clipboard: { dangerouslyPasteHTML: jest.fn() },
        getText: jest.fn(() => ""),
        on: jest.fn(),
        hasFocus: jest.fn(() => false),
        getModule: jest.fn((name: string) => {
          if (name === "toolbar") return { container: toolbarEl }
          return { addBinding: jest.fn() }
        }),
        update: jest.fn(),
        insertText: jest.fn(),
        formatLine: jest.fn(),
        setSelection: jest.fn(),
      }
      return mockQuillInst
    })
  }

  it("calls decorateToolbar and syncPickerSelected for toolbar container", async () => {
    const toolbarEl = document.createElement("div")
    makeInstanceWithToolbar(toolbarEl)
    const { decorateToolbar, syncPickerSelected } = getUtilsMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    expect(decorateToolbar).toHaveBeenCalledWith(toolbarEl)
    expect(syncPickerSelected).toHaveBeenCalled()
  })

  it("toolbar MutationObserver triggers syncPickerSelected callback on class mutation", async () => {
    const toolbarEl = document.createElement("div")
    document.body.appendChild(toolbarEl)
    makeInstanceWithToolbar(toolbarEl)
    const { syncPickerSelected } = getUtilsMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const callsBefore = syncPickerSelected.mock.calls.length
    await act(async () => {
      toolbarEl.classList.add("ql-active")
      await new Promise<void>(r => setTimeout(r, 10))
    })
    expect(syncPickerSelected.mock.calls.length).toBeGreaterThan(callsBefore)
    document.body.removeChild(toolbarEl)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – container MutationObserver (tooltip)", () => {
  it("addClasses called when .ql-tooltip appended to q.container", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const { addClasses } = getUtilsMock()
    const callsBefore = addClasses.mock.calls.length
    const tooltip = document.createElement("div")
    tooltip.className = "ql-tooltip"
    await act(async () => {
      mockQuillInst.container.appendChild(tooltip)
      await new Promise<void>(r => setTimeout(r, 10))
    })
    expect(addClasses.mock.calls.length).toBeGreaterThan(callsBefore)
  })

  it("MutationObserver fires but if(t) is false when no .ql-tooltip child", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const { addClasses } = getUtilsMock()
    const callsBefore = addClasses.mock.calls.length
    // Append a non-tooltip element → MO fires but tooltip is not found
    const plain = document.createElement("div")
    await act(async () => {
      mockQuillInst.container.appendChild(plain)
      await new Promise<void>(r => setTimeout(r, 10))
    })
    expect(addClasses.mock.calls.length).toBe(callsBefore)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – container height initialisation", () => {
  it("sets 220px on .ql-container when it has no existing height", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const qlContainer = document.querySelector(
      "[data-testid='ql-container']",
    ) as HTMLElement
    expect(qlContainer?.style.height).toBe("220px")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – text-change event", () => {
  const getTextChangeCb = () =>
    mockQuillInst.on.mock.calls.find(
      (c: [string, ...unknown[]]) => c[0] === "text-change",
    )?.[1] as (...args: unknown[]) => void

  it("fires onChange when source='user'", async () => {
    const onChange = jest.fn()
    render(<RTEClient label="Editor" name="rte" onChange={onChange} />)
    await flushInit()
    mockQuillInst.getText.mockReturnValue("hello")
    mockQuillInst.root.innerHTML = "<p>hello</p>"
    await act(async () => {
      getTextChangeCb()(null, null, "user")
    })
    expect(onChange).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ text: expect.any(String) }),
    )
  })

  it("does NOT fire onChange when source='api'", async () => {
    const onChange = jest.fn()
    render(<RTEClient label="Editor" name="rte" onChange={onChange} />)
    await flushInit()
    await act(async () => {
      getTextChangeCb()(null, null, "api")
    })
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – keyboard binding handler", () => {
  const setupKeyboard = async () => {
    const mockKeyboard = { addBinding: jest.fn() }
    const MockQuill = getQuillMock()
    MockQuill.mockImplementationOnce(() => {
      mockQuillInst = {
        root: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          innerHTML: "",
        },
        container: document.createElement("div"),
        clipboard: { dangerouslyPasteHTML: jest.fn() },
        getText: jest.fn(() => ""),
        on: jest.fn(),
        hasFocus: jest.fn(() => false),
        getModule: jest.fn((name: string) => {
          if (name === "keyboard") return mockKeyboard
          return { container: null }
        }),
        update: jest.fn(),
        insertText: jest.fn(),
        formatLine: jest.fn(),
        setSelection: jest.fn(),
      }
      return mockQuillInst
    })
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    return mockKeyboard
  }

  it("header present → returns false, calls insertText + formatLine + setSelection", async () => {
    const keyboard = await setupKeyboard()
    const [[, handler]] = keyboard.addBinding.mock.calls
    const result = handler({ index: 5, length: 0 }, { format: { header: 2 } })
    expect(result).toBe(false)
    expect(mockQuillInst.insertText).toHaveBeenCalledWith(5, "\n", "user")
    expect(mockQuillInst.formatLine).toHaveBeenCalledWith(
      6,
      1,
      { header: false },
      "user",
    )
    expect(mockQuillInst.setSelection).toHaveBeenCalledWith(6, 0, "silent")
  })

  it("header absent → returns true, no insertText called", async () => {
    const keyboard = await setupKeyboard()
    const [[, handler]] = keyboard.addBinding.mock.calls
    const result = handler(
      { index: 5, length: 0 },
      { format: { header: false } },
    )
    expect(result).toBe(true)
    expect(mockQuillInst.insertText).not.toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – image alt-text click handler", () => {
  const getClickHandler = () =>
    mockQuillInst.root.addEventListener.mock.calls.find(
      (c: [string, ...unknown[]]) => c[0] === "click",
    )?.[1] as (ev: { target: Element | null }) => void

  it("click on non-IMG → no prompt called", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const promptSpy = jest.spyOn(window, "prompt").mockReturnValue(null)
    getClickHandler()({ target: document.createElement("div") })
    expect(promptSpy).not.toHaveBeenCalled()
  })

  it("click on IMG + prompt returns null → attribute unchanged", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const promptSpy = jest.spyOn(window, "prompt").mockReturnValue(null)
    const img = document.createElement("img")
    img.setAttribute("alt", "existing")
    getClickHandler()({ target: img })
    expect(promptSpy).toHaveBeenCalledWith("Alt text", "existing")
    expect(img).toHaveAttribute("alt", "existing")
  })

  it("click on IMG + blot found → calls blot.format", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    jest.spyOn(window, "prompt").mockReturnValue("accessible name")
    const mockBlot = { format: jest.fn() }
    getQuillMock().find.mockReturnValueOnce(mockBlot)
    const img = document.createElement("img")
    await act(async () => {
      getClickHandler()({ target: img })
    })
    expect(mockBlot.format).toHaveBeenCalledWith("alt", "accessible name")
    expect(mockQuillInst.update).toHaveBeenCalledWith("user")
  })

  it("click on IMG + blot.format throws → falls back to setAttribute", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    jest.spyOn(window, "prompt").mockReturnValue("fallback")
    getQuillMock().find.mockImplementationOnce(() => {
      throw new Error("blot error")
    })
    const img = document.createElement("img")
    await act(async () => {
      getClickHandler()({ target: img })
    })
    expect(img).toHaveAttribute("alt", "fallback")
  })

  it("click on IMG + prompt='' → removeAttribute alt", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    jest.spyOn(window, "prompt").mockReturnValue("")
    getQuillMock().find.mockReturnValueOnce(null)
    const img = document.createElement("img")
    img.setAttribute("alt", "to-remove")
    await act(async () => {
      getClickHandler()({ target: img })
    })
    expect(img).not.toHaveAttribute("alt")
  })

  it("Quill not created when disabled → no click handler registered", async () => {
    render(<RTEClient disabled label="Editor" name="rte" />)
    await flushInit()
    expect(mockQuillInst).toBeUndefined()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – startResize", () => {
  it("startResize with disabled returns early after prevent/stop", async () => {
    render(<RTEClient disabled label="Editor" name="rte" />)
    await flushInit()
    const evt = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      clientY: 0,
    }
    expect(() => mockLastRTEProps.onStartResize(evt)).not.toThrow()
    expect(evt.preventDefault).toHaveBeenCalled()
    expect(evt.stopPropagation).toHaveBeenCalled()
  })

  it("startResize with no .ql-container → no window.addEventListener('mousemove')", async () => {
    const { RTEView } = jest.requireMock("./RTE.view") as { RTEView: jest.Mock }
    RTEView.mockImplementationOnce((props: any) => {
      mockLastRTEProps = props
      return (
        <div ref={props.surfaceRef} data-testid="rte-surface">
          {/* no .ql-container */}
          <div ref={props.mountRef} data-testid="rte-mount" />
        </div>
      )
    })
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const addSpy = jest.spyOn(window, "addEventListener")
    const evt = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      clientY: 100,
    }
    await act(async () => {
      mockLastRTEProps.onStartResize(evt)
    })
    expect(addSpy).not.toHaveBeenCalledWith("mousemove", expect.any(Function))
  })

  it("startResize happy path → onMove updates height; onUp cleans up listeners", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    const addSpy = jest.spyOn(window, "addEventListener")
    const removeSpy = jest.spyOn(window, "removeEventListener")
    const evt = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      clientY: 100,
    }
    await act(async () => {
      mockLastRTEProps.onStartResize(evt)
    })
    expect(addSpy).toHaveBeenCalledWith("mousemove", expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith("mouseup", expect.any(Function))

    const onMoveFn = addSpy.mock.calls.find(c => c[0] === "mousemove")?.[1] as
      | EventListener
      | undefined
    const onUpFn = addSpy.mock.calls.find(c => c[0] === "mouseup")?.[1] as
      | EventListener
      | undefined

    const qlContainer = document.querySelector(
      "[data-testid='ql-container']",
    ) as HTMLElement

    // onMove: startY=100, clientY=150 → dy=50 → next=max(160,0+50)=160
    if (onMoveFn)
      await act(async () => {
        onMoveFn({ clientY: 150 } as unknown as Event)
      })
    expect(qlContainer?.style?.height).toBe("160px")

    // onUp: removes both window listeners
    if (onUpFn)
      await act(async () => {
        onUpFn({} as Event)
      })
    expect(removeSpy).toHaveBeenCalledWith("mousemove", onMoveFn)
    expect(removeSpy).toHaveBeenCalledWith("mouseup", onUpFn)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – external value sync", () => {
  it("syncs new value via dangerouslyPasteHTML when not focused", async () => {
    const { rerender } = render(
      <RTEClient label="Editor" name="rte" value="<p>initial</p>" />,
    )
    await flushInit()
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    mockQuillInst.hasFocus.mockReturnValue(false)
    rerender(<RTEClient label="Editor" name="rte" value="<p>updated</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).toHaveBeenCalledWith(
      "<p>updated</p>",
      "silent",
    )
  })

  it("skips sync when Quill has focus", async () => {
    const { rerender } = render(
      <RTEClient label="Editor" name="rte" value="<p>initial</p>" />,
    )
    await flushInit()
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    mockQuillInst.hasFocus.mockReturnValue(true)
    rerender(<RTEClient label="Editor" name="rte" value="<p>focused</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).not.toHaveBeenCalled()
  })

  it("skips sync when value is unchanged (next === htmlRef.current)", async () => {
    const { rerender } = render(
      <RTEClient label="Editor" name="rte" value="<p>same</p>" />,
    )
    await flushInit()
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    mockQuillInst.hasFocus.mockReturnValue(false)
    rerender(<RTEClient label="Editor" name="rte" value="<p>same</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).not.toHaveBeenCalled()
  })

  it("skips sync when value is null/undefined (isNull guard)", async () => {
    const { rerender } = render(
      <RTEClient label="Editor" name="rte" value="<p>initial</p>" />,
    )
    await flushInit()
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    rerender(<RTEClient label="Editor" name="rte" value={undefined} />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).not.toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – errorText sync effect", () => {
  it("errorText prop update flows to RTEView via setErr", async () => {
    const { rerender } = render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    rerender(<RTEClient errorText="new error" label="Editor" name="rte" />)
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {})
    await flushInit()
    expect(mockLastRTEProps.errorText).toBe("new error")
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – onBlur", () => {
  it("onBlur calls quillRef.current.getText for emitValidation", async () => {
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    mockQuillInst.getText.mockReturnValue("content")
    await act(async () => {
      mockLastRTEProps.onBlur({ target: null })
    })
    expect(mockQuillInst.getText).toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – cleanup on unmount", () => {
  it("cleanupQuill called on unmount", async () => {
    const { cleanupQuill } = getUtilsMock()
    const { unmount } = render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    await act(async () => {
      unmount()
    })
    expect(cleanupQuill).toHaveBeenCalled()
  })

  it("root.removeEventListener called with the click handler on unmount", async () => {
    const { unmount } = render(<RTEClient label="Editor" name="rte" />)
    await flushInit()
    await act(async () => {
      unmount()
    })
    expect(mockQuillInst.root.removeEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
    )
  })

  it("cleanupQuill still called when Quill was not initialised (disabled)", async () => {
    const { cleanupQuill } = getUtilsMock()
    const { unmount } = render(<RTEClient disabled label="Editor" name="rte" />)
    await flushInit()
    await act(async () => {
      unmount()
    })
    expect(cleanupQuill).toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – onFocus and onBlur prop forwarding", () => {
  it("onFocus prop is forwarded when RTEView fires onFocus", async () => {
    const onFocus = jest.fn()
    render(<RTEClient label="Editor" name="rte" onFocus={onFocus} />)
    await flushInit()
    await act(async () => {
      mockLastRTEProps.onFocus?.({ target: null })
    })
    expect(onFocus).toHaveBeenCalled()
  })

  it("onBlur prop is forwarded when RTEView fires onBlur", async () => {
    const onBlur = jest.fn()
    render(<RTEClient label="Editor" name="rte" onBlur={onBlur} />)
    await flushInit()
    await act(async () => {
      mockLastRTEProps.onBlur?.({ target: null })
    })
    expect(onBlur).toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – rteToolbar array merges with base toolbar", () => {
  it("uses [...baseToolbar, extraToolbar] when rteToolbar is a non-empty array", async () => {
    const MockQuill = getQuillMock()
    render(
      <RTEClient
        label="Editor"
        name="rte"
        rteToolbar={[["custom-btn"]] as any}
      />,
    )
    await flushInit()
    const opts = MockQuill.mock.calls[0]?.[1] as Record<string, any>
    // toolbar should be the merged array (length > 5 base items)
    expect(Array.isArray(opts?.modules?.toolbar)).toBe(true)
    expect((opts?.modules?.toolbar as unknown[]).length).toBeGreaterThan(5)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – rteOptions modules history/clipboard", () => {
  it("passes rteOptions.modules.history to Quill constructor", async () => {
    const MockQuill = getQuillMock()
    render(
      <RTEClient
        label="Editor"
        name="rte"
        rteOptions={{ modules: { history: { maxStack: 50 }, clipboard: {} } }}
      />,
    )
    await flushInit()
    const opts = MockQuill.mock.calls[0]?.[1] as Record<string, any>
    expect(opts?.modules?.history?.maxStack).toBe(50)
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – ImageWithAlt class methods", () => {
  it("ImageWithAlt.formats() collects alt and title from domNode", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()

    // Quill.register was called with ("formats/image", ImageWithAlt, true)
    const registerCall = MockQuill.register.mock.calls.find(
      (c: unknown[]) => c[0] === "formats/image",
    )
    const ImageWithAlt = registerCall?.[1] as any
    expect(ImageWithAlt).toBeDefined()

    const domNode = document.createElement("img")
    domNode.setAttribute("alt", "test alt")
    domNode.setAttribute("title", "test title")

    const formats = ImageWithAlt.formats(domNode)
    expect(formats.alt).toBe("test alt")
    expect(formats.title).toBe("test title")
  })

  it("ImageWithAlt.formats() omits alt/title when attributes absent", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()

    const registerCall = MockQuill.register.mock.calls.find(
      (c: unknown[]) => c[0] === "formats/image",
    )
    const ImageWithAlt = registerCall?.[1] as any
    const domNode = document.createElement("img")
    // No alt/title attributes
    const formats = ImageWithAlt.formats(domNode)
    expect(formats.alt).toBeUndefined()
    expect(formats.title).toBeUndefined()
  })

  it("ImageWithAlt.format() sets and removes alt/title on domNode", async () => {
    const MockQuill = getQuillMock()
    render(<RTEClient label="Editor" name="rte" />)
    await flushInit()

    const registerCall = MockQuill.register.mock.calls.find(
      (c: unknown[]) => c[0] === "formats/image",
    )
    const ImageWithAlt = registerCall?.[1] as any

    const domNode = document.createElement("img")
    // Create instance without a full Blot constructor; manually assign domNode
    const inst = Object.create(ImageWithAlt.prototype) as any
    inst.domNode = domNode

    // set alt
    inst.format("alt", "new alt")
    expect(domNode).toHaveAttribute("alt", "new alt")

    // remove alt (empty string)
    inst.format("alt", "")
    expect(domNode).not.toHaveAttribute("alt")

    // set title
    inst.format("title", "my title")
    expect(domNode).toHaveAttribute("title", "my title")

    // remove title
    inst.format("title", "")
    expect(domNode).not.toHaveAttribute("title")

    // other name → falls through to super.format (mock BaseImage.format is no-op)
    expect(() => inst.format("class", "foo")).not.toThrow()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – onValidate forwarding", () => {
  it("onValidate is called after init emits validation", async () => {
    const onValidate = jest.fn()
    render(<RTEClient label="Editor" name="rte" onValidate={onValidate} />)
    await flushInit()
    // emitValidation is triggered during init() via emitValidation(q.getText()…)
    // which calls handleValidation, which calls onValidate via the callback
    expect(onValidate).toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────

describe("RTEClient – external value put-back skip", () => {
  it("skips dangerouslyPasteHTML when value echoes last user-typed html", async () => {
    const getTextChangeCb = () =>
      mockQuillInst.on.mock.calls.find(
        (c: [string, ...unknown[]]) => c[0] === "text-change",
      )?.[1] as (...args: unknown[]) => void

    const { rerender } = render(
      <RTEClient label="Editor" name="rte" value="<p>A</p>" />,
    )
    await flushInit()

    // Simulate user typing "B" → syncFromQuill sets lastEmittedHtml="<p>B</p>"
    mockQuillInst.root.innerHTML = "<p>B</p>"
    await act(async () => {
      getTextChangeCb()(null, null, "user")
    })

    // Parent overrides to "<p>C</p>" → pastes it (htmlRef becomes "<p>C</p>")
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    mockQuillInst.hasFocus.mockReturnValue(false)
    rerender(<RTEClient label="Editor" name="rte" value="<p>C</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).toHaveBeenCalledWith(
      "<p>C</p>",
      "silent",
    )

    // Now parent echoes back the user-typed value "<p>B</p>"
    // next="<p>B</p>", htmlRef.current="<p>C</p>", lastEmitted="<p>B</p>"
    // → hits the put-back guard: htmlRef.current = next; return (no paste)
    mockQuillInst.clipboard.dangerouslyPasteHTML.mockClear()
    rerender(<RTEClient label="Editor" name="rte" value="<p>B</p>" />)
    await flushInit()
    expect(mockQuillInst.clipboard.dangerouslyPasteHTML).not.toHaveBeenCalled()
  })
})
