import { createIsland } from "@/helpers/createIsland"

export const SnackbarProvider = createIsland({
  name: "SnackbarProvider",
  Server: ({ children }) => <>{children}</>,            // renders nothing on SSR
  loadLazy: () => import("./SnackbarProvider.lazy"),
  isInteractive: () => true,
})