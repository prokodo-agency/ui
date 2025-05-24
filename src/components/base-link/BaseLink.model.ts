// BaseLink.model.ts
import type { AnchorHTMLAttributes, ReactNode, ElementType } from "react"

export interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children?: ReactNode
  disabled?: boolean
  linkComponent?: ElementType
}
