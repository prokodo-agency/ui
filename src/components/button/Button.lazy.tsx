'use client'

import { useHydrationReady } from '@/hooks/useHydrationReady'

import ButtonClient from './Button.client'
import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'
import type { JSX } from "react"

export default function ButtonWrapper(props: ButtonProps):JSX.Element {
  const hasInteraction =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  /* If caller really wants “always-on”, they can pass lazy={false}. */
  const lazy = props?.lazy ?? true

  const [visible, ref] = useHydrationReady({
    enabled: hasInteraction && lazy,
  })

  if (hasInteraction && (visible || !lazy)) {
    return <ButtonClient {...props} />
  }
  return (
    <div ref={ref}>
      <ButtonServer {...props} />
    </div>
  )
}
