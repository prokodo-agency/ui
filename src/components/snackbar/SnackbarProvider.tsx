import { createIsland } from "@/helpers/createIsland"

export const SnackbarProvider = createIsland({
  name: "SnackbarProvider",
  Server: ({ children }) => <>{children}</>, // renders nothing on SSR
  loadLazy: /* istanbul ignore next */ () => import("./SnackbarProvider.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
