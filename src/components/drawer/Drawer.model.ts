import type { ModalProps } from "@mui/base"
import type { ReactNode } from "react"

export type AnchorProps = "left" | "top" | "right" | "bottom"

export type DrawerProps = Omit<ModalProps, "children"> & {
  anchor?: AnchorProps
  disabled?: boolean
  fullscreen?: boolean
  containerClassName?: string
  renderHeader?: () => ReactNode
  children?: ReactNode
}
