"use client"
import { forwardRef, type JSX } from "react"

import BaseLink from "../base-link/BaseLink.client"

import { ButtonView } from "./Button.view"

import type { ButtonRef, ButtonProps, ButtonDefaultProps } from "./Button.model"

function ButtonClient(props: ButtonProps, ref: ButtonRef): JSX.Element {
  const { loading, iconProps = {}, ...rest } = props
  const isIconOnly =
    typeof iconProps?.name === "string" && !(props as ButtonDefaultProps).title

  return (
    <ButtonView
      {...rest}
      buttonRef={ref}
      iconProps={iconProps}
      isIconOnly={Boolean(isIconOnly)}
      LinkComponent={BaseLink}
      loading={loading}
    />
  )
}

export default forwardRef<HTMLButtonElement, ButtonProps>(ButtonClient)
