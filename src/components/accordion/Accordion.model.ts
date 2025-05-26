import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
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
  renderContent: ReactNode
  actions?: AccordionAction[]
  className?: string
}

export type AccordionIconOverride = {
  expanded?: ReactNode
  collapsed?: ReactNode
}

export type AccordionProps = {
  id: string
  expanded: number | null
  className?: string
  variant?: Variants
  titleOptions?: HeadlineProps
  items: AccordionItem[]
  schema?: Schema
  onChange: (index: number, event?: SyntheticEvent, expanded?: boolean) => void
  iconOverride?: AccordionIconOverride
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">
