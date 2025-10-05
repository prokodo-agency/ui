"use client"
import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import LoadingClient from "./Loading.client"
import LoadingServer from "./Loading.server"

import type { LoadingProps } from "./Loading.model"

export default createLazyWrapper<LoadingProps>({
  name: "Loading",
  Client: LoadingClient,
  Server: LoadingServer,
  isInteractive: () => true,
})
