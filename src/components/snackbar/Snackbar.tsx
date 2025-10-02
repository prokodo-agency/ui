import { createIsland } from "@/helpers/createIsland"

import SnackbarServer from "./Snackbar.server"

import type { SnackbarProps } from "./Snackbar.model"

export const Snackbar = createIsland<SnackbarProps>({
  name: "Snackbar",
  Server: SnackbarServer,
  loadLazy: () => import("./Snackbar.lazy"),
})
