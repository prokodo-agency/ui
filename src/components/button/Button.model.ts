import type { LinkProps } from "../link"
import type { IconProps } from "@/components/icon/Icon.model"
import type { ReactElement, ButtonHTMLAttributes } from "react"

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
  icon?: ReactElement<Partial<IconProps>>
  "aria-label"?: string
}

// Icon button
export type ButtonIconProps =
  | (Omit<ButtonProperties, "title" | "aria-label"> & {
      icon: ReactElement<Partial<IconProps>>
      "aria-label": string
    })
  | (Omit<ButtonProperties, "title" | "aria-label"> & {
      icon: ReactElement<Partial<IconProps>>
      inert: boolean
    })

export type ButtonProps = ButtonIconProps | ButtonDefaultProps
