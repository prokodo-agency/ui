import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
import type { ModalProps } from "@mui/base"
import type { Ref, ReactNode, HTMLAttributes } from "react"

export type DialogRef = {
  openDialog: () => void
  closeDialog: () => void
}

export type DialogAction = Omit<ButtonProps, "id"> & {
  id: string
}

export type DialogActions = DialogAction[]

export type DialogTranslations = {
  cancel: string,
  close: string,
}

export type DialogProps = Omit<
  ModalProps,
  "title" | "open" | "ref" | "children"
> & {
  ref?: Ref<DialogRef>
  contentRef?: Ref<HTMLDivElement>
  open?: boolean
  classNameHeader?: string
  scroll?: "paper" | "body"
  fullScreen?: boolean
  showCloseButton?: boolean
  title: string
  titleProps?: HeadlineProps
  contentProps?: HTMLAttributes<HTMLDivElement>
  hideTitle?: boolean
  actions?: ButtonProps[]
  renderHeader?: () => ReactNode
  translations: DialogTranslations
  children?: ReactNode
  containerChildren?: ReactNode
}
