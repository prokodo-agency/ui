import { renderHook } from "@testing-library/react"
import React from "react"

import { render, screen } from "@/tests"

import { UIRuntimeProvider, useUIRuntime } from "./runtime.client"

describe("UIRuntimeProvider and useUIRuntime", () => {
  it("provides default empty context when no provider is present", () => {
    const { result } = renderHook(() => useUIRuntime())
    expect(result.current).toEqual({})
  })

  it("provides the given context value to consumers", () => {
    const mockLink = () => null
    const mockImage = () => null
    const value = { linkComponent: mockLink, imageComponent: mockImage }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UIRuntimeProvider value={value}>{children}</UIRuntimeProvider>
    )

    const { result } = renderHook(() => useUIRuntime(), { wrapper })

    expect(result.current.linkComponent).toBe(mockLink)
    expect(result.current.imageComponent).toBe(mockImage)
  })

  it("renders children through UIRuntimeProvider", () => {
    const Child = () => <div data-testid="child">Hello</div>
    render(
      <UIRuntimeProvider value={{}}>
        <Child />
      </UIRuntimeProvider>,
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })
})
