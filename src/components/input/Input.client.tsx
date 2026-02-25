"use client"
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type ChangeEvent,
  type JSX,
} from "react"

import { isNull, isNumber } from "@/helpers/validations"

import { InputView } from "./Input.view"
import { handleValidation } from "./InputValidation"

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
  readOnly,
  onValidate,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: InputProps): JSX.Element {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState<string | number | undefined>(value)
  const [err, setErr] = useState<string | undefined>(errorText)

  useEffect(() => {
    if (!isNull(value)) setVal(value)
  }, [value])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value
      /* istanbul ignore next */
      if (isNumber(maxLength) && v.length > (maxLength as number)) return

      setVal(v)
      const minInt =
        /* istanbul ignore next */ rawType === "number"
          ? /* istanbul ignore next */ (min as number)
          : undefined
      const maxInt =
        /* istanbul ignore next */ rawType === "number"
          ? /* istanbul ignore next */ (max as number)
          : undefined
      handleValidation(
        /* istanbul ignore next */
        Boolean(multiline) ? "text" : rawType,
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

      /* istanbul ignore next */
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

  const handleFocus = useCallback(
    (e: InputFocus) => {
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: InputBlur) => {
      setFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  const viewBase = useMemo(
    () => ({
      ...rest,
      name,
      isFocused: isFocused !== undefined ? Boolean(isFocused) : focused,
      value: val,
      errorText: err,
      required, // ← keep required
      min, // ← if you want DOM to know about min
      max, // ← and max
      maxLength, // ← and maxLength (used by view counter)
      readOnly, // ← if you ever pass readOnly to client too
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    [
      isFocused,
      focused,
      val,
      err,
      name,
      required,
      min,
      max,
      maxLength,
      readOnly,
      handleChange,
      handleFocus,
      handleBlur,
      rest,
    ],
  )

  const viewProps: InputProps = Boolean(multiline)
    ? {
        ...viewBase,
        multiline: true,
      }
    : {
        ...viewBase,
        type: rawType,
        rows: undefined,
        minRows: undefined,
        maxRows: undefined,
      }

  return <InputView {...viewProps} />
}

export default memo(InputClient)
