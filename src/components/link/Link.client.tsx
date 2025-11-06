"use client"
import { memo } from "react"

import { useUIRuntime } from "@/helpers/runtime.client"

import BaseLink from "../base-link/BaseLink.server"

import { LinkView } from "./Link.view"

import type { LinkProps } from "./Link.model"

const LinkClient: React.FC<LinkProps> = memo(props => {
  const { href, onClick } = props
  const { linkComponent: ctxLink } = useUIRuntime()
  const linkTag = onClick && !href ? "span" : "a"
  const hasHandlers = Boolean(onClick) || Boolean(props.onKeyDown)

  return (
    <LinkView
      {...props}
      BaseLinkComponent={BaseLink}
      hasHandlers={hasHandlers}
      LinkTag={linkTag}
      {...(ctxLink ? { linkComponent: ctxLink } : null)}
    />
  )
})

LinkClient.displayName = "LinkClient"
export default LinkClient
