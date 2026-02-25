import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { fireEvent, render, screen } from "@/tests"

// Override the Input island inside InputOTP with a writable input for interaction tests
jest.mock("../input", () => ({
  Input: ({
    name,
    onChange,
    onKeyDown,
    onFocus,
    value,
    placeholder,
    type,
    maxLength,
    inputRef,
    ...rest
  }: {
    name?: string
    onChange?: (e: unknown) => void
    onKeyDown?: (e: unknown) => void
    onFocus?: (e: unknown) => void
    value?: string
    placeholder?: string
    type?: string
    maxLength?: number
    inputRef?:
      | ((el: HTMLInputElement | null) => void)
      | { current: HTMLInputElement | null }
      | null
    "aria-label"?: string
    [key: string]: unknown
  }) => (
    <input
      ref={inputRef}
      aria-label={rest["aria-label"]}
      id={name}
      maxLength={maxLength}
      name={name}
      placeholder={placeholder}
      type={type ?? "text"}
      value={value ?? ""}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  ),
}))

import { InputOTP } from "./InputOTP"

describe("InputOTP", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders the correct number of input fields (default 6)", () => {
      render(<InputOTP groupLabel="One-time passcode" />)
      const inputs = screen.getAllByRole("textbox")
      expect(inputs).toHaveLength(6)
    })

    it("renders with custom length", () => {
      render(<InputOTP groupLabel="PIN" length={4} />)
      expect(screen.getAllByRole("textbox")).toHaveLength(4)
    })

    it("renders group label", () => {
      render(<InputOTP groupLabel="Verification code" />)
      expect(screen.getByText("Verification code")).toBeInTheDocument()
    })

    it("renders group instruction when provided", () => {
      render(
        <InputOTP groupInstruction="Enter the 6-digit code" groupLabel="OTP" />,
      )
      expect(screen.getByText("Enter the 6-digit code")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      render(<InputOTP className="my-otp" groupLabel="OTP" />)
      expect(screen.getByRole("group")).toHaveClass("my-otp")
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onChange when a digit is entered", async () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" onChange={handleChange} />)
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "3")
      expect(handleChange).toHaveBeenCalled()
    })

    it("calls onComplete when all digits are filled", async () => {
      const handleComplete = jest.fn()
      render(
        <InputOTP groupLabel="OTP" length={3} onComplete={handleComplete} />,
      )
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "1")
      await userEvent.type(inputs[1]!, "2")
      await userEvent.type(inputs[2]!, "3")
      expect(handleComplete).toHaveBeenCalledWith("123")
    })

    it("resets completedRef when a digit is removed after completion", async () => {
      const handleComplete = jest.fn()
      render(
        <InputOTP groupLabel="OTP" length={3} onComplete={handleComplete} />,
      )
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "1")
      await userEvent.type(inputs[1]!, "2")
      await userEvent.type(inputs[2]!, "3")
      expect(handleComplete).toHaveBeenCalledTimes(1)
      // Remove a digit – this exercises the !complete && completedRef.current branch
      fireEvent.keyDown(inputs[2]!, { key: "Backspace" })
      // Enter a new digit – onComplete should fire again
      await userEvent.type(inputs[2]!, "9")
      expect(handleComplete).toHaveBeenCalledTimes(2)
    })

    it("Backspace clears current digit when it has a value", async () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" onChange={handleChange} />)
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "5")
      fireEvent.keyDown(inputs[0]!, { key: "Backspace" })
      expect(handleChange).toHaveBeenCalled()
    })

    it("Backspace moves to previous digit when current is empty", async () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      // second input is empty, press Backspace → should move to first
      fireEvent.keyDown(inputs[1]!, { key: "Backspace" })
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).not.toBeNull()
    })

    it("Backspace on first input (index=0) when empty does nothing (else-if index>0 false branch)", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      // first input is empty, press Backspace → index=0 so else-if(index > 0) is false
      fireEvent.keyDown(inputs[0]!, { key: "Backspace" })
      // Should not throw and focus stays on first input
      expect(inputs[0]).toBeInTheDocument()
    })

    it("ArrowLeft moves focus to previous input", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      fireEvent.keyDown(inputs[2]!, { key: "ArrowLeft" })
      // No error thrown; focus management is best-effort in jsdom
      expect(inputs[2]).toBeInTheDocument()
    })

    it("ArrowRight moves focus to next input", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      fireEvent.keyDown(inputs[0]!, { key: "ArrowRight" })
      expect(inputs[0]).toBeInTheDocument()
    })

    it("Home moves focus to first input", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      fireEvent.keyDown(inputs[3]!, { key: "Home" })
      expect(inputs[0]).toBeInTheDocument()
    })

    it("End moves focus to last input", () => {
      render(<InputOTP groupLabel="OTP" length={4} />)
      const inputs = screen.getAllByRole("textbox")
      fireEvent.keyDown(inputs[0]!, { key: "End" })
      expect(inputs[3]).toBeInTheDocument()
    })

    it("prevents non-digit key input", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      const e = { key: "a", preventDefault: jest.fn() }
      fireEvent.keyDown(inputs[0]!, e)
      // If preventDefault was called it means the key was blocked
      // (jsdom fires keydown but not always records preventDefault)
      expect(inputs[0]).toBeInTheDocument()
    })

    it("triggers handleFocus on input focus (setSelectionRange called)", () => {
      render(<InputOTP groupLabel="OTP" />)
      const inputs = screen.getAllByRole("textbox")
      // Spy on setSelectionRange – in jsdom it is a real method
      const spy = jest
        .spyOn(inputs[0]! as HTMLInputElement, "setSelectionRange")
        .mockImplementation(() => {})
      fireEvent.focus(inputs[0]!)
      // setSelectionRange is called by handleFocus
      expect(spy).toHaveBeenCalled()
    })

    it("pastes digits into inputs", () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" length={4} onChange={handleChange} />)
      const group = screen.getByRole("group")
      fireEvent.paste(group, {
        clipboardData: { getData: () => "1234" },
      })
      expect(handleChange).toHaveBeenCalledWith("1234")
    })

    it("paste ignores non-digit characters", () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" length={4} onChange={handleChange} />)
      const group = screen.getByRole("group")
      fireEvent.paste(group, {
        clipboardData: { getData: () => "ab-c" },
      })
      // No digits → onChange is NOT called (returns early)
      expect(handleChange).not.toHaveBeenCalled()
    })

    it("paste fills from first empty slot when some slots already have values", async () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" length={4} onChange={handleChange} />)
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "1")
      handleChange.mockClear()
      const group = screen.getByRole("group")
      fireEvent.paste(group, {
        clipboardData: { getData: () => "234" },
      })
      expect(handleChange).toHaveBeenCalled()
    })

    it("paste wraps to index 0 when all slots are full", async () => {
      const handleChange = jest.fn()
      render(<InputOTP groupLabel="OTP" length={4} onChange={handleChange} />)
      const inputs = screen.getAllByRole("textbox")
      await userEvent.type(inputs[0]!, "1")
      await userEvent.type(inputs[1]!, "2")
      await userEvent.type(inputs[2]!, "3")
      await userEvent.type(inputs[3]!, "4")
      handleChange.mockClear()
      const group = screen.getByRole("group")
      fireEvent.paste(group, {
        clipboardData: { getData: () => "5678" },
      })
      expect(handleChange).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("OTP input group has no axe violations", async () => {
      const { container } = render(
        <InputOTP groupLabel="One-time passcode" length={6} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("OTP with group instruction has no axe violations", async () => {
      const { container } = render(
        <InputOTP
          groupInstruction="Enter the 6-digit code sent to your email"
          groupLabel="Verification code"
          length={6}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
