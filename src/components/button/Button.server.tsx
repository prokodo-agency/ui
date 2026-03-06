import BaseLink from "../base-link/BaseLink.server"

import { ButtonView } from "./Button.view"

import type { ButtonProps } from "./Button.model"
import type { JSX } from "react"

export default function ButtonServer(p: ButtonProps): JSX.Element {
  const isIconOnly = p.iconProps?.name && !("title" in p && p.title)
  return (
    <ButtonView
      {...p}
      isIconOnly={Boolean(isIconOnly)}
      LinkComponent={BaseLink}
    />
  )
}
