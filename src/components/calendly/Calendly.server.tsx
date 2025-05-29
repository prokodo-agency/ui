import { CalendlyView } from "./Calendly.view"

import type { CalendlyProps } from "./Calendly.model"
import type { JSX } from "react"

export default function CalendlyServer(props: CalendlyProps): JSX.Element {
  return <CalendlyView {...props} />
}
