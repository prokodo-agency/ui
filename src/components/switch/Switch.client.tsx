"use client"
import {
  useEffect,
  useState,
  useCallback,
  memo,
  type ChangeEvent,
  type FocusEvent,
} from "react"
import { SwitchView } from "./Switch.view"
import type { SwitchProps } from "./Switch.model"

function SwitchClient(props: SwitchProps) {
  const {
    checked: controlledChecked,
    onChange,
    onFocus,
    onBlur,
  } = props

  const [isChecked, setIsChecked] = useState<boolean>(
    controlledChecked ?? false
  )

  useEffect(() => {
    if (controlledChecked !== undefined) {
      setIsChecked(controlledChecked)
    }
  }, [controlledChecked])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
      setIsChecked(newValue)
      onChange?.(e, newValue)
    },
    [onChange]
  )

  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    []
  )
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    []
  )

  return (
    <SwitchView
      {...props}
      checked={undefined}
      isChecked={isChecked}
      isFocused={isFocused}
      onChangeInternal={handleChange}
      onFocusInternal={handleFocus}
      onBlurInternal={handleBlur}
    />
  )
}

export default memo(SwitchClient)
