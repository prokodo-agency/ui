"use client"

export const getTheme = (): "light" | "dark" | null => {
  /* istanbul ignore next */
  if (typeof document === "undefined") {
    return null
  }
  return document.documentElement.getAttribute("data-theme") as
    | "light"
    | "dark"
    | null
}
