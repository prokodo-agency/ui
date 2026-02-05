import type { CardProps } from "../card"
import type { IconProps, IconName } from "../icon"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"
import type { HTMLAttributes, ReactNode } from "react"

/**
 * Supported list render types.
 */
export type ListType = "default" | "icon" | "card"

/**
 * Allowed visual variants for list items (excluding white).
 */
export type ListVariant = Omit<Variants, "white">

/**
 * Simple list title with plain string content.
 */
export type ListItemTitle = {
  /** Optional item id. */
  id?: string
  /** Title string. */
  title: string
}

/**
 * List title with custom ReactNode content.
 */
export type ListItemTitleNode = {
  /** Required item id for node content. */
  id: string
  /** Title node (rich content). */
  title: ReactNode
}

/**
 * List item config for card layout.
 */
export type ListCardItemProps = (ListItemTitle | ListItemTitleNode) & {
  /** Description text or node. */
  desc?: string | ReactNode
  /** Icon name or custom icon node. */
  icon?: IconName | ReactNode
  /** Visual variant. */
  variant?: ListVariant
  /** Icon props if using an IconName. */
  iconProps?: IconProps
  /** Optional redirect link props. */
  redirect?: LinkProps
  /** Inner content class name. */
  innerClassName?: string
  /** Item click handler (receives item config). */
  onClick?: (e?: ListCardItemProps) => void
} & Omit<CardProps, "children">

/**
 * List item config for default list layout.
 */
export type ListDefaultItemProps = (ListItemTitle | ListItemTitleNode) & {
  /** Description text or node. */
  desc?: string | ReactNode
  /** Custom class name for the item. */
  className?: string
  /** Icon name or custom icon node. */
  icon?: IconName | ReactNode
  /** Visual variant. */
  variant?: ListVariant
  /** Optional redirect link props. */
  redirect?: LinkProps
  /** Item click handler (receives item config). */
  onClick?: (e?: ListDefaultItemProps) => void
}

/**
 * Default list options.
 */
export type ListDefaultOptions = {
  /** Shared icon props for default list items. */
  icon?: IconProps
}

/**
 * Union of list item configurations.
 */
export type ListItemProps = ListDefaultItemProps | ListCardItemProps

/**
 * List props for default layout.
 */
export type ListDefaultProps = HTMLAttributes<HTMLUListElement> & {
  /** Render type. */
  type?: "default"
  /** Visual variant. */
  variant?: ListVariant
  /** List root class name. */
  className?: string
  /** Description class name. */
  classNameDesc?: string
  /** Default list options. */
  options?: ListDefaultOptions
  /** Items to render. */
  items: ListDefaultItemProps[]
  /** Optional click handler on the list root. */
  onClick?: () => void
}

/**
 * List props for card layout.
 */
export type ListCardProps = HTMLAttributes<HTMLUListElement> & {
  /** Render type. */
  type?: "card"
  /** Visual variant. */
  variant?: ListVariant
  /** List root class name. */
  className?: string
  /** Description class name. */
  classNameDesc?: string
  /** Options not supported for card lists. */
  options?: undefined
  /** Items to render. */
  items: ListCardItemProps[]
  /** Optional click handler on the list root. */
  onClick?: () => void
}

/**
 * Union of supported list props.
 */
export type ListProps = ListDefaultProps | ListCardProps
