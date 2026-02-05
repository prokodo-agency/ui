import type { AnimatedProps } from "../animated"
import type { ComponentType, HTMLAttributes } from "react"

/**
 * Calendly color customization options.
 */
export type CalendlyColorOptions = {
  /** Primary text color (hex or CSS color). */
  text?: string
  /** Button color (hex or CSS color). */
  button?: string
  /** Background color (hex or CSS color). */
  background?: string
}

/**
 * Custom form answer fields for Calendly prefill.
 */
export type CalendlyDataCustomAnswers = {
  [key: string]: string
}

/**
 * Prefill data for Calendly form fields.
 */
export type CalendlyData = {
  /** UTM campaign parameter. */
  utm_campaign?: string
  /** UTM source parameter. */
  utm_source?: string
  /** Visitor name (prefills name field). */
  name?: string
  /** Visitor email (prefills email field). */
  email?: string
  /** Visitor location. */
  location?: string
  /** Custom form answer fields. */
  customAnswers?: CalendlyDataCustomAnswers
}

/**
 * Calendly scheduling widget embed component.
 * Requires Calendly account and scheduling page URL.
 *
 * @example
 * ```tsx
 * <Calendly
 *   calendlyId="your-username/schedule"
 *   data={{ name: "John", email: "john@example.com" }}
 *   colors={{ button: "#007bff" }}
 * />
 * ```
 *
 * @a11y Inherits accessibility from Calendly iframe.
 * @ssr Requires client rendering for interactive widget.
 */
export type CalendlyProps = HTMLAttributes<HTMLDivElement> & {
  /** Calendly URL identifier (format: "username/schedule-name"). */
  calendlyId: string
  /** Prefill form data (name, email, custom fields). */
  data?: CalendlyData
  /** Animation config (entrance effect). */
  animationProps?: AnimatedProps
  /** Color scheme customization. */
  colors?: CalendlyColorOptions
  /** Hide Calendly loading spinner. */
  hideLoading?: boolean
  /** Hide cookie settings link in Calendly widget. */
  hideCookieSettings?: boolean
  /** Hide event type details in Calendly. */
  hideEventTypeDetails?: boolean
  /** Hide event details and booking info. */
  hideDetails?: boolean
  /** Custom loading component (shown while Calendly loads). */
  LoadingComponent?: ComponentType<{}>
}
