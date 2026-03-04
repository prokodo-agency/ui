"use client"
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

import { InputOTPView } from "./InputOTP.view"

import type { InputOTPProps } from "./InputOTP.model"

const InputOTPClient: FC<InputOTPProps> = memo(
  ({ length = 6, onComplete, onChange, ...props }) => {
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

    // Ensure onComplete is fired once per "becoming complete"
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

    const handleDigitChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setDigit(e.target.value, index)
      },
      [setDigit],
    )

    const handleDigitKeyDown = useCallback(
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

        if (key.length === 1 && !/[0-9]/.test(key)) {
          e.preventDefault()
        }
      },
      [emitChange, focusIndex, length],
    )

    const handleDigitFocus = useCallback((index: number) => {
      const el = inputs.current[index]
      el?.setSelectionRange?.(0, el.value.length)
    }, [])

    const handleGroupPaste = useCallback(
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

    const getInputRef = useCallback(
      (index: number) => (el: HTMLInputElement | null) => {
        inputs.current[index] = el
      },
      [],
    )

    return (
      <InputOTPView
        {...props}
        getInputRef={getInputRef}
        length={length}
        otp={otp}
        onDigitChange={handleDigitChange}
        onDigitFocus={handleDigitFocus}
        onDigitKeyDown={handleDigitKeyDown}
        onGroupPaste={handleGroupPaste}
      />
    )
  },
)

InputOTPClient.displayName = "InputOTP"

export default InputOTPClient
