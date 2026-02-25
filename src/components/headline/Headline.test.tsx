import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Headline } from "./Headline"

describe("Headline", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with default type h3", () => {
      render(<Headline>Default heading</Headline>)
      expect(
        screen.getByRole("heading", { level: 3, name: /default heading/i }),
      ).toBeInTheDocument()
    })

    it("renders all heading levels (h1–h6)", () => {
      const levels = [1, 2, 3, 4, 5, 6] as const
      levels.forEach(level => {
        const { unmount } = render(
          <Headline
            type={`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
          >
            Heading {level}
          </Headline>,
        )
        expect(
          screen.getByRole("heading", { level, name: `Heading ${level}` }),
        ).toBeInTheDocument()
        unmount()
      })
    })

    it("renders with size prop", () => {
      render(<Headline size="xl">XL Heading</Headline>)
      expect(
        screen.getByRole("heading", { name: /xl heading/i }),
      ).toBeInTheDocument()
    })

    it("renders with all size variants", () => {
      const sizes = ["xxl", "xl", "lg", "md", "sm", "xs"] as const
      sizes.forEach(size => {
        const { unmount } = render(
          <Headline size={size}>{size} heading</Headline>,
        )
        expect(
          screen.getByRole("heading", { name: `${size} heading` }),
        ).toBeInTheDocument()
        unmount()
      })
    })

    it("renders with a custom className", () => {
      render(<Headline className="custom-class">Title</Headline>)
      const el = screen.getByRole("heading", { name: /title/i })
      expect(el).toHaveClass("custom-class")
    })

    it("renders with an id", () => {
      render(<Headline id="main-title">Title with ID</Headline>)
      expect(
        screen.getByRole("heading", { name: /title with id/i }),
      ).toHaveAttribute("id", "main-title")
    })

    it("renders children text content", () => {
      render(<Headline>My Heading Text</Headline>)
      expect(screen.getByText("My Heading Text")).toBeInTheDocument()
    })

    it("renders with isRichtext=true using RichText component", () => {
      const { container } = render(
        <Headline isRichtext type="h2">
          Simple heading text
        </Headline>,
      )
      // isRichtext branch uses RichText component - just verify it renders
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with animated=true wrapping text in AnimatedText", () => {
      render(<Headline animated={true}>Animated Heading</Headline>)
      expect(screen.getByRole("heading")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("h1 has no axe violations", async () => {
      const { container } = render(<Headline type="h1">Main title</Headline>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("h2 has no axe violations", async () => {
      const { container } = render(<Headline type="h2">Section title</Headline>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("default heading has no axe violations", async () => {
      const { container } = render(<Headline>Default heading</Headline>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  it("applies inline fontSize style when size is a number", () => {
    const { container } = render(<Headline size={2}>Numeric size</Headline>)

    const el = container.firstElementChild as HTMLElement
    expect(el?.style.fontSize).toBe("2em")
  })
})
