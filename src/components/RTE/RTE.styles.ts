// quillSnowStyles.ts
let injected = false

export function ensureQuillSnowStyles(cssText: string): void {
  if (injected) return
  if (typeof document === "undefined") return

  const id = "rte-quill-snow"
  if (document.getElementById(id)) {
    injected = true
    return
  }

  const style = document.createElement("style")
  style.id = id
  style.textContent = cssText
  document.head.appendChild(style)
  injected = true
}
