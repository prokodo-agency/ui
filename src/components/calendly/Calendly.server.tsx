import { CalendlyView } from "./Calendly.view"

import type { CalendlyProps } from "./Calendly.model"
import type { JSX } from "react"

export default function CalendlyServer({
  ...rest
}: CalendlyProps): JSX.Element {
  delete rest?.hideCookieSettings
  return <CalendlyView {...rest} />
}
