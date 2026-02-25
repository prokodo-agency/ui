import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { ImageText } from "./ImageText"

describe("ImageText", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with title and content", () => {
      render(<ImageText content="Some descriptive text" title="Our Solution" />)
      expect(screen.getByText("Our Solution")).toBeInTheDocument()
      expect(screen.getByText("Some descriptive text")).toBeInTheDocument()
    })

    it("renders with subTitle", () => {
      render(
        <ImageText
          content="Body text"
          subTitle="New Feature"
          title="Main Title"
        />,
      )
      expect(screen.getByText("New Feature")).toBeInTheDocument()
    })

    it("renders with reversed layout", () => {
      const { container } = render(
        <ImageText reverse content="Content" title="Reversed" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with a button", () => {
      render(
        <ImageText
          button={{ title: "Learn more", redirect: { href: "/learn" } }}
          content="Body"
          title="Title"
        />,
      )
      // Button with redirect renders as an <a> (link role), not a button
      expect(
        screen.getByRole("link", { name: /learn more/i }),
      ).toBeInTheDocument()
    })

    it("renders without image", () => {
      const { container } = render(
        <ImageText content="No image here" title="Title" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with image", () => {
      render(
        <ImageText
          content="With image"
          title="Hero section"
          image={{
            src: "/hero.jpg",
            alt: "Hero image",
            width: 600,
            height: 400,
          }}
        />,
      )
      // Title should always be present
      expect(screen.getByText("Hero section")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("basic image-text section has no axe violations", async () => {
      const { container } = render(
        <ImageText
          content="Descriptive content for the section"
          title="Section Heading"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("image-text with CTA button has no axe violations", async () => {
      const { container } = render(
        <ImageText
          button={{ title: "Get started", redirect: { href: "/start" } }}
          content="Start building today"
          title="Build faster"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
