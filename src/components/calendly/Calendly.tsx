import {
  type FC,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react"

import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Loading } from "../loading"

import type { CalendlyProps } from "./Calendly.model"

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: Record<string, string>
        utm?: Record<string, string>
        branding?: boolean
        hideEventTypeDetails?: boolean
        hideLandingPageDetails?: boolean
        hideGdprBanner?: boolean
        pageSettings?: Record<string, string>
        textColor?: string
        primaryColor?: string
      }) => void
    }
  }
}

let scriptAlreadyLoaded = false

export const Calendly: FC<CalendlyProps> = ({
  calendlyId,
  data,
  color = {
    text: "#4D4D4D",
    button: "#1E90FF",
    background: "#FFFFFF",
  },
  animationProps,
  hideCookieSettings,
  hideEventTypeDetails,
  hideDetails,
  ...props
}) => {
  const calendlyRef = useRef<HTMLDivElement | null>(null)
  const [widgetInitialized, setWidgetInitialized] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(scriptAlreadyLoaded)

  const formatColor = (color?: string) => color?.replaceAll("#", "")

  const getSafePrefill = (
    data?: CalendlyProps["data"],
  ): Record<string, string> => {
    const result: Record<string, string> = {}
    if (!data) return result

    for (const key of ["name", "email", "firstName", "lastName"] as const) {
      if (isString(data[key])) {
        result[key] = data[key]!
      }
    }

    return result
  }

  const dataUrl = useMemo(() => {
    const urlParams = new URLSearchParams()

    if (hideDetails) urlParams.set("hide_landing_page_details", "1")
    if (hideEventTypeDetails) urlParams.set("hide_event_type_details", "1")
    if (hideCookieSettings) urlParams.set("hide_gdpr_banner", "1")
    if (isString(color.background))
      urlParams.set("background_color", formatColor(color.background)!)
    if (isString(color.text))
      urlParams.set("text_color", formatColor(color.text)!)
    if (isString(color.button))
      urlParams.set("primary_color", formatColor(color.button)!)
    if (isString(data?.utm_campaign))
      urlParams.set("utm_campaign", data?.utm_campaign ?? "")
    if (isString(data?.utm_source))
      urlParams.set("utm_source", data?.utm_source ?? "")

    return `https://calendly.com/${calendlyId}?${urlParams.toString()}`
  }, [
    calendlyId,
    color,
    data,
    hideDetails,
    hideEventTypeDetails,
    hideCookieSettings,
  ])

  const handleAnimate = useCallback(
    (isVisible: boolean) => {
      if (isVisible && scriptLoaded && !widgetInitialized) {
        const maxRetries = 10
        let retryCount = 0

        const tryInit = () => {
          if (window.Calendly) {
            calendlyRef.current?.setAttribute("data-url", dataUrl)
            window.Calendly.initInlineWidget({
              url: dataUrl,
              parentElement: calendlyRef.current!,
              prefill: getSafePrefill(data),
            })
            setWidgetInitialized(true)
          } else if (retryCount < maxRetries) {
            retryCount += 1
            setTimeout(tryInit, 100)
          } else {
            console.warn("Calendly widget failed to load.")
          }
        }

        tryInit()
      }
    },
    [scriptLoaded, widgetInitialized, dataUrl, data],
  )

  // Load script once
  useEffect(() => {
    if (scriptAlreadyLoaded || typeof document === "undefined") {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = () => {
      scriptAlreadyLoaded = true
      setScriptLoaded(true)
    }

    document.body.appendChild(script)
  }, [])

  return (
    <Animated {...animationProps} onAnimate={handleAnimate}>
      {!widgetInitialized && <Loading />}
      <div
        {...props}
        ref={calendlyRef}
        style={{
          display: widgetInitialized ? "block" : "none",
          minWidth: 320,
          height: 700,
        }}
      />
    </Animated>
  )
}

Calendly.displayName = "Calendly"
