
import Animated from "@/components/animated/Animated.server"
import Button from "@/components/button/Button.server"
import Headline from "@/components/headline/Headline.server"
import { Icon } from "@/components/icon"

import { AccordionView } from "./Accordion.view"

import type { AccordionProps } from "./Accordion.model"

export default function AccordionServer(props: AccordionProps) {
  return (
    <AccordionView
      {...props}
      AnimatedComponent={Animated}
      ButtonComponent={Button}
      expandedIndex={props.expanded ?? null}
      HeadlineComponent={Headline}
      IconComponent={Icon}
      onToggle={undefined}
    />
  )
}
