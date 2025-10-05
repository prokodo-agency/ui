"use client"

import {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  type CSSProperties,
  type JSX,
} from "react"

import { Animated } from "@/components/animated"
import { Loading } from "@/components/loading"
import { isString } from "@/helpers/validations"

import type { CalendlyProps } from "./Calendly.model"

let scriptAlreadyLoaded = false
let cssAlreadyLoaded = false
let devWarnedTwice = false

export default function CalendlyClient(props: CalendlyProps): JSX.Element {
  const {
    calendlyId,
    data,
    colors = {
      text: "#4D4D4D",
      button: "#1E90FF",
      background: "#FFFFFF",
    },
    animationProps,
    hideLoading,
    hideCookieSettings,
    hideEventTypeDetails,
    hideDetails,
    ...rest
  } = props

  const calendlyRef = useRef<HTMLDivElement | null>(null)
  const visibleRef = useRef(false)
  const didInitRef = useRef(false)
  const [widgetInitialized, setWidgetInitialized] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(scriptAlreadyLoaded)
  const [error, setError] = useState<string | null>(null)

  /* ---------- helpers ------------------------------------ */
  const format = (c?: string) => c?.replaceAll("#", "")

  const safePrefill = useCallback((): Record<string, string> => {
    const res: Record<string, string> = {}
    if (!data) return res
    for (const k of ["name", "email", "firstName", "lastName"] as const) {
      if (isString(data[k])) res[k] = data[k]!
    }
    return res
  }, [data])

  const dataUrl = useMemo(() => {
    const p = new URLSearchParams()
    if (Boolean(hideDetails)) p.set("hide_landing_page_details", "1")
    if (Boolean(hideEventTypeDetails)) p.set("hide_event_type_details", "1")
    if (Boolean(hideCookieSettings)) p.set("hide_gdpr_banner", "1")
    if (isString(colors.background))
      p.set("background_color", format(colors?.background)!)
    if (isString(colors.text)) p.set("text_color", format(colors.text)!)
    if (isString(colors.button)) p.set("primary_color", format(colors.button)!)
    if (isString(data?.utm_campaign))
      p.set("utm_campaign", data?.utm_campaign ?? "")
    if (isString(data?.utm_source)) p.set("utm_source", data?.utm_source ?? "")
    return calendlyId
      ? `https://calendly.com/${calendlyId}?${p.toString()}`
      : ""
  }, [
    calendlyId,
    colors,
    data,
    hideDetails,
    hideEventTypeDetails,
    hideCookieSettings,
  ])

  // single place to try initializing the inline widget
  const tryInit = useCallback(
    (attempt = 0) => {
      const host = calendlyRef.current
      if (!host) return
      // hard guards (dev StrictMode, re-renders, retries)
      if (didInitRef.current) return
      if (host.dataset.initialized === "1") return
      if (widgetInitialized) return
      if (!calendlyId) {
        setError("Calendly ID missing.")
        return
      }
      if (!dataUrl) {
        setError("Calendly URL could not be built.")
        return
      }
      if (window.Calendly) {
        // clear any stale children (defensive; avoids double iframes)
        try {
          host.innerHTML = ""
        } catch {}
        host.setAttribute("data-url", dataUrl)
        window.Calendly.initInlineWidget({
          url: dataUrl,
          parentElement: host,
          prefill: safePrefill(),
        })
        setWidgetInitialized(true)
        // mark initialized in both ref and DOM
        didInitRef.current = true
        host.dataset.initialized = "1"
        setWidgetInitialized(true)
        if (process.env.NODE_ENV !== "production" && !devWarnedTwice) {
          devWarnedTwice = true

          console.debug("[Calendly] widget initialized")
        }
        return
      }
      if (attempt < 10) {
        setTimeout(() => tryInit(attempt + 1), 100)
      } else {
        console.warn("Calendly widget failed to load.")
        setError("Calendly widget failed to load.")
      }
    },
    [dataUrl, safePrefill, widgetInitialized, calendlyId],
  )

  /* ---------- init on first visibility ------------------- */
  const onAnimate = useCallback(
    (visible: boolean) => {
      // always remember latest visibility (even before script loads)
      visibleRef.current = visible
      if (!visible || widgetInitialized) return
      // if we’re already loaded, init now; otherwise a later effect will pick it up
      if (scriptLoaded) tryInit()
    },
    [scriptLoaded, widgetInitialized, tryInit],
  )

  // optional cleanup on unmount (helps during hot-reload / route changes in dev)
  useEffect(
    () => () => {
      const host = calendlyRef.current
      if (host) {
        try {
          host.innerHTML = ""
          delete host.dataset.initialized
        } catch {}
      }
      didInitRef.current = false
      // don't reset scriptAlreadyLoaded/cssAlreadyLoaded – those are global
      setWidgetInitialized(false)
    },
    [],
  )

  /* ---------- load external SDK exactly once -------------- */
  useEffect(() => {
    if (scriptAlreadyLoaded || typeof document === "undefined") {
      setScriptLoaded(true)
      return
    }
    const s = document.createElement("script")
    s.src = "https://assets.calendly.com/assets/external/widget.js"
    s.async = true
    s.onload = () => {
      scriptAlreadyLoaded = true
      setScriptLoaded(true)
    }
    s.onerror = () => {
      setError("Calendly script blocked or failed to load.")
    }
    document.body.appendChild(s)

    // safety timeout in case onload never fires (CSP/adblock)
    const watchdog = window.setTimeout(() => {
      if (!scriptAlreadyLoaded)
        setError("Calendly script did not load (timeout).")
    }, 8000)
    return () => clearTimeout(watchdog)
  }, [])

  // Also inject Calendly CSS once (prevents blank UI)
  useEffect(() => {
    if (cssAlreadyLoaded || typeof document === "undefined") return
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    document.head.appendChild(link)
    cssAlreadyLoaded = true
  }, [])

  // If script finishes loading after we became visible, init immediately
  useEffect(() => {
    if (scriptLoaded && visibleRef.current && !widgetInitialized) {
      tryInit()
    }
  }, [scriptLoaded, widgetInitialized, tryInit])

  // Last-resort: if the wrapper never fires onAnimate, still attempt init after mount
  useEffect(() => {
    if (scriptLoaded && !widgetInitialized) {
      // small delay to let layout settle
      const id = setTimeout(() => tryInit(), 0)
      return () => clearTimeout(id)
    }
    return
  }, [scriptLoaded, widgetInitialized, tryInit])

  /* ---------- render ------------------------------------- */
  const divStyle: CSSProperties = {
    display: "block",
    minWidth: 320,
    height: 700,
  }

  return (
    <Animated {...animationProps} onAnimate={onAnimate}>
      {!Boolean(hideLoading) &&
        !Boolean(widgetInitialized) &&
        !isString(error) && <Loading />}
      {isString(error) && (
        <div role="alert" style={{ padding: 12 }}>
          <p style={{ margin: 0 }}>{error}</p>
          {dataUrl && (
            <p style={{ marginTop: 8 }}>
              <a href={dataUrl} rel="noreferrer" target="_blank">
                Open Calendly in a new tab
              </a>
            </p>
          )}
        </div>
      )}
      <div ref={calendlyRef} {...rest} style={divStyle} />
    </Animated>
  )
}
