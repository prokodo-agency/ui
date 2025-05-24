import {
  type FC,
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent,
  memo,
  useState,
  useRef,
} from "react"

import { create } from "@/helpers/bem"
import { isArray } from "@/helpers/validations"

import { Input } from "../input"

import styles from "./InputOTP.module.scss"

import type { InputOTPProps } from "./InputOTP.model"

const bem = create(styles, "InputOTP")

export const InputOTP: FC<InputOTPProps> = memo(
  ({
    className,
    groupLabel,
    groupInstruction,
    length = 6,
    onComplete,
    onChange,
    ...props
  }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
    const inputs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (value: string, index: number) => {
      if (value.length > 1) return // Ensure only one character is entered

      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Call the onChange callback with the partial OTP
      if (onChange) onChange(newOtp.join(""))

      // Move focus to the next input if the current input is filled
      if (value && index < length - 1) {
        inputs.current[index + 1]?.focus()
      }

      // If all fields are filled, trigger onComplete callback
      if (newOtp.every(digit => digit !== "") && onComplete) {
        onComplete(newOtp.join(""))
      }
    }

    const handleKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (
        e.key === "Backspace" &&
        index > 0 &&
        isArray(otp) &&
        otp[index] !== undefined
      ) {
        inputs.current[index - 1]?.focus() // Focus previous input on backspace
      }

      // Arrow keys for navigating between inputs
      if (e.key === "ArrowLeft" && index > 0) {
        inputs.current[index - 1]?.focus()
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputs.current[index + 1]?.focus()
      }
    }

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
      const paste = e.clipboardData.getData("text").slice(0, length).split("")
      const newOtp = [...otp]

      paste.forEach((value, index) => {
        if (index < length) {
          newOtp[index] = value
          if (inputs.current[index]) {
            inputs.current[index]!.value = value
          }
        }
      })

      setOtp(newOtp)

      // Call onChange with the new OTP
      if (onChange) onChange(newOtp.join(""))

      // Trigger onComplete if all fields are filled
      if (paste.length === length && onComplete) {
        onComplete(newOtp.join(""))
      } else {
        const nextIndex = paste.length
        if (nextIndex < length) {
          inputs.current[nextIndex]?.focus()
        }
      }
    }

    return (
      <div
        aria-describedby="otp-instructions"
        aria-labelledby="otp-group-label"
        className={bem(undefined, undefined, className)}
        role="group"
        onPaste={handlePaste}
      >
        <span className={bem("label")} id="otp-group-label">
          {groupLabel ?? "Enter your OTP"}
        </span>
        <span className={bem("instruction")} id="otp-instructions">
          {groupInstruction ?? "Use the arrow keys to navigate between digits."}
        </span>
        {otp.map((value, index) => (
          <Input
            placeholder="x"
            {...props}
            // eslint-disable-next-line react/no-array-index-key
            key={`otp-${index}`}
            hideCounter
            aria-label={`${props?.["aria-label"] ?? "OTP digit"} ${index + 1}`}
            className={bem("input")}
            fieldClassName={bem("field")}
            inputClassName={bem("input__node")}
            inputContainerClassName={bem("input__container")}
            maxLength={1}
            name={`otp-${index}`}
            type="text"
            value={value}
            inputRef={el => {
              inputs.current[index] = el as HTMLInputElement | null
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, index)
            }
          />
        ))}
      </div>
    )
  },
)

InputOTP.displayName = "InputOTP"
