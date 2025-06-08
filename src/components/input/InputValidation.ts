import type {
  FieldType,
  InputValidateEvent,
  InputErrorTranslations,
} from "./Input.model"
import type { HTMLInputTypeAttribute } from "react"

// Helper for regex validation
const isValidRegex = (regex: RegExp, value?: string | number): boolean => {
  if (typeof value === "undefined") return false
  return regex.test(String(value))
}

// Validation for min and max values
const handleValidationMinMax = (
  value?: string | number,
  min?: number,
  max?: number,
  errorTranslations?: InputErrorTranslations,
): string | undefined => {
  let numericValue = Number(value)

  // Handle cases where the value is a string and needs length validation
  if (typeof value === "string" && isNaN(numericValue)) {
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

  // Check if value is empty and required
  const valueIsEmpty = value === null || value === undefined || value === ""
  if (valueIsEmpty && Boolean(required)) {
    return onValidate(
      name,
      errorTranslations?.required ??
        "This field is required. Please fill it out.",
    )
  }
  if (valueIsEmpty && (required === false || required === undefined))
    return onValidate(name)
  // Validate min/max values if applicable
  const minMaxError = handleValidationMinMax(value, min, max, errorTranslations)
  if (minMaxError !== undefined) return onValidate(name, minMaxError)

  // Define regex patterns for different field types
  let regexPatterns: { [key in HTMLInputTypeAttribute]?: RegExp } = {
    // text: /^[a-zA-Z\s,.!?'-]+$/,
    email:
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x21\x23-\x5b\x5d-\x7e]|\\[\x21-\x7e])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}|(?:\[(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x21-\x5a\x53-\x7e]|\\[\x21-\x7e])+)])$/i,
    tel: /^\+?[1-9]\d{1,14}$/,
    url: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
    number: /^-?\d+(\.\d+)?$/,
    color: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  }

  if (customRegexPattern !== undefined) {
    const regexParts = customRegexPattern.match(/^\/(.*)\/([gimsuy]*)$/)
    if (regexParts) {
      const [, pattern = "", flags] = regexParts
      const customRegex = new RegExp(pattern ?? "", flags)
      regexPatterns = {
        ...regexPatterns,
        [String(type)]: RegExp(customRegex),
      }
    }
  }
  const errorMessages: InputErrorTranslations = {
    // text: "Text can only include letters and common punctuation.",
    email: "Please enter a valid email address (e.g., name@example.com).",
    tel: "Please enter a valid phone number.",
    url: "Please enter a valid URL.",
    number: "Please enter a valid number.",
    color: "Please enter a valid color code (e.g., #FFFFFF).",
    password:
      "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
    ...errorTranslations,
  }
  // Perform regex validation based on field type
  const regex = regexPatterns[type as HTMLInputTypeAttribute]

  if (regex && !isValidRegex(regex, value)) {
    return onValidate(name, errorMessages[type as HTMLInputTypeAttribute])
  }

  // Call onValidate with no error
  return onValidate(name)
}
