import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./RTE.module.scss"

export const bem = create(styles, "RTE")

export function addClasses(el: Element | null, className: string): void {
  if (!el) return
  className
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(c => el.classList.add(c))
}

export function decorateToolbar(toolbarEl: HTMLElement): void {
  toolbarEl.querySelectorAll("button").forEach(btn => {
    addClasses(btn, bem("toolbar__button"))
    const ql = Array.from(btn.classList).find(c => c.startsWith("ql-"))
    if (isString(ql))
      addClasses(btn, bem("toolbar__button", { [ql.slice(3)]: true }))
  })

  toolbarEl.querySelectorAll("button svg").forEach(svg => {
    addClasses(svg, bem("toolbar__icon"))
  })

  toolbarEl.querySelectorAll("button svg *").forEach(node => {
    const el = node as Element
    addClasses(el, bem("toolbar__icon__part"))
    if (el.classList.contains("ql-fill"))
      addClasses(el, bem("toolbar__icon__part__fill"))
    if (
      el.classList.contains("ql-stroke") ||
      el.classList.contains("ql-stroke-miter")
    ) {
      addClasses(el, bem("toolbar__icon__part__stroke"))
    }
    if (el.classList.contains("ql-stroke-miter")) {
      addClasses(el, bem("toolbar__icon__part__stroke__miter"))
    }
  })

  // Picker styling (header dropdown e. g.)
  toolbarEl.querySelectorAll(".ql-picker").forEach(picker => {
    addClasses(picker, bem("toolbar__picker"))

    const label = picker.querySelector(".ql-picker-label") as HTMLElement | null
    const options = picker.querySelector(
      ".ql-picker-options",
    ) as HTMLElement | null

    addClasses(label, bem("toolbar__picker__label"))
    addClasses(options, bem("toolbar__picker__options"))

    picker.querySelectorAll(".ql-picker-item").forEach(item => {
      addClasses(item, bem("toolbar__picker__item"))
    })
  })
}

export function syncPickerSelected(toolbarEl: HTMLElement) {
  toolbarEl.querySelectorAll(".ql-picker-item").forEach(el => {
    const item = el as HTMLElement
    // read Quill state
    const selected = item.classList.contains("ql-selected")
    if (selected) item.setAttribute("data-selected", "true")
    else item.removeAttribute("data-selected")
  })
}

export function cleanupQuill(
  surfaceEl: HTMLDivElement | null,
  mountEl: HTMLDivElement | null,
): void {
  if (!surfaceEl || !mountEl) return
  surfaceEl.querySelectorAll(":scope > .ql-toolbar").forEach(el => el.remove())
  surfaceEl.querySelectorAll(".ql-tooltip").forEach(el => el.remove())
  surfaceEl.querySelectorAll(".ql-container").forEach(el => {
    if (el !== mountEl) el.remove()
  })
  mountEl.innerHTML = ""
}
