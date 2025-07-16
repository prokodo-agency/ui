import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import ProgressBarClient from "./ProgressBar.client"
import ProgressBarServer from "./ProgressBar.server"

import type { ProgressBarProps } from "./ProgressBar.model"

export default createLazyWrapper<ProgressBarProps>({
  name: "ProgressBar",
  Client: ProgressBarClient,
  Server: ProgressBarServer,
  isInteractive: () => true,
})