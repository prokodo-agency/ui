"use client"

export const getTheme = (): "light" | "dark" | null => {
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null
  }
  return null
}
