"use client"
import { memo } from "react"

import { LinkView } from "./Link.view"
import BaseLink from "../base-link/BaseLink.server"

import type { LinkProps } from "./Link.model"

const LinkClient: React.FC<LinkProps> = memo((props) => {
  const { href, onClick } = props

  const linkTag = onClick && !href ? "span" : "a"
  const hasHandlers = Boolean(onClick) || Boolean(props.onKeyDown)

  return (
    <LinkView
      {...props}
      hasHandlers={hasHandlers}
      LinkTag={linkTag}
      BaseLinkComponent={BaseLink}
    />
  )
})

LinkClient.displayName = "LinkClient"
export default LinkClient
