
import Animated from "@/components/animated/Animated.server"
import Button from "@/components/button/Button.server"
import { Icon } from "@/components/icon"

import { AccordionView } from "./Accordion.view"

import type { AccordionProps } from "./Accordion.model"
import type { JSX } from "react"

export default function AccordionServer(props: AccordionProps): JSX.Element {
  return (
    <AccordionView
      {...props}
      AnimatedComponent={Animated}
      ButtonComponent={Button}
      expandedIndex={props.expanded ?? null}
      IconComponent={Icon}
      onToggle={undefined}
    />
  )
}
