import { CalendlyView } from "./Calendly.view"
import type { CalendlyProps } from "./Calendly.model"

export default function CalendlyServer(props: CalendlyProps) {
  return <CalendlyView {...props} />
}
