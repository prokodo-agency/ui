import type { CardProps } from "../card"
import type { IconProps, IconName } from "../icon"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"
import type { HTMLAttributes, ReactNode } from "react"

export type ListType = "default" | "icon" | "card"

export type ListVariant = Omit<Variants, "white">

export type ListItemTitle = {
  id?: string
  title: string
}

export type ListItemTitleNode = {
  id: string
  title: ReactNode
}

export type ListCardItemProps = (ListItemTitle | ListItemTitleNode) & {
  desc?: string | ReactNode
  icon?: IconName | ReactNode
  variant?: ListVariant
  iconProps?: IconProps
  redirect?: LinkProps
  innerClassName?: string
  onClick?: (e?: ListCardItemProps) => void
} & Omit<CardProps, "children">

export type ListDefaultItemProps = (ListItemTitle | ListItemTitleNode) & {
  desc?: string | ReactNode
  className?: string
  icon?: IconName | ReactNode
  variant?: ListVariant
  redirect?: LinkProps
  onClick?: (e?: ListDefaultItemProps) => void
}

export type ListDefaultOptions = {
  icon?: IconProps
}

export type ListItemProps = ListDefaultItemProps | ListCardItemProps

export type ListDefaultProps = HTMLAttributes<HTMLUListElement> & {
  type?: "default"
  variant?: ListVariant
  className?: string
  classNameDesc?: string
  options?: ListDefaultOptions
  items: ListDefaultItemProps[]
  onClick?: () => void
}

export type ListCardProps = HTMLAttributes<HTMLUListElement> & {
  type?: "card"
  variant?: ListVariant
  className?: string
  classNameDesc?: string
  options?: undefined
  items: ListCardItemProps[]
  onClick?: () => void
}

export type ListProps = ListDefaultProps | ListCardProps