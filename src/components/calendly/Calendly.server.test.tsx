import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import CalendlyServer from "./Calendly.server"

jest.mock("./Calendly.view", () => ({
  CalendlyView: (props: Record<string, unknown>) => (
    <div data-cookie={String(props.hideCookieSettings)} data-testid="view" />
  ),
}))

describe("CalendlyServer", () => {
  it("renders with required calendlyId", () => {
    render(<CalendlyServer calendlyId="username/schedule" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("strips hideCookieSettings from props", () => {
    render(<CalendlyServer hideCookieSettings calendlyId="username/schedule" />)
    expect(screen.getByTestId("view")).toHaveAttribute(
      "data-cookie",
      "undefined",
    )
  })
})
