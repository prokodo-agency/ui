import { InputOTPView } from "./InputOTP.view"

import type { InputOTPProps } from "./InputOTP.model"
import type { JSX } from "react"

// Static server render — interactive features require the client component.
export default function InputOTPServer({
  length = 6,
  ...props
}: InputOTPProps): JSX.Element {
  const emptyOtp = Array<string>(length).fill("")

  /* istanbul ignore next */
  const noop = () => {}
  /* istanbul ignore next */
  const noopRef = () => () => {}

  return (
    <InputOTPView
      {...props}
      readOnly
      getInputRef={noopRef}
      length={length}
      otp={emptyOtp}
      onDigitChange={noop as never}
      onDigitFocus={noop}
      onDigitKeyDown={noop as never}
      onGroupPaste={noop as never}
    />
  )
}
