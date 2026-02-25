import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { RichTextServer } from "./RichText.server"

describe("RichText", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a div container", () => {
      const { container } = render(<RichTextServer>Hello world</RichTextServer>)
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("div")).toBeInTheDocument()
    })

    it("renders markdown as HTML (bold text)", () => {
      const { container } = render(
        <RichTextServer>{"**Bold text**"}</RichTextServer>,
      )
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("strong")).toBeInTheDocument()
    })

    it("renders markdown links", () => {
      render(
        <RichTextServer>{"[Visit site](https://example.com)"}</RichTextServer>,
      )
      const link = screen.getByRole("link")
      expect(link).toHaveAttribute("href", "https://example.com")
    })

    it("renders headings from markdown", () => {
      render(<RichTextServer>{"# Heading 1"}</RichTextServer>)
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    })

    it("renders empty string without errors", () => {
      const { container } = render(<RichTextServer>{""}</RichTextServer>)
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("div")).toBeInTheDocument()
    })

    it("sanitizes unsafe HTML via xss filter", () => {
      const { container } = render(
        <RichTextServer>{"<script>alert('xss')</script>"}</RichTextServer>,
      )
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector("script")).not.toBeInTheDocument()
    })

    it("applies a custom className", () => {
      const { container } = render(
        <RichTextServer className="my-prose">Some content</RichTextServer>,
      )
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector(".my-prose")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("prose content has no axe violations", async () => {
      const { container } = render(
        <RichTextServer>
          {"## Section title\n\nA paragraph with **bold** and _italic_ text."}
        </RichTextServer>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("rich text with links has no axe violations", async () => {
      const { container } = render(
        <RichTextServer>
          {"Check out [our website](https://example.com) for details."}
        </RichTextServer>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
