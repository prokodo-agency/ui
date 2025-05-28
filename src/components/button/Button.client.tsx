
'use client'
import Link from '../link/Link.client'
import { Loading } from '../loading'

import { ButtonView } from './Button.view'

import type { ButtonProps, ButtonDefaultProps } from './Button.model'
import type { JSX } from "react"

export default function ButtonClient(props: ButtonProps): JSX.Element {
  const { loading, iconProps = {}, ...rest } = props
  const isIconOnly =
    typeof iconProps?.name === "string" && !(props as ButtonDefaultProps).title

  const finalIconProps = Boolean(loading) ? { name: undefined } : iconProps

  return (
    <>
      {Boolean(loading) && <Loading size="xs" />}
      <ButtonView
        {...rest}
        iconProps={finalIconProps}
        isIconOnly={Boolean(isIconOnly)}
        LinkComponent={Link}
      />
    </>
  )
}
