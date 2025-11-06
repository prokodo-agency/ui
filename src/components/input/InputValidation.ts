import { isString } from "@/helpers/validations"

import type {
  FieldType,
  InputValidateEvent,
  InputErrorTranslations,
} from "./Input.model"
import type { HTMLInputTypeAttribute } from "react"

/* ── helpers ────────────────────────────────────────────────────────── */

const isEmpty = (v?: string | null) => v == null || v === ""

/** Validation for min/max: numeric values or string length fallback */
const handleValidationMinMax = (
  value?: string | number,
  min?: number,
  max?: number,
  errorTranslations?: InputErrorTranslations,
): string | undefined => {
  let numericValue = Number(value)
  if (typeof value === "string" && Number.isNaN(numericValue)) {
    numericValue = value.length
  }
  if (min !== undefined && numericValue < min) {
    return `${errorTranslations?.min ?? "Value must be greater than or equal to"} ${min}.`
  }
  if (max !== undefined && numericValue > max) {
    return `${errorTranslations?.max ?? "Value must be less than or equal to"} ${max}.`
  }
  return
}

/* Cheap, safe validators (no catastrophic backtracking) */
const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v)

const validateTel = (v: string) => /^\+?[1-9]\d{1,14}$/.test(v) // E.164-ish

const validateURL = (v: string) => {
  try {
    const u = new URL(v)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

const validateNumber = (v: string) => /^-?\d+(\.\d+)?$/.test(v)

const validateColor = (v: string) => /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(v)

const validatePassword = (v: string) =>
  v.length >= 8 &&
  /[a-z]/.test(v) &&
  /[A-Z]/.test(v) &&
  /\d/.test(v) &&
  /[\W_]/.test(v)

/** optional custom regex (avoid allowing dangerous patterns) */
const buildCustomRegex = (pattern: string): RegExp => {
  const m = pattern.match(/^\/([\s\S]*)\/([gimuy]*)$/)
  const src = m ? m[1] : pattern
  const flags = m ? m[2]?.replace(/[^gimuy]/g, "") : ""
  return new RegExp(src ?? "", flags)
}

/* ── main ───────────────────────────────────────────────────────────── */

export const handleValidation = (
  type: FieldType,
  name: string,
  value?: string,
  required?: boolean,
  min?: number,
  max?: number,
  customRegexPattern?: string,
  errorTranslations?: InputErrorTranslations,
  onValidate?: InputValidateEvent,
): void => {
  if (!onValidate) return

  // required
  if (isEmpty(value)) {
    if (Boolean(required)) {
      return onValidate(
        name,
        errorTranslations?.required ??
          "This field is required. Please fill it out.",
      )
    }
    return onValidate(name)
  }

  // min/max
  const minMaxError = handleValidationMinMax(value, min, max, errorTranslations)
  if (isString(minMaxError)) return onValidate(name, minMaxError)

  const msg: InputErrorTranslations = {
    email: "Please enter a valid email address (e.g., name@example.com).",
    tel: "Please enter a valid phone number.",
    url: "Please enter a valid URL.",
    number: "Please enter a valid number.",
    color: "Please enter a valid color code (e.g., #FFFFFF).",
    password:
      "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
    ...errorTranslations,
  }

  const v = value as string

  // custom pattern (kept, but sanitized)
  if (isString(customRegexPattern)) {
    const re = buildCustomRegex(customRegexPattern as string)
    if (!re.test(v))
      return onValidate(name, msg[String(type) as keyof typeof msg])
    return onValidate(name)
  }

  // built-in types
  let ok = true
  switch (type as HTMLInputTypeAttribute) {
    case "email":
      ok = validateEmail(v)
      break
    case "tel":
      ok = validateTel(v)
      break
    case "url":
      ok = validateURL(v)
      break
    case "number":
      ok = validateNumber(v)
      break
    case "color":
      ok = validateColor(v)
      break
    case "password":
      ok = validatePassword(v)
      break
    default:
      ok = true
  }

  if (!ok) return onValidate(name, msg[type as keyof typeof msg])
  return onValidate(name)
}
