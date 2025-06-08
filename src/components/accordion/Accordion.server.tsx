
import { AccordionView } from "./Accordion.view"

import type { AccordionProps } from "./Accordion.model"
import type { JSX } from "react"

export default function AccordionServer(props: AccordionProps): JSX.Element {
  return (
    <AccordionView
      {...props}
      expandedIndex={props.expanded ?? null}
      onToggle={undefined}
    />
  )
}
