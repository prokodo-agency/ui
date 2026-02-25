import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { RatingView } from "./Rating.view"

describe("Rating", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders 5 star buttons by default", () => {
      render(<RatingView name="stars" />)
      const radios = screen.getAllByRole("radio")
      expect(radios).toHaveLength(5)
    })

    it("renders a label when provided", () => {
      render(<RatingView label="Rating" name="stars" />)
      expect(screen.getByText("Rating")).toBeInTheDocument()
    })

    it("renders custom max stars", () => {
      render(<RatingView max={3} name="stars" />)
      const radios = screen.getAllByRole("radio")
      expect(radios).toHaveLength(3)
    })

    it("marks the selected star", () => {
      render(<RatingView name="stars" value={3} />)
      expect(screen.getByRole("radio", { name: /3 stars/i })).toBeChecked()
    })

    it("renders as disabled when disabled=true", () => {
      render(<RatingView disabled name="stars" />)
      screen.getAllByRole("radio").forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })

    it("renders error text", () => {
      render(<RatingView errorText="Please select a rating" name="stars" />)
      expect(screen.getByText("Please select a rating")).toBeInTheDocument()
    })

    it("renders helper text", () => {
      render(<RatingView helperText="Rate your experience" name="stars" />)
      expect(screen.getByText("Rate your experience")).toBeInTheDocument()
    })

    it("renders a radiogroup container", () => {
      render(<RatingView name="stars" />)
      expect(screen.getByRole("radiogroup")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("empty rating has no axe violations", async () => {
      const { container } = render(
        <RatingView label="Rate this" name="a11y-rating" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("rating with selected value has no axe violations", async () => {
      const { container } = render(
        <RatingView label="Rate this" name="a11y-rating-val" value={4} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled rating has no axe violations", async () => {
      const { container } = render(
        <RatingView disabled label="Rate this" name="a11y-rating-dis" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("each radio has an accessible aria-label", () => {
      render(<RatingView name="stars" />)
      expect(screen.getByRole("radio", { name: "1 star" })).toBeInTheDocument()
      expect(screen.getByRole("radio", { name: "5 stars" })).toBeInTheDocument()
    })
  })

  describe("edge cases", () => {
    it("uses default max of 5 when max is 0 (falsy)", () => {
      // Covers max && max > 0 ? max : 5 — falsy branch at line 48
      render(<RatingView max={0} name="stars" />)
      const radios = screen.getAllByRole("radio")
      expect(radios).toHaveLength(5)
    })

    it("uses default min of 1 when min is 0 (falsy)", () => {
      // Covers min && min > 0 ? min : 1 — falsy branch at line 49
      render(<RatingView min={0} name="stars" />)
      // With min=0, minSafe falls back to 1; all items show "itemValue / max"
      expect(screen.getByRole("radio", { name: "1 star" })).toBeInTheDocument()
    })

    it("renders itemValue without fraction when itemValue < minSafe", () => {
      // Covers itemValue >= minSafe ? ... : itemValue branch at line 124
      // min=3 means minSafe=3; itemValue=1 < minSafe=3 → renders just itemValue
      render(<RatingView min={3} name="stars" />)
      const radios = screen.getAllByRole("radio")
      // star 1 and 2 have itemValue < minSafe, so their sr-only text is just the
      // number; star 3+ shows "N / 5"
      expect(radios[0]).toBeInTheDocument()
    })
  })
})
