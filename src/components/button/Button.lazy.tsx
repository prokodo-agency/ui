'use client'
import { useHydrationReady } from '@/hooks/useHydrationReady'

import ButtonClient from './Button.client'
import ButtonStatic from './Button.server'

import type { ButtonProps } from './Button.model'
import type { JSX } from 'react'

export default function ButtonClientWrapper(props: ButtonProps): JSX.Element {
  const hasInteraction = !!props.onClick || !!props.onKeyDown || !!props.redirect
  const [visible, ref] = useHydrationReady({ enabled: hasInteraction })

  const shouldHydrate = hasInteraction && visible

  if (shouldHydrate) {
    return <ButtonClient {...props} />
  }

  return (
    <div ref={ref}>
      <ButtonStatic {...props} />
    </div>
  )
}
