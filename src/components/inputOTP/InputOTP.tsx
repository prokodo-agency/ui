import {
  type FC,
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent,
  memo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react"

import { create } from "@/helpers/bem"

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
    // Controlled digits
    const [otp, setOtp] = useState<string[]>(() =>
      Array<string>(length).fill(""),
    )

    // Keep refs array in sync with length
    const inputs = useRef<Array<HTMLInputElement | null>>([])
    useEffect(() => {
      inputs.current = inputs.current.slice(0, length)
      setOtp(prev => {
        const next = Array<string>(length).fill("")
        for (let i = 0; i < Math.min(prev.length, length); i++)
          /* istanbul ignore next */ next[i] = prev[i] ?? ""
        return next
      })
    }, [length])

    // Ensure onComplete is fired once per “becoming complete”
    const completedRef = useRef(false)

    const focusIndex = useCallback((idx: number) => {
      const el = inputs.current[idx]
      /* istanbul ignore else */
      if (el) {
        el.focus()
        el.setSelectionRange?.(0, el.value.length)
      }
    }, [])

    const emitChange = useCallback(
      (next: string[]) => {
        const joined = next.join("")
        onChange?.(joined)

        const complete = next.every(d => d !== "")
        if (complete && !completedRef.current) {
          completedRef.current = true
          onComplete?.(joined)
        } else if (!complete && completedRef.current) {
          completedRef.current = false
        }
      },
      [onChange, onComplete],
    )

    const setDigit = useCallback(
      (digit: string, index: number) => {
        const d = digit.replace(/\D/g, "")
        /* istanbul ignore next */
        if (d.length > 1) return

        setOtp(prev => {
          /* istanbul ignore next */
          if (prev[index] === d) return prev
          const next = [...prev]
          next[index] = d

          // Move focus forward to the next empty slot
          if (d !== "" && index < length - 1) {
            const nextEmpty = next.findIndex(
              (val, i) => i > index && val === "",
            )
            /* istanbul ignore next */
            const to = nextEmpty !== -1 ? nextEmpty : index + 1
            focusIndex(to)
          }

          emitChange(next)
          return next
        })
      },
      [emitChange, focusIndex, length],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setDigit(e.target.value, index)
      },
      [setDigit],
    )

    // Use widened type to satisfy Input's textarea|input handler union
    const handleKeyDown = useCallback(
      (
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
      ) => {
        const { key } = e

        if (key === "Backspace") {
          e.preventDefault()
          setOtp(prev => {
            const next = [...prev]
            if (next[index] !== "") {
              next[index] = ""
              focusIndex(index)
            } else if (index > 0) {
              next[index - 1] = ""
              focusIndex(index - 1)
              /* istanbul ignore next */
            }
            emitChange(next)
            return next
          })
          return
        }

        if (key === "ArrowLeft") {
          e.preventDefault()
          /* istanbul ignore else */
          if (index > 0) focusIndex(index - 1)
          return
        }
        if (key === "ArrowRight") {
          e.preventDefault()
          /* istanbul ignore else */
          if (index < length - 1) focusIndex(index + 1)
          return
        }
        if (key === "Home") {
          e.preventDefault()
          focusIndex(0)
          return
        }
        if (key === "End") {
          e.preventDefault()
          focusIndex(length - 1)
          return
        }

        // Only allow digits
        if (key.length === 1 && !/[0-9]/.test(key)) {
          e.preventDefault()
        }
      },
      [emitChange, focusIndex, length],
    )

    const handleFocus = useCallback((index: number) => {
      const el = inputs.current[index]
      el?.setSelectionRange?.(0, el.value.length)
    }, [])

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        /* istanbul ignore next */
        const digits = (e.clipboardData.getData("text") || "")
          .replace(/\D/g, "")
          .slice(0, length)
          .split("")

        if (digits.length === 0) return

        setOtp(prev => {
          const next = [...prev]
          // start at first empty, else 0
          let writeIndex = next.findIndex(d => d === "")
          if (writeIndex === -1) writeIndex = 0

          for (let i = 0; i < digits.length && writeIndex < length; i++) {
            next[writeIndex] = digits[i]!
            writeIndex++
          }

          emitChange(next)

          const nextEmpty = next.findIndex(d => d === "")
          /* istanbul ignore next */
          focusIndex(nextEmpty === -1 ? length - 1 : nextEmpty)

          return next
        })
      },
      [emitChange, focusIndex, length],
    )

    return (
      <div
        aria-describedby="otp-instructions"
        aria-labelledby="otp-group-label"
        className={bem(undefined, undefined, className)}
        role="group"
        onPaste={handlePaste}
      >
        <span className={bem("label")} id="otp-group-label">
          {/* istanbul ignore next */}
          {groupLabel ?? /* istanbul ignore next */ "Enter your OTP"}
        </span>
        <span className={bem("instruction")} id="otp-instructions">
          {groupInstruction ?? "Use the arrow keys to navigate between digits."}
        </span>

        {otp.map((value, index) => (
          <Input
            // eslint-disable-next-line react/no-array-index-key
            key={`otp-${index}`}
            {...props}
            hideCounter
            aria-label={`${props?.["aria-label"] ?? "OTP digit"} ${index + 1}`}
            autoComplete="one-time-code"
            className={bem("input")}
            fieldClassName={bem("field")}
            inputClassName={bem("input__node")}
            inputContainerClassName={bem("input__container")}
            inputMode="numeric"
            maxLength={1}
            name={`otp-${index}`}
            pattern="\\d*"
            placeholder="•"
            type="text"
            value={value}
            inputRef={el => {
              inputs.current[index] = (el as HTMLInputElement) ?? null
            }}
            onFocus={() => handleFocus(index)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e, index)
            }
            onKeyDown={(
              e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleKeyDown(e, index)}
          />
        ))}
      </div>
    )
  },
)

InputOTP.displayName = "InputOTP"
