import type { BaseLinkProps } from "../base-link"
import type { Variants } from "@/types/variants"
import type { MouseEventHandler, ComponentType } from "react"

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
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export type LinkHrefProps = LinkDefaultProps & {
  href: string
}

export type LinkClickProps = LinkDefaultProps & {
  onClick: MouseEventHandler<HTMLAnchorElement>
}

export type LinkProps = LinkHrefProps | LinkClickProps

export type LinkViewProps = LinkProps & {
  LinkTag: 'a' | 'span';
  BaseLinkComponent: ComponentType<BaseLinkProps>
  hasHandlers: boolean;
};
