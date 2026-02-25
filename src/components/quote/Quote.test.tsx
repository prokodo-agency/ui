import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Quote } from "./Quote"

describe("Quote", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders the quote content", () => {
      render(<Quote content="An inspiring quote about engineering." />)
      expect(
        screen.getByText("An inspiring quote about engineering."),
      ).toBeInTheDocument()
    })

    it("renders with title", () => {
      render(
        <Quote
          content="Great product!"
          title={{ content: "What users say" }}
        />,
      )
      expect(screen.getByText("What users say")).toBeInTheDocument()
    })

    it("renders with subTitle", () => {
      render(
        <Quote
          content="Quote text"
          subTitle={{ content: "Section subtitle" }}
        />,
      )
      expect(screen.getByText("Section subtitle")).toBeInTheDocument()
    })

    it("renders author name when provided", () => {
      render(
        <Quote
          author={{ name: "Jane Doe", position: "CTO" }}
          content="Excellent service"
        />,
      )
      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    })

    it("renders author position when provided", () => {
      render(
        <Quote
          author={{ name: "Jan", position: "Engineer" }}
          content="Great team"
        />,
      )
      expect(screen.getByText("Engineer")).toBeInTheDocument()
    })

    it("renders as a <figure> element", () => {
      render(<Quote content="Semantic quote" />)
      expect(screen.getByRole("figure")).toBeInTheDocument()
    })

    it("renders blockquote inside figure", () => {
      const { container } = render(<Quote content="Quoted text" />)
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("blockquote")).toBeTruthy()
    })

    it("applies custom className", () => {
      render(<Quote className="my-quote" content="Custom class quote" />)
      expect(screen.getByRole("figure")).toHaveClass("my-quote")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("basic quote has no axe violations", async () => {
      const { container } = render(<Quote content="An inspiring quote." />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("quote with author has no axe violations", async () => {
      const { container } = render(
        <Quote
          author={{ name: "Alex Smith", position: "CEO" }}
          content="Best product ever!"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("quote with title and subTitle has no axe violations", async () => {
      const { container } = render(
        <Quote
          content="An insight."
          subTitle={{ content: "Customer feedback" }}
          title={{ content: "Testimonials" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe("edge cases", () => {
    it("renders author with avatar image", () => {
      // Covers author?.avatar && branch at line 71
      render(
        <Quote
          content="Great product!"
          author={{
            name: "Jane Doe",
            position: "CEO",
            avatar: { image: { src: "/avatar.jpg", alt: "Jane Doe" } },
          }}
        />,
      )
      expect(screen.getByText("Jane Doe")).toBeInTheDocument()
    })
  })
})
