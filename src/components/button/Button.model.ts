import type { IconProps } from "../icon"
import type { LinkProps } from "../link"
import type { Ref, ButtonHTMLAttributes, ComponentType, ReactNode } from "react"

export type ButtonRef = Ref<HTMLButtonElement>;

export type ButtonColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

export type ButtonProperties = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  ref?: ButtonRef
  priority?: boolean
  color?: ButtonColor
  fullWidth?: boolean
  contentClassName?: string
  loading?: boolean
  redirect?: LinkProps
  disabled?: boolean
  variant?: "contained" | "outlined" | "text"
}

// Default button with text (title will be used as aria-label)
export type ButtonDefaultProps = Omit<ButtonProperties, "title"> & {
  title: string
  iconProps?: IconProps
  "aria-label"?: string
}

// Icon button
export type ButtonIconProps =
  | (Omit<ButtonProperties, "title" | "aria-label"> & {
      iconProps: IconProps
      "aria-label": string
    })
  | (Omit<ButtonProperties, "title" | "aria-label"> & {
      iconProps: IconProps
      inert: boolean
    })

export type ButtonProps = ButtonIconProps | ButtonDefaultProps

export type ButtonViewProps = ButtonProps & {
  isIconOnly: boolean
  LinkComponent: ComponentType<{
    href: string;
    className: string
    disabled?: boolean
    id?: string
    children: ReactNode
  }>
  buttonRef?: ButtonRef;
}
