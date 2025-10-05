import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SnackbarClient from "./Snackbar.client"
import SnackbarServer from "./Snackbar.server"

import type { SnackbarProps } from "./Snackbar.model"

export default createLazyWrapper<SnackbarProps>({
  name: "Snackbar",
  Client: SnackbarClient,
  Server: SnackbarServer,
})
