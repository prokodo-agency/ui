import { throttleLayoutEffect } from "./effect"

describe("throttleLayoutEffect", () => {
  let rafCallback: ((time: number) => void) | undefined
  const mockRaf = jest.fn((cb: (time: number) => void) => {
    rafCallback = cb
    return 1
  })

  beforeEach(() => {
    rafCallback = undefined
    global.requestAnimationFrame = mockRaf
  })

  it("calls the callback via requestAnimationFrame on first call", () => {
    const callback = jest.fn()
    const throttled = throttleLayoutEffect(callback)

    throttled("arg1")
    expect(mockRaf).toHaveBeenCalledTimes(1)

    // Simulate RAF firing
    rafCallback?.(0)
    expect(callback).toHaveBeenCalledWith("arg1")
  })

  it("does not call RAF again while ticking", () => {
    const callback = jest.fn()
    const throttled = throttleLayoutEffect(callback)

    throttled()
    throttled() // second call while RAF pending — should be ignored
    expect(mockRaf).toHaveBeenCalledTimes(1)
  })

  it("resets ticking after RAF fires, allowing subsequent calls", () => {
    const callback = jest.fn()
    const throttled = throttleLayoutEffect(callback)

    throttled("first")
    rafCallback?.(0) // RAF fires, ticking = false

    mockRaf.mockClear()
    rafCallback = undefined as ((time: number) => void) | undefined

    throttled("second")
    expect(mockRaf).toHaveBeenCalledTimes(1)
    rafCallback?.(0)
    expect(callback).toHaveBeenCalledWith("second")
  })
})
