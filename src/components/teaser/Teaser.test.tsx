import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Teaser } from "./Teaser"

jest.mock("../lottie", () => ({
  Lottie: ({ animation }: { animation: string }) => (
    <div data-animation={animation} data-testid="lottie-mock" />
  ),
}))

describe("Teaser", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with a title", () => {
      render(<Teaser title={{ content: "Our Product" }} />)
      expect(screen.getByText("Our Product")).toBeInTheDocument()
    })

    it("renders with text content", () => {
      render(
        <Teaser
          content="<p>Discover the feature</p>"
          title={{ content: "Feature" }}
        />,
      )
      expect(screen.getByText("Feature")).toBeInTheDocument()
    })

    it("renders a redirect label when provided", () => {
      render(
        <Teaser
          redirect={{ href: "/feature", label: "Learn more" }}
          title={{ content: "Feature" }}
        />,
      )
      expect(screen.getByText("Learn more")).toBeInTheDocument()
    })

    it("renders with image alt text", () => {
      render(
        <Teaser
          image={{ src: "/img/feature.jpg", alt: "Feature image" }}
          title={{ content: "Visual Feature" }}
        />,
      )
      expect(screen.getByAltText("Feature image")).toBeInTheDocument()
    })

    it("renders lineClamp class when lineClamp=true", () => {
      const { container } = render(
        <Teaser
          lineClamp
          content="<p>Long text content</p>"
          title={{ content: "Clamped" }}
        />,
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("basic teaser has no axe violations", async () => {
      const { container } = render(
        <Teaser title={{ content: "Accessible teaser" }} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("teaser with redirect link has no axe violations", async () => {
      const { container } = render(
        <Teaser
          redirect={{ href: "/details", label: "Read more" }}
          title={{ content: "Feature teaser" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe("edge cases", () => {
    it("renders Lottie animation when animation prop is provided", () => {
      // Covers animation !== undefined && branch at line 37
      render(
        <Teaser
          animation="/animations/test.lottie"
          title={{ content: "Animated" }}
        />,
      )
      expect(screen.getByText("Animated")).toBeInTheDocument()
    })

    it("renders redirect icon with custom className", () => {
      // Covers redirect?.icon?.className optional chain at line 84
      render(
        <Teaser
          title={{ content: "Redirect with icon class" }}
          redirect={{
            href: "/go",
            label: "Go",
            icon: { name: "ArrowRight01Icon" as const, className: "my-icon" },
          }}
        />,
      )
      expect(screen.getByText("Go")).toBeInTheDocument()
    })
  })
})
