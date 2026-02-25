import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import LoadingServer from "./Loading.server"

jest.mock("./Loading.view", () => ({
  SpinnerView: (_props: Record<string, unknown>) => (
    <div data-testid="spinner-view" />
  ),
  OverlayView: ({ resolvedBackdrop }: { resolvedBackdrop?: string }) => (
    <div data-backdrop={resolvedBackdrop} data-testid="overlay-view" />
  ),
}))

describe("LoadingServer", () => {
  it("renders spinner view by default", () => {
    render(<LoadingServer />)
    expect(screen.getByTestId("spinner-view")).toBeInTheDocument()
  })

  it("renders overlay view for overlay variant", () => {
    render(<LoadingServer variant="overlay" />)
    expect(screen.getByTestId("overlay-view")).toBeInTheDocument()
  })

  it("overlay defaults backdrop to light for auto", () => {
    render(<LoadingServer backdrop="auto" variant="overlay" />)
    expect(screen.getByTestId("overlay-view")).toHaveAttribute(
      "data-backdrop",
      "light",
    )
  })

  it("overlay uses explicit backdrop value", () => {
    render(<LoadingServer backdrop="dark" variant="overlay" />)
    expect(screen.getByTestId("overlay-view")).toHaveAttribute(
      "data-backdrop",
      "dark",
    )
  })
})
