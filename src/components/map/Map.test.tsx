import { axe } from "jest-axe"

import { render } from "@/tests"

// Map uses useGoogleMaps hook and google.maps APIs - mock to avoid loading the Maps JS SDK
// useGoogleMaps returns a boolean; return false so the component renders the loading skeleton
jest.mock("@/hooks/useGoogleMaps", () => ({
  useGoogleMaps: () => false,
}))

jest.mock("../skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div aria-busy="true" className={className} role="status" />
  ),
}))

import { Map } from "./Map"

describe("Map", () => {
  const center = { lat: 48.1371, lng: 11.5754 }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a loading skeleton while google maps is not loaded", () => {
      const { container } = render(<Map apiKey="test-key" center={center} />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders without crashing with zoom prop", () => {
      const { container } = render(
        <Map apiKey="test-key" center={center} zoom={12} />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders without crashing with markers prop", () => {
      const { container } = render(
        <Map
          apiKey="test-key"
          center={center}
          marker={[{ position: { lat: 48.1371, lng: 11.5754 } }] as never}
        />,
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("map loading state has no axe violations", async () => {
      const { container } = render(<Map apiKey="test-key" center={center} />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
