"use client"

import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import { RichTextClient } from "./RichText.client"
import { RichTextServer } from "./RichText.server"

import type { RichTextProps } from "./RichText.model"

export default createLazyWrapper<RichTextProps>({
  name: "RichText",
  Client: RichTextClient,
  Server: RichTextServer,
  hydrateOnVisible: true, // only hydrate when it scrolls into view
  ioOptions: { threshold: 0.1 },
  isInteractive: () => true,
})
