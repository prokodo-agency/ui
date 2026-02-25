import { axe } from "jest-axe"
import { act } from "react"

import { render, screen } from "@/tests"

// jsdom does not provide IntersectionObserver – polyfill before imports that use it
let intersectionCallback:
  | ((entries: Partial<IntersectionObserverEntry>[]) => void)
  | null = null

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(callback => {
    intersectionCallback = callback as (
      entries: Partial<IntersectionObserverEntry>[],
    ) => void
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }
  }) as unknown as typeof IntersectionObserver
})

// Lottie uses lazily-loaded @lottiefiles/dotlottie-react - mock to avoid DOM issues
jest.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div data-testid="dotlottie" />,
}))

import { Lottie } from "./Lottie"

describe("Lottie", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a container element", () => {
      const { container } = render(
        <Lottie animation="/animations/loader.lottie" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("applies containerClassName", () => {
      const { container } = render(
        <Lottie
          animation="/animations/loader.lottie"
          containerClassName="custom-container"
        />,
      )
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector(".custom-container")).toBeTruthy()
    })

    it("renders without crashing for missing lazy module", () => {
      const { container } = render(
        <Lottie
          animation="/animations/success.lottie"
          className="custom-anim"
        />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("returns null when no animation prop provided", () => {
      const { container } = render(<Lottie animation={undefined as never} />)
      expect(container).toBeEmptyDOMElement()
    })

    it("renders DotLottieReact when IntersectionObserver fires isIntersecting=true", async () => {
      render(<Lottie animation="/animations/loader.lottie" />)
      // Simulate intersection
      await act(async () => {
        intersectionCallback?.([{ isIntersecting: true }])
      })
      // Flush lazy import promises
      await Promise.resolve()
      // The mock DotLottieReact renders a div with data-testid="dotlottie"
      expect(screen.getByTestId("dotlottie")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("lottie container has no axe violations", async () => {
      const { container } = render(
        <Lottie animation="/animations/loader.lottie" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
