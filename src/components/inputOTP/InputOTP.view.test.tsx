/**
 * Direct unit tests for InputOTPView — exercises branches that cannot be
 * reached through InputOTPClient (which always passes explicit prop values).
 */
import { render, screen } from "@/tests"

import { InputOTPView } from "./InputOTP.view"

// Mock the Input island so we render simple <input> elements without needing
// a fully hydrated island environment.
jest.mock("../input", () => ({
  Input: ({
    name,
    value,
    onChange,
    onFocus,
    onKeyDown,
    inputRef,
    "aria-label": ariaLabel,
  }: {
    name?: string
    value?: string
    onChange?: (e: unknown) => void
    onFocus?: () => void
    onKeyDown?: (e: unknown) => void
    inputRef?: ((el: HTMLInputElement | null) => void) | null
    "aria-label"?: string
  }) => (
    <input
      ref={inputRef ?? undefined}
      aria-label={ariaLabel}
      name={name}
      type="text"
      value={value ?? ""}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  ),
}))

const baseProps = {
  otp: ["1", "2", "3", "4", "5", "6"] as string[],
  getInputRef: () => null as never,
  onDigitChange: () => {},
  onDigitFocus: () => {},
  onDigitKeyDown: () => {},
  onGroupPaste: () => {},
} as const

describe("InputOTPView", () => {
  // ------------------------------------------------------------------ defaults
  it("uses default length=6 when length is not provided", () => {
    // Not passing `length` triggers the default-arg branch (length = 6)
    render(<InputOTPView {...baseProps} />)
    expect(screen.getAllByRole("textbox")).toHaveLength(6)
  })

  it("shows the built-in group label when groupLabel prop is omitted", () => {
    // Omitting groupLabel triggers the `groupLabel ?? "Enter your OTP"` fallback
    render(<InputOTPView {...baseProps} />)
    expect(screen.getByText("Enter your OTP")).toBeInTheDocument()
  })

  // ------------------------------------------------------------------ errorText
  it("renders an alert with errorText when errorText is provided", () => {
    // Covers isError=true branches: errorId, aria-live=assertive, role=alert
    render(<InputOTPView {...baseProps} errorText="Invalid code" />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Invalid code")).toBeInTheDocument()
  })

  // ------------------------------------------------------------------ helperText
  it("renders helper text without an alert role when only helperText is provided", () => {
    // Covers isError=false + hasHelperText=true branches: helperId, aria-live=polite, no alert
    render(<InputOTPView {...baseProps} helperText="Enter the 6-digit code" />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByText("Enter the 6-digit code")).toBeInTheDocument()
  })

  // ------------------------------------------------------------------ otp value fallback
  it("renders an empty string when an otp slot is undefined", () => {
    // Covers `otp[index] ?? ""` fallback (branch 14[1])
    render(
      <InputOTPView
        {...baseProps}
        length={1}
        otp={[undefined as unknown as string]}
      />,
    )
    const input = screen.getByRole("textbox") as HTMLInputElement
    expect(input).toHaveValue("")
  })

  // ------------------------------------------------------------------ visible label
  it("renders a visible Label when label is a string", () => {
    render(<InputOTPView {...baseProps} label="Access code" />)
    expect(screen.getByText("Access code")).toBeInTheDocument()
  })
})
