'use client'

import { useHydrationReady } from '@/hooks/useHydrationReady'

import ButtonClient from './Button.client'
import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'
import type { JSX } from "react"

type WrapperProps = ButtonProps & { priority?: boolean }

export default function ButtonWrapper({
  priority = false,
  ...props
}: WrapperProps): JSX.Element {
  const hasInteraction =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  /* If priority → skip observer */
  const [visible, ref] = useHydrationReady({
    enabled: hasInteraction && !priority,
  })

  if (hasInteraction && (priority || visible)) {
    return <ButtonClient {...props} />
  }

  /* Placeholder: identical to server HTML */
  return (
    <div ref={ref} data-island="button">
      <ButtonServer {...props} />
    </div>
  )
}
