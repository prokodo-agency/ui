"use client"

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type JSX,
  type MouseEvent,
} from "react"

import { isString, isNumber } from "@/helpers/validations"

import { handleRatingValidation } from "./Rating.validation"
import { RatingView } from "./Rating.view"

import type {
  RatingProps,
  RatingBlurEvent,
  RatingFocusEvent,
  RatingViewProps,
  RatingValue,
} from "./Rating.model"

function RatingClient({
  isFocused,
  name,
  value,
  defaultValue,
  max = 5,
  min = 1,
  disabled,
  readOnly,
  required,
  helperText,
  errorText,
  errorTranslations,
  fullWidth,
  className,
  fieldClassName,
  groupClassName,
  iconClassName,
  inputRef,
  onChange,
  onValidate,
  onFocus,
  onBlur,
  ...rest
}: RatingProps): JSX.Element {
  // internal focus state
  const [focused, setFocused] = useState<boolean>(false)

  // value can be number | string (or undefined)
  const [val, setVal] = useState<RatingValue | undefined>(
    value !== undefined ? value : defaultValue,
  )

  // hover can also be number | string (or undefined)
  const [hover, setHover] = useState<RatingValue | undefined>(undefined)

  const [err, setErr] = useState<string | undefined>(errorText)

  // keep controlled value in sync
  useEffect(() => {
    if (isNumber(value as number) || isString(value as string)) {
      setVal(value as RatingValue | string)
    } else if (value === undefined) {
      // uncontrolled mode: do not override local state
    }
  }, [value])

  const runValidation = useCallback(
    (newVal: RatingValue | undefined) => {
      // validation works on numeric value (or null for "no value")
      let numeric: number | undefined
      /* istanbul ignore else */
      if (isNumber(newVal as number)) {
        numeric = newVal as number
      } else {
        numeric = isString(newVal as string) ? Number(newVal) : undefined
      }

      handleRatingValidation(
        name,
        numeric,
        required,
        min,
        max,
        errorTranslations,
        (n, error) => {
          setErr(error)
          /* istanbul ignore next */
          onValidate?.(n, error)
        },
      )
    },
    [name, required, min, max, errorTranslations, onValidate],
  )

  const handleItemClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (Boolean(disabled) || Boolean(readOnly)) return

      const { value: raw } = e.currentTarget.dataset
      if (raw == null) return

      // keep event payload numeric (but still satisfies RatingValue)
      const numeric = Number(raw)
      const next: RatingValue = numeric

      setVal(next)
      runValidation(next)

      onChange?.({ name, value: next })
    },
    [disabled, readOnly, name, onChange, runValidation],
  )

  const handleItemHover = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (Boolean(disabled) || Boolean(readOnly)) return

      const { value: raw } = e.currentTarget.dataset
      if (raw == null) return

      // store raw dataset value (string) as hover marker
      setHover(raw)
    },
    [disabled, readOnly],
  )

  const handleMouseLeave = useCallback(() => {
    if (Boolean(disabled) || Boolean(readOnly)) return
    setHover(undefined)
  }, [disabled, readOnly])

  const handleFocus = useCallback(
    (e: RatingFocusEvent) => {
      setFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: RatingBlurEvent) => {
      setFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  const viewProps: RatingViewProps = useMemo(
    () => ({
      ...rest,
      name,
      value: val,
      hoverValue: hover,
      max,
      min,
      disabled,
      readOnly,
      required,
      helperText,
      errorText: err,
      fullWidth,
      className,
      fieldClassName,
      groupClassName,
      iconClassName,
      inputRef,
      isFocused: isFocused !== undefined ? Boolean(isFocused) : focused,
      onClick: handleItemClick,
      onMouseEnter: handleItemHover,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    [
      rest,
      name,
      val,
      hover,
      max,
      min,
      disabled,
      readOnly,
      required,
      helperText,
      err,
      fullWidth,
      className,
      fieldClassName,
      groupClassName,
      iconClassName,
      inputRef,
      isFocused,
      focused,
      handleItemClick,
      handleItemHover,
      handleMouseLeave,
      handleFocus,
      handleBlur,
    ],
  )

  return <RatingView {...viewProps} />
}

export default memo(RatingClient)
