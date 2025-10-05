"use client"
import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import DialogClient from "./Dialog.client"
import DialogServer from "./Dialog.server"

import type { DialogProps } from "./Dialog.model"

export default createLazyWrapper<DialogProps>({
  name: "Dialog",
  Client: DialogClient,
  Server: DialogServer,
  isInteractive: () => true,
})
