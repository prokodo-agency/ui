import type { AnimatedProps } from "../animated"
import type { ComponentType, HTMLAttributes } from "react"

export type CalendlyColorOptions = {
  text?: string
  button?: string
  background?: string
}

export type CalendlyDataCustomAnswers = {
  [key: string]: string
}

export type CalendlyData = {
  utm_campaign?: string
  utm_source?: string
  name?: string
  email?: string
  location?: string
  customAnswers?: CalendlyDataCustomAnswers
}

export type CalendlyProps = HTMLAttributes<HTMLDivElement> & {
  calendlyId: string
  data?: CalendlyData
  animationProps?: AnimatedProps
  colors?: CalendlyColorOptions
  hideLoading?: boolean
  hideCookieSettings?: boolean
  hideEventTypeDetails?: boolean
  hideDetails?: boolean
  LoadingComponent?: ComponentType<{}>
}
