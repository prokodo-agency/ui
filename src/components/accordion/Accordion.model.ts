import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
import type { IconProps } from "@/components/icon"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { ReactNode, SyntheticEvent, HTMLAttributes } from "react"

export type AccordionAction = Omit<ButtonProps, "id"> & {
  id: string
}

export type AccordionItem = {
  title: string
  titleOptions?: HeadlineProps
  renderHeader?: ReactNode
  renderHeaderActions?: ReactNode
  renderContent: ReactNode
  actions?: AccordionAction[]
  className?: string
}

export type AccordionProps = {
  id: string
  expanded?: number | null
  className?: string
  variant?: Variants
  titleOptions?: HeadlineProps
  iconProps?: IconProps
  items: AccordionItem[]
  schema?: Schema
  onChange?: (index?: number, e?: SyntheticEvent, expanded?: boolean) => void
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">

export type AccordionViewProps = Omit<
  AccordionProps,
  "expanded" | "onChange" | "onToggle"
> & {
  expandedIndex?: number | null
  onToggle?: (index: number, event: SyntheticEvent<HTMLDivElement>) => void
}
