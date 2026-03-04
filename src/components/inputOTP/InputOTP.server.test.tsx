import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import InputOTPServer from "./InputOTP.server"

jest.mock("./InputOTP.view", () => ({
  InputOTPView: ({
    readOnly,
    length,
    otp,
  }: {
    readOnly?: boolean
    length?: number
    otp?: string[]
  }) => (
    <div
      data-length={length}
      data-otp={otp?.join("")}
      data-readonly={String(readOnly)}
      data-testid="view"
    />
  ),
}))

describe("InputOTPServer", () => {
  it("renders the view component", () => {
    render(<InputOTPServer groupLabel="OTP" label="Code" name="otp" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces readOnly=true", () => {
    render(<InputOTPServer groupLabel="OTP" label="Code" name="otp" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-readonly", "true")
  })

  it("defaults to length=6 when not provided", () => {
    render(<InputOTPServer groupLabel="OTP" label="Code" name="otp" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-length", "6")
  })

  it("passes custom length through", () => {
    render(
      <InputOTPServer groupLabel="OTP" label="Code" length={4} name="otp" />,
    )
    expect(screen.getByTestId("view")).toHaveAttribute("data-length", "4")
  })

  it("initialises otp as an array of empty strings", () => {
    render(<InputOTPServer groupLabel="OTP" label="Code" name="otp" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-otp", "")
  })
})
