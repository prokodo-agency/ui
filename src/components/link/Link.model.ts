import type { BaseLinkProps } from "../base-link"
import type { Variants } from "@/types/variants"
import type { MouseEventHandler } from "react"

export type LinkVariants = Omit<Variants, "white">

export type LinkClassNames = {
  label?: string
  link?: string
}

export type LinkDefaultProps = BaseLinkProps & {
  variant?: LinkVariants
  classNames?: LinkClassNames
  hasBackground?: boolean
  ariaLabel?: string
  onPress?: MouseEventHandler<HTMLAnchorElement>
}

export type LinkHrefProps = LinkDefaultProps & {
  href: string
}

export type LinkClickProps = LinkDefaultProps & {
  onPress: MouseEventHandler<HTMLAnchorElement>
}

export type LinkProps = LinkHrefProps | LinkClickProps
