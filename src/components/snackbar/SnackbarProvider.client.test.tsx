import React from "react"

import { act, render, screen, fireEvent } from "@/tests"

import SnackbarProvider, { useSnackbar } from "./SnackbarProvider.client"

import type { SnackbarContextValue } from "./SnackbarProvider.context"

// jsdom may not implement crypto.randomUUID — provide a simple stub
if (!globalThis.crypto?.randomUUID) {
  let _counter = 0
  Object.defineProperty(globalThis, "crypto", {
    value: { ...globalThis.crypto, randomUUID: () => `uuid-${++_counter}` },
    writable: true,
  })
}

// Mock Snackbar so we only test SnackbarProvider logic, not Snackbar rendering
jest.mock("./Snackbar", () => ({
  Snackbar: ({
    message,
    onClose,
  }: {
    message?: string
    onClose?: () => void
  }) => (
    <div data-message={message} data-testid="snackbar">
      <button data-testid="snackbar-close" onClick={onClose}>
        close
      </button>
    </div>
  ),
}))

// Helper: renders SnackbarProvider and captures the context value
function TestHarness({
  onCtx,
  onRender,
}: {
  onCtx?: (ctx: SnackbarContextValue) => void
  onRender?: () => void
}) {
  const ctx = useSnackbar()
  onCtx?.(ctx)
  onRender?.()
  return null
}

describe("SnackbarProvider.client", () => {
  it("provides enqueue and close via context", () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    expect(typeof captured?.enqueue).toBe("function")
    expect(typeof captured?.close).toBe("function")
  })

  it("enqueues a snackbar and renders it", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    await act(async () => {
      captured!.enqueue({ message: "Hello" })
    })
    expect(screen.getAllByTestId("snackbar").length).toBe(1)
    expect(screen.getByTestId("snackbar")).toHaveAttribute(
      "data-message",
      "Hello",
    )
  })

  it("enqueue returns the provided id when given", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    let id: string | undefined
    await act(async () => {
      id = captured!.enqueue({ message: "Hi", id: "my-id" })
    })
    expect(id).toBe("my-id")
  })

  it("enqueue returns an auto-generated id when none provided", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    let id: string | undefined
    await act(async () => {
      id = captured!.enqueue({ message: "Hi" })
    })
    expect(typeof id).toBe("string")
    expect(id!.length).toBeGreaterThan(0)
  })

  it("close removes a snackbar by id", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    let id: string | undefined
    await act(async () => {
      id = captured!.enqueue({ message: "ToBeClosed" })
    })
    expect(screen.getAllByTestId("snackbar").length).toBe(1)
    await act(async () => {
      captured!.close(id!)
    })
    expect(screen.queryAllByTestId("snackbar").length).toBe(0)
  })

  it("snackbar-close button triggers removal", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    await act(async () => {
      captured!.enqueue({ message: "AutoClose" })
    })
    fireEvent.click(screen.getByTestId("snackbar-close"))
    expect(screen.queryAllByTestId("snackbar").length).toBe(0)
  })

  it("respects maxSnack limit by dropping oldest", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider maxSnack={2}>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    await act(async () => {
      captured!.enqueue({ message: "First", id: "1" })
      captured!.enqueue({ message: "Second", id: "2" })
      captured!.enqueue({ message: "Third", id: "3" }) // should drop "First"
    })
    const snacks = screen.getAllByTestId("snackbar")
    expect(snacks.length).toBe(2)
    expect(snacks[0]).toHaveAttribute("data-message", "Second")
    expect(snacks[1]).toHaveAttribute("data-message", "Third")
  })

  it("groups snackbars by anchorOrigin", async () => {
    let captured: SnackbarContextValue | undefined
    render(
      <SnackbarProvider>
        <TestHarness onCtx={ctx => (captured = ctx)} />
      </SnackbarProvider>,
    )
    await act(async () => {
      captured!.enqueue({
        message: "Top",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      })
      captured!.enqueue({
        message: "Bottom",
        anchorOrigin: { vertical: "bottom", horizontal: "left" },
      })
    })
    // Both snackbars are rendered, in their own group containers
    expect(screen.getAllByTestId("snackbar").length).toBe(2)
  })

  it("useSnackbar outside provider returns no-op enqueue returning empty string", async () => {
    let captured: SnackbarContextValue | undefined
    render(<TestHarness onCtx={ctx => (captured = ctx)} />)
    let id: string | undefined
    await act(async () => {
      id = captured!.enqueue({ message: "noop" })
    })
    expect(id).toBe("")
  })

  it("useSnackbar outside provider close is a no-op that does not throw", async () => {
    let captured: SnackbarContextValue | undefined
    render(<TestHarness onCtx={ctx => (captured = ctx)} />)
    // The default context `close` is a no-op; calling it must not throw
    await act(async () => {
      expect(() => captured!.close("any-id")).not.toThrow()
    })
  })
})
