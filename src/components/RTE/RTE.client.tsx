"use client"

import { memo, useEffect, useRef, useState, useCallback, type JSX } from "react"

import { handleValidation } from "@/components/input/InputValidation"
import { create } from "@/helpers/bem"
import { isNull, isString } from "@/helpers/validations"

import styles from "./RTE.module.scss"
import { ensureQuillSnowStyles } from "./RTE.styles"
import themeCSS from "./RTE.theme"
import {
  addClasses,
  decorateToolbar,
  syncPickerSelected,
  cleanupQuill,
} from "./RTE.utils"
import { RTEView } from "./RTE.view"

import type { RTEProps } from "./RTE.model"
import type Quill from "quill"

export const bem = create(styles, "RTE")

const ALLOWED_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "link",
  "code-block",
  "image",
]

function RTEClient(props: RTEProps): JSX.Element {
  const {
    name,
    value,
    onChange,
    onValidate,
    required,
    maxLength,
    errorTranslations,
    errorText,
    disabled,
    readOnly,
    placeholder,
    rteOptions,
    rteToolbar,
    ...rest
  } = props

  const mountRef = useRef<HTMLDivElement | null>(null)
  const surfaceRef = useRef<HTMLDivElement | null>(null)

  const quillRef = useRef<Quill>(null)
  const htmlRef = useRef<string>(value ?? "")

  // keep latest callbacks in refs so init-effect won't re-run on every render
  const onChangeRef = useRef<RTEProps["onChange"]>(onChange)
  const onValidateRef = useRef<RTEProps["onValidate"]>(onValidate)
  const validationCfgRef = useRef({ name, required, errorTranslations })
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    onValidateRef.current = onValidate
  }, [onValidate])
  useEffect(() => {
    validationCfgRef.current = { name, required, errorTranslations }
  }, [name, required, errorTranslations])

  const rteOptionsRef = useRef(rteOptions)
  const rteToolbarRef = useRef(rteToolbar)

  useEffect(() => {
    rteOptionsRef.current = rteOptions
  }, [rteOptions])

  useEffect(() => {
    rteToolbarRef.current = rteToolbar
  }, [rteToolbar])

  const startYRef = useRef(0)
  const startHRef = useRef(0)
  const rootClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null)

  const [err, setErr] = useState<string | undefined>(errorText)

  // avoid "paste-back" loop that resets selection/cursor
  const lastEmittedHtmlRef = useRef<string>("")

  useEffect(() => {
    if (isString(errorText)) setErr(errorText)
  }, [errorText])

  // stable validation using refs
  const emitValidation = useCallback((plainText: string) => {
    const cfg = validationCfgRef.current
    handleValidation(
      "text",
      cfg.name,
      plainText,
      cfg.required,
      undefined,
      undefined,
      undefined,
      cfg.errorTranslations,
      (n, e) => {
        setErr(e)
        onValidateRef.current?.(n, e)
      },
    )
  }, [])

  const syncFromQuill = useCallback(() => {
    const q = quillRef.current
    /* istanbul ignore next */
    if (!q) return

    const html = q.root.innerHTML
    /* istanbul ignore next */
    const text = (q.getText()?.trim?.() ?? "") as string

    htmlRef.current = html
    lastEmittedHtmlRef.current = html
    emitValidation(text)
    onChangeRef.current?.(html, { text })
  }, [emitValidation])

  const getQuillContainer = useCallback((): HTMLElement | null => {
    const surface = surfaceRef.current
    /* istanbul ignore next */
    if (!surface) return null
    return surface.querySelector(".ql-container") as HTMLElement | null
  }, [])

  const startResize = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (Boolean(disabled) || Boolean(readOnly)) return

      const container = getQuillContainer()
      if (!container) return

      startYRef.current = e.clientY
      startHRef.current = container.getBoundingClientRect().height

      const onMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startYRef.current
        const next = Math.max(160, startHRef.current + dy)
        container.style.height = `${next}px`
      }

      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
      }

      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [disabled, readOnly, getQuillContainer],
  )

  useEffect(() => {
    ensureQuillSnowStyles(themeCSS)
    let cancelled = false

    const mountEl = mountRef.current
    const surfaceEl = surfaceRef.current

    async function init() {
      if (!mountEl || !surfaceEl) return
      if (Boolean(disabled) || Boolean(readOnly)) return

      cleanupQuill(surfaceEl, mountEl)

      const QuillImport = await import("quill/dist/quill")
      /* istanbul ignore next */
      const Quill = QuillImport?.default ?? QuillImport
      /* istanbul ignore next */
      if (cancelled) return

      // Register Image blot that persists alt/title in delta
      try {
        const BaseImage = Quill.import("formats/image")

        class ImageWithAlt extends BaseImage {
          static blotName = "image"
          static tagName = "IMG"

          static formats(domNode: HTMLElement) {
            /* istanbul ignore next */
            const formats = (super.formats?.(domNode) ?? {}) as Record<
              string,
              unknown
            >
            const alt = domNode.getAttribute("alt")
            const title = domNode.getAttribute("title")
            if (alt != null) formats.alt = alt
            if (title != null) formats.title = title
            return formats
          }

          format(name: string, value: unknown) {
            if (name === "alt") {
              /* istanbul ignore next */
              const v = typeof value === "string" ? value.trim() : ""
              if (v) this.domNode.setAttribute("alt", v)
              else this.domNode.removeAttribute("alt")
              return
            }

            if (name === "title") {
              /* istanbul ignore next */
              const v = typeof value === "string" ? value.trim() : ""
              if (v) this.domNode.setAttribute("title", v)
              else this.domNode.removeAttribute("title")
              return
            }

            super.format(name, value)
          }
        }

        // IMPORTANT: register under the same key
        Quill.register("formats/image", ImageWithAlt, true)
      } catch {
        // editor still works; alt persistence may be limited
      }

      const opts = rteOptionsRef.current
      const extraToolbar = rteToolbarRef.current

      const baseToolbar = [
        [{ header: [3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "code-block", "image"],
        ["clean"],
      ]

      const toolbarContainer =
        Array.isArray(extraToolbar) && extraToolbar.length
          ? [...baseToolbar, extraToolbar]
          : baseToolbar

      // Custom matchers, add them carefully without nuking attributes.
      const q = new Quill(mountEl, {
        ...opts,
        theme: "snow",
        placeholder: placeholder ?? "",
        formats: ALLOWED_FORMATS,
        modules: {
          history: {
            delay: 1000,
            maxStack: 200,
            userOnly: true,
            ...(opts?.modules?.history ?? {}),
          },
          ...opts?.modules,
          toolbar: toolbarContainer,
          clipboard: {
            ...(opts?.modules?.clipboard ?? {}),
          },
        },
      })

      quillRef.current = q

      const Keyboard = q.getModule("keyboard") as {
        addBinding?: (
          binding: Record<string, unknown>,
          handler: (
            range: { index: number; length: number },
            ctx: { format?: Record<string, unknown> },
          ) => boolean | void,
        ) => void
      } | null

      Keyboard?.addBinding?.(
        {
          key: 13, // Enter
          shiftKey: false,
          collapsed: true,
        },
        (range, ctx) => {
          // ctx.format contains current formats at cursor
          const header = ctx?.format?.header

          // Only intervene when user is currently inside a header (2/3/4)
          if (!header) return true

          // Let Quill insert a normal newline first
          q.insertText(range.index, "\n", "user")

          // Ensure the new line is NOT a header anymore (paragraph)
          q.formatLine(range.index + 1, 1, { header: false }, "user")

          // Put cursor on the new line
          q.setSelection(range.index + 1, 0, "silent")

          // Prevent Quill's default Enter handling (which can keep header formatting)
          return false
        },
      )

      // expose instance to consumer (app wrapper)
      opts?.onInit?.(q)

      addClasses(q.root, bem("editor"))

      const toolbarModule = q.getModule("toolbar") as {
        container?: HTMLElement
      } | null
      addClasses(toolbarModule?.container ?? null, bem("toolbar"))
      const toolbarEl = toolbarModule?.container ?? null
      if (toolbarEl) {
        decorateToolbar(toolbarEl)
        syncPickerSelected(toolbarEl)

        const obs = new MutationObserver(() => syncPickerSelected(toolbarEl))
        obs.observe(toolbarEl, {
          subtree: true,
          attributes: true,
          attributeFilter: ["class"],
        })

        // store obs if you want cleanup later, or disconnect in your effect cleanup
      }

      const tooltipEl = (q.container as HTMLElement).querySelector(
        ".ql-tooltip",
      )
      addClasses(tooltipEl, bem("tooltip"))

      const mo = new MutationObserver(() => {
        const t = (q.container as HTMLElement).querySelector(".ql-tooltip")
        if (t) addClasses(t, bem("tooltip"))
      })
      mo.observe(q.container as HTMLElement, { subtree: true, childList: true })

      const container = getQuillContainer()
      if (container && !container.style.height) container.style.height = "220px"

      // Load initial HTML (formatting preserved now)
      if (htmlRef.current)
        q.clipboard.dangerouslyPasteHTML(htmlRef.current, "silent")
      /* istanbul ignore next */ emitValidation(q.getText()?.trim?.() ?? "")

      q.on("text-change", (_d: unknown, _o: unknown, source: string) => {
        if (source === "user") syncFromQuill()
      })

      // Alt-text: set via blot.format so Quill persists it
      const root = q.root as HTMLElement
      const onRootClick = (ev: MouseEvent) => {
        /* istanbul ignore next */

        const el = ev.target as HTMLElement | null
        if (!el || el.tagName !== "IMG") return

        const img = el as HTMLImageElement
        const currentAlt = img.getAttribute("alt") ?? ""
        const nextAlt = window.prompt("Alt text", currentAlt)
        if (nextAlt == null) return

        const v = nextAlt.trim()

        // find blot and format (this persists in delta)
        try {
          const blot = Quill.find(img)
          if (!isNull(blot?.format)) {
            blot.format("alt", v)
            q.update?.("user")
            syncFromQuill()
            return
          }
        } catch {
          // fallback below
        }

        // fallback: set attribute (may be overwritten by Quill)
        if (v) img.setAttribute("alt", v)
        else img.removeAttribute("alt")
        q.update?.("user")
        syncFromQuill()
      }

      rootClickHandlerRef.current = onRootClick
      root.addEventListener("click", onRootClick)
    }

    void init()

    return () => {
      cancelled = true
      const q = quillRef.current
      const h = rootClickHandlerRef.current
      if (q?.root && h) (q.root as HTMLElement).removeEventListener("click", h)

      rootClickHandlerRef.current = null
      quillRef.current = null

      cleanupQuill(surfaceEl, mountEl)
    }
  }, [
    disabled,
    readOnly,
    placeholder,
    emitValidation,
    syncFromQuill,
    getQuillContainer,
  ])

  // External value updates:
  // do NOT paste while editor is focused (prevents cursor jumping)
  useEffect(() => {
    if (isNull(value)) return

    const q = quillRef.current
    if (Boolean(q?.hasFocus?.())) return

    const next = String(value)
    if (next === htmlRef.current) return
    if (next === lastEmittedHtmlRef.current) {
      htmlRef.current = next
      return
    }
    htmlRef.current = next

    /* istanbul ignore next */
    if (q) {
      q.clipboard.dangerouslyPasteHTML(next, "silent")
      /* istanbul ignore next */
      emitValidation((q.getText()?.trim?.() ?? "") as string)
    }
  }, [value, emitValidation])

  return (
    <RTEView
      {...rest}
      disabled={disabled}
      errorText={err}
      errorTranslations={errorTranslations}
      htmlValue={htmlRef.current}
      maxLength={maxLength}
      mountRef={mountRef}
      name={name}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      rteToolbar={rteToolbar}
      showResize={!Boolean(disabled) && !Boolean(readOnly)}
      surfaceRef={surfaceRef}
      value={htmlRef.current}
      onChange={onChange}
      onStartResize={startResize}
      onValidate={onValidate}
      onBlur={e => {
        const q = quillRef.current
        /* istanbul ignore next */
        if (q) emitValidation((q.getText()?.trim?.() ?? "") as string)
        rest.onBlur?.(e)
      }}
      onFocus={e => {
        rest.onFocus?.(e)
      }}
    />
  )
}

export default memo(RTEClient)
