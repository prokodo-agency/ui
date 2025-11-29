import type {
  RatingErrorTranslations,
  RatingValidateEvent,
  RatingValue,
} from "./Rating.model"

export function handleRatingValidation(
  name: string,
  value?: RatingValue,
  required?: boolean,
  min?: number,
  max?: number,
  errorTranslations?: RatingErrorTranslations,
  onValidate?: RatingValidateEvent,
): void {
  let error: string | undefined

  const hasValue = typeof value === "number" && !Number.isNaN(value)

  if (Boolean(required) && (!Boolean(hasValue) || value === 0)) {
    error = errorTranslations?.required ?? "This field is required."
  } else if (typeof min === "number" && hasValue && (value as number) < min) {
    error = errorTranslations?.min ?? `Minimum rating is ${min}.`
  } else if (typeof max === "number" && hasValue && (value as number) > max) {
    error = errorTranslations?.max ?? `Maximum rating is ${max}.`
  }

  onValidate?.(name, error)
}
