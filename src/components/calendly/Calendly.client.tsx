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
  const [widgetInitialized, setWidgetInitialized] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(scriptAlreadyLoaded)

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
    if (isString(colors.background)) p.set("background_color", format(colors?.background)!)
    if (isString(colors.text))       p.set("text_color", format(colors.text)!)
    if (isString(colors.button))     p.set("primary_color", format(colors.button)!)
    if (isString(data?.utm_campaign)) p.set("utm_campaign", data?.utm_campaign ?? "")
    if (isString(data?.utm_source))   p.set("utm_source", data?.utm_source ?? "")
    return `https://calendly.com/${calendlyId}?${p.toString()}`
  }, [
    calendlyId,
    colors,
    data,
    hideDetails,
    hideEventTypeDetails,
    hideCookieSettings,
  ])

  /* ---------- init on first visibility ------------------- */
  const onAnimate = useCallback(
    (visible: boolean) => {
      if (!visible || !scriptLoaded || widgetInitialized) return

      const tryInit = (attempt = 0): void => {
        if (window.Calendly) {
          calendlyRef.current?.setAttribute("data-url", dataUrl)
          window.Calendly.initInlineWidget({
            url: dataUrl,
            parentElement: calendlyRef.current!,
            prefill: safePrefill(),
          })
          setWidgetInitialized(true)
          return
        }
        if (attempt < 10) setTimeout(() => tryInit(attempt + 1), 100)
        else console.warn("Calendly widget failed to load.")
      }

      tryInit()
    },
    [scriptLoaded, widgetInitialized, dataUrl, safePrefill],
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
    document.body.appendChild(s)
  }, [])

  /* ---------- render ------------------------------------- */
  const divStyle: CSSProperties = {
    display: widgetInitialized ? "block" : "none",
    minWidth: 320,
    height: 700,
  }

  return (
    <Animated {...animationProps} onAnimate={onAnimate}>
      {!Boolean(hideLoading) && !widgetInitialized && <Loading />}
      <div ref={calendlyRef} {...rest} style={divStyle} />
    </Animated>
  )
}
