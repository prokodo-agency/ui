import { isString } from "./validations"

export type LocalizedDate = {
  locale: string
  meta: string
}

export const localizeDate = (
  locale: Intl.LocalesArgument,
  date?: string,
): LocalizedDate | undefined => {
  if (!isString(date)) return undefined
  const newDate = new Date(date as string)
  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, "0")
  const day = String(newDate.getDate()).padStart(2, "0")
  return {
    locale: newDate.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    meta: `${year}-${month}-${day}`,
  }
}
