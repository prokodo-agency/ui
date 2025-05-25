// BaseLink.model.ts
import type { AnchorHTMLAttributes, ReactNode, ComponentType } from "react"

export interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children?: ReactNode
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkComponent?: ComponentType<any>
}
