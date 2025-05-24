import type { InputProps } from "../input"

export type InputOTPProps = Omit<
  InputProps,
  "onChange" | "name" | "multiline" | "maxRows" | "minRows" | "rows"
> & {
  groupLabel?: string
  groupInstruction?: string
  length?: number
  onChange?: (otp: string) => void
  onComplete?: (otp: string) => void
}
