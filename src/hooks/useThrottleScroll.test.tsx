import { renderHook, act } from "@testing-library/react"

import { useThrottledScroll } from "./useThrottleScroll"

describe("useThrottledScroll", () => {
  let rafCallback: FrameRequestCallback | undefined

  beforeEach(() => {
    rafCallback = undefined
    global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
      rafCallback = cb
      return 1
    })
  })

  it("invokes the callback when a scroll event fires", () => {
    const callback = jest.fn()
    renderHook(() => useThrottledScroll(callback))

    act(() => {
      window.dispatchEvent(new Event("scroll"))
      rafCallback?.(0)
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("uses the latest callback reference after re-render", () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    const { rerender } = renderHook(
      ({ cb }: { cb: () => void }) => useThrottledScroll(cb),
      { initialProps: { cb: callback1 } },
    )

    rerender({ cb: callback2 })

    act(() => {
      window.dispatchEvent(new Event("scroll"))
      rafCallback?.(0)
    })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  it("removes the event listener on unmount", () => {
    const removeSpy = jest.spyOn(window, "removeEventListener")
    const callback = jest.fn()

    const { unmount } = renderHook(() => useThrottledScroll(callback))
    unmount()

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function))
  })
})
