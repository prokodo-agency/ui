
'use client'
import { forwardRef, type JSX } from "react"
import Link from '../link/Link.client'
import { Loading } from '../loading'

import { ButtonView } from './Button.view'

import type { ButtonRef, ButtonProps, ButtonDefaultProps } from './Button.model'

function ButtonClient(
  props: ButtonProps,
  ref: ButtonRef
): JSX.Element {
  const { loading, iconProps = {}, ...rest } = props
  const isIconOnly =
    typeof iconProps?.name === "string" && !(props as ButtonDefaultProps).title

  const finalIconProps = Boolean(loading) ? { name: undefined } : iconProps

  return (
    <>
      {Boolean(loading) && <Loading size="xs" />}
      <ButtonView
        {...rest}
        buttonRef={ref}
        iconProps={finalIconProps}
        isIconOnly={Boolean(isIconOnly)}
        LinkComponent={Link}
      />
    </>
  )
}

export default forwardRef<HTMLButtonElement, ButtonProps>(ButtonClient)
