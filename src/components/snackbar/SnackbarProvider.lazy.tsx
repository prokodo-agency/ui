import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SnackbarProviderClient from "./SnackbarProvider.client"

import type { SnackbarProviderProps } from "./SnackbarProvider.model"

export default createLazyWrapper<SnackbarProviderProps>({
  name: "Snackbar",
  Client: SnackbarProviderClient,
  isInteractive: () => true,
  Server: () => <></>,
})
