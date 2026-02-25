import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Image } from "./Image"

describe("Image", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders an img element with src and alt", () => {
      render(
        <Image alt="A test image" height={100} src="/test.jpg" width={100} />,
      )
      const img = screen.getByRole("img", { name: /a test image/i })
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute("alt", "A test image")
    })

    it("renders decorative image with empty alt", () => {
      render(<Image alt="" height={50} src="/decorative.jpg" width={50} />)
      const img = screen.getByRole("presentation", { hidden: true })
      expect(img).toBeInTheDocument()
    })

    it("renders with a caption inside a figure", () => {
      render(
        <Image
          alt="Chart"
          caption="Monthly revenue chart"
          height={200}
          src="/chart.png"
          width={400}
        />,
      )
      expect(screen.getByText("Monthly revenue chart")).toBeInTheDocument()
      expect(document.querySelector("figure")).toBeTruthy()
      expect(document.querySelector("figcaption")).toBeTruthy()
    })

    it("renders without caption as plain img (no figure)", () => {
      render(<Image alt="Photo" height={100} src="/photo.jpg" width={100} />)
      expect(document.querySelector("figure")).toBeFalsy()
    })

    it("applies custom className", () => {
      render(
        <Image
          alt="Image"
          className="my-image"
          height={50}
          src="/img.jpg"
          width={50}
        />,
      )
      const img = screen.getByRole("img", { name: /image/i })
      expect(img).toHaveClass("my-image")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("image with alt text has no axe violations", async () => {
      const { container } = render(
        <Image
          alt="Descriptive alt text"
          height={200}
          src="/hero.jpg"
          width={400}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("decorative image has no axe violations", async () => {
      const { container } = render(
        <Image alt="" height={50} src="/decorative.jpg" width={50} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("image with caption has no axe violations", async () => {
      const { container } = render(
        <Image
          alt="Revenue chart"
          caption="Figure 1: Monthly revenue"
          height={200}
          src="/chart.png"
          width={400}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
