/* eslint-disable testing-library/no-container, import/no-named-as-default-member */
import React from "react"

import { act, render, screen, fireEvent } from "@/tests"

import type { CarouselRef } from "./Carousel.model"

// ── mocks ─────────────────────────────────────────────────────────────────────
jest.mock("@/components/button", () => ({
  Button: ({
    onClick,
    "aria-label": label,
  }: {
    onClick: () => void
    "aria-label": string
  }) => (
    <button data-testid={`btn-${label}`} onClick={onClick}>
      {label}
    </button>
  ),
}))

jest.mock("@/components/lottie", () => ({
  Lottie: () => <div data-testid="lottie" />,
}))

jest.mock("@/components/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}))

jest.mock("@/hooks/useResponsiveValue", () => ({
  useResponsiveValue: ({ fallback }: { fallback: number }) => ({
    value: fallback,
    ref: { current: null },
  }),
}))

jest.mock(
  "./Carousel.module.scss",
  () => new Proxy({}, { get: (_t, k) => String(k) }),
)

const CarouselClient = require("./Carousel.client").default

describe("Carousel.client", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it("renders Skeleton when no children provided", () => {
    render(<CarouselClient />)
    expect(screen.getByTestId("skeleton")).toBeInTheDocument()
  })

  it("renders wrapper and items for given children", () => {
    render(
      <CarouselClient>
        <span data-testid="slide-a">A</span>
        <span data-testid="slide-b">B</span>
      </CarouselClient>,
    )
    // each child appears at least once (extended array has 3 copies for 2 children + 1 clone each side)
    expect(screen.getAllByTestId("slide-a").length).toBeGreaterThan(0)
    expect(screen.getAllByTestId("slide-b").length).toBeGreaterThan(0)
  })

  it("shows mobile hint initially and hides it after 1500 ms", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
      </CarouselClient>,
    )
    // hint div exists before timeout
    const hintBefore = container.querySelectorAll('[class*="mobile__tutorial"]')
    expect(hintBefore.length).toBeGreaterThan(0)

    act(() => {
      jest.advanceTimersByTime(1500)
    })
    // After 1500 ms the is-hidden modifier is applied
    const hintAfter = container.querySelectorAll('[class*="is-hidden"]')
    expect(hintAfter.length).toBeGreaterThan(0)
  })

  it("slides to NEXT via ArrowRight key", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    const initialTransform = (
      carousel.querySelector('[class*="wrapper"]') as HTMLElement
    )?.style.transform

    fireEvent.keyDown(carousel, { key: "ArrowRight" })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    const updatedTransform = (
      carousel.querySelector('[class*="wrapper"]') as HTMLElement
    )?.style.transform
    expect(updatedTransform).not.toBe(initialTransform)
  })

  it("slides to PREV via ArrowLeft key", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    const initialTransform = (
      carousel.querySelector('[class*="wrapper"]') as HTMLElement
    )?.style.transform

    fireEvent.keyDown(carousel, { key: "ArrowLeft" })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    const updatedTransform = (
      carousel.querySelector('[class*="wrapper"]') as HTMLElement
    )?.style.transform
    expect(updatedTransform).not.toBe(initialTransform)
  })

  it("shows prev/next buttons when enableControl=true", () => {
    render(
      <CarouselClient enableControl>
        <span>A</span>
      </CarouselClient>,
    )
    expect(screen.getByTestId("btn-previous")).toBeInTheDocument()
    expect(screen.getByTestId("btn-next")).toBeInTheDocument()
  })

  it("does not show control buttons when enableControl=false", () => {
    render(
      <CarouselClient enableControl={false}>
        <span>A</span>
      </CarouselClient>,
    )
    expect(screen.queryByTestId("btn-previous")).not.toBeInTheDocument()
    expect(screen.queryByTestId("btn-next")).not.toBeInTheDocument()
  })

  it("slides NEXT when next button clicked", () => {
    const { container } = render(
      <CarouselClient enableControl>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const wrapper = container.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    fireEvent.click(screen.getByTestId("btn-next"))
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("shows dots by default (enableDots=true)", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const dots = container.querySelectorAll('[class*="dots__dot"]')
    expect(dots.length).toBe(2)
  })

  it("hides dots when enableDots=false", () => {
    const { container } = render(
      <CarouselClient enableDots={false}>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    expect(container.querySelectorAll('[class*="dots__dot"]').length).toBe(0)
  })

  it("slideTo via dot click navigates to that slide", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </CarouselClient>,
    )
    const wrapper = container.querySelector('[class*="wrapper"]') as HTMLElement
    const dots = container.querySelectorAll('[class*="dots__dot"]')
    const before = wrapper?.style.transform

    fireEvent.click(dots[2] as HTMLElement)
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("dot Enter key also calls slideTo", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const wrapper = container.querySelector('[class*="wrapper"]') as HTMLElement
    // Use second dot (index 1) → slideTo(1) → current=2 ≠ initial current=1
    const dots = container.querySelectorAll('[class*="dots__dot"]')
    const dot = dots[1] as HTMLElement
    const before = wrapper?.style.transform

    fireEvent.keyDown(dot, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("imperative ref slidePrev and slideNext work", async () => {
    const ref = React.createRef<CarouselRef>()
    const { container } = render(
      <CarouselClient ref={ref}>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const wrapper = container.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    await act(async () => {
      ref.current?.slideNext()
    })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(wrapper?.style.transform).not.toBe(before)

    const after = wrapper?.style.transform
    await act(async () => {
      ref.current?.slidePrev()
    })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(wrapper?.style.transform).not.toBe(after)
  })

  it("imperative ref exposes carouselContainer", () => {
    const ref = React.createRef<CarouselRef>()
    render(
      <CarouselClient ref={ref}>
        <span>A</span>
      </CarouselClient>,
    )
    // may be null in jsdom but prop should exist on ref
    expect("carouselContainer" in (ref.current ?? {})).toBe(true)
  })

  it("autoplay advances slide on interval", () => {
    const { container } = render(
      <CarouselClient autoplay={500}>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const wrapper = container.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    act(() => {
      jest.advanceTimersByTime(500)
    })
    act(() => {
      jest.advanceTimersByTime(300)
    }) // settle transition
    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("pauses autoplay on mouseEnter, resumes on mouseLeave", () => {
    const { container } = render(
      <CarouselClient autoplay={500}>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    const wrapper = carousel.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    fireEvent.mouseEnter(carousel)
    act(() => {
      jest.advanceTimersByTime(1000)
    }) // no autoplay while paused
    expect(wrapper?.style.transform).toBe(before)

    fireEvent.mouseLeave(carousel)
    act(() => {
      jest.advanceTimersByTime(500)
    })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("calls onKeyDown prop on key event", () => {
    const onKeyDown = jest.fn()
    const { container } = render(
      <CarouselClient onKeyDown={onKeyDown}>
        <span>A</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    fireEvent.keyDown(carousel, { key: "ArrowRight" })
    expect(onKeyDown).toHaveBeenCalled()
  })

  it("touch swipe right (NEXT) via touchStart+touchMove+touchEnd", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    const wrapper = carousel.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    fireEvent.touchStart(carousel, {
      targetTouches: [{ clientX: 200 }],
    })
    fireEvent.touchMove(carousel, { targetTouches: [{ clientX: 100 }] })
    fireEvent.touchEnd(carousel)
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(wrapper?.style.transform).not.toBe(before)
  })

  it("mouse drag right (NEXT) via mouseDown+mouseUp", () => {
    const { container } = render(
      <CarouselClient>
        <span>A</span>
        <span>B</span>
      </CarouselClient>,
    )
    const carousel = container.querySelector('[role="group"]') as HTMLElement
    const wrapper = carousel.querySelector('[class*="wrapper"]') as HTMLElement
    const before = wrapper?.style.transform

    fireEvent.mouseDown(carousel, { clientX: 300 })
    fireEvent.mouseUp(carousel, { clientX: 200 })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(wrapper?.style.transform).not.toBe(before)
  })
})
