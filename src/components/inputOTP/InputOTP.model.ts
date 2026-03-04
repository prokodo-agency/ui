import type { InputProps } from "../input"
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react"

/**
 * Input OTP props.
 * A grouped input for one-time passwords (OTP) or PIN codes.
 *
 * @example
 * <InputOTP length={6} onComplete={(otp) => verify(otp)} />
 *
 * @example
 * <InputOTP groupLabel="Code" groupInstruction="Enter the 4-digit code" />
 */
export type InputOTPProps = Omit<
  InputProps,
  "onChange" | "name" | "multiline" | "maxRows" | "minRows" | "rows"
> & {
  /** Base name for all digit inputs (e.g. "otp" → id="otp-0", "otp-1", …). Defaults to "otp". */
  name?: string
  /** Accessible group label for the OTP inputs (visually hidden; use `label` for a visible label). */
  groupLabel?: string
  /** Helper text displayed with the group (visually hidden). */
  groupInstruction?: string
  /** Number of OTP digits (default depends on component). */
  length?: number
  /** Called on every change with the current OTP string. */
  onChange?: (otp: string) => void
  /** Called when all digits are filled. */
  onComplete?: (otp: string) => void
}

/**
 * Props passed from the client controller to the purely presentational view.
 * All event handlers are pre-wired (index already bound).
 */
export interface InputOTPViewProps
  extends Omit<InputOTPProps, "onChange" | "onComplete"> {
  /** Current value of each digit slot. */
  otp: string[]
  /** Returns a ref callback for the nth digit <input> element. */
  getInputRef: (index: number) => (el: HTMLInputElement | null) => void
  /** Focus handler for a digit slot. */
  onDigitFocus: (index: number) => void
  /** Change handler for a digit slot. */
  onDigitChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void
  /** Keydown handler for a digit slot. */
  onDigitKeyDown: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => void
  /** Paste handler on the group container. */
  onGroupPaste: (e: ClipboardEvent<HTMLDivElement>) => void
}
