"use client"
import {
  useState, useEffect, useCallback, useMemo, memo,
  type ChangeEvent,
} from "react"
import { InputView } from "./Input.view"
import { handleValidation } from "./InputValidation"
import { isNull } from "@/helpers/validations"
import type { InputProps, InputFocus, InputBlur } from "./Input.model"

function InputClient({
  multiline,
  isFocused,
  type: rawType = "text",
  name,
  value,
  required,
  min,
  max,
  maxLength,
  customRegexPattern,
  errorText,
  errorTranslations,
  onValidate,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState<string | number | undefined>(value)
  const [err, setErr] = useState<string | undefined>(errorText)

  useEffect(() => {
    if (!isNull(value)) setVal(value)
  }, [value])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value
      if (maxLength && v.length > maxLength) return

      setVal(v)
      const minInt = rawType === "number" ? min as number : undefined
      const maxInt = rawType === "number" ? max as number : undefined
      handleValidation(
        multiline ? "text" : rawType,
        name,
        v,
        required,
        minInt,
        maxInt,
        customRegexPattern,
        errorTranslations,
        (n, error) => {
          setErr(error)
          onValidate?.(n, error)
        },
      )

      onChange?.(e)
    },
    [
      multiline,
      rawType,
      name,
      required,
      min,
      max,
      maxLength,
      customRegexPattern,
      errorTranslations,
      onValidate,
      onChange,
    ],
  )

  const handleFocus = (e: InputFocus) => {
    setFocused(true)
    onFocus?.(e)
  }
  const handleBlur = (e: InputBlur) => {
    setFocused(false)
    onBlur?.(e)
  }
  
  const viewBase = useMemo(() => ({
    ...rest,
    name,
    isFocused: isFocused || focused,
    value: val,
    errorText: err,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur
  }), [isFocused, focused, val, err, handleChange, handleFocus, handleBlur])

  const viewProps: InputProps = multiline
    ? {
        ...viewBase,
        multiline: true,
      }
    : {
        ...viewBase,
        type: rawType,
        rows: undefined,
        minRows: undefined,
        maxRows: undefined
      }

  return <InputView {...viewProps} />
}

export default memo(InputClient)
