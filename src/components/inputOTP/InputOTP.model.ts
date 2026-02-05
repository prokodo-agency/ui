import type { InputProps } from "../input"

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
  /** Accessible group label for the OTP inputs. */
  groupLabel?: string
  /** Helper text displayed with the group. */
  groupInstruction?: string
  /** Number of OTP digits (default depends on component). */
  length?: number
  /** Called on every change with the current OTP string. */
  onChange?: (otp: string) => void
  /** Called when all digits are filled. */
  onComplete?: (otp: string) => void
}
