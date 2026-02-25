import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Calendly } from "./Calendly"
import { CalendlyView } from "./Calendly.view"

// Loading component mock used in CalendlyView
jest.mock("@/components/loading", () => ({
  Loading: () => <div aria-label="Loading" role="status" />,
}))

describe("Calendly", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders the calendly embed container", () => {
      const { container } = render(<CalendlyView calendlyId="john/30min" />)
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("[data-calendly]")).toBeInTheDocument()
    })

    it("renders loading spinner by default", () => {
      render(<CalendlyView calendlyId="john/30min" />)
      expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("hides loading spinner when hideLoading=true", () => {
      render(<CalendlyView hideLoading calendlyId="john/30min" />)
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })

    it("renders with minimum width style", () => {
      render(<CalendlyView calendlyId="john/30min" />)
      const embed = document.querySelector("[data-calendly]") as HTMLElement
      expect(embed?.style.minWidth).toBe("320px")
    })

    it("renders with custom height style", () => {
      render(<CalendlyView calendlyId="john/30min" />)
      const embed = document.querySelector("[data-calendly]") as HTMLElement
      expect(embed?.style.height).toBe("700px")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("calendly embed has no axe violations", async () => {
      const { container } = render(<CalendlyView calendlyId="john/30min" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("calendly without loading has no axe violations", async () => {
      const { container } = render(
        <CalendlyView hideLoading calendlyId="john/30min" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Calendly island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<Calendly calendlyId="user/schedule" />)
  })
})
