import { createIsland } from "@/helpers/createIsland"

import DrawerServer from "./Drawer.server"

import type { DrawerProps } from "./Drawer.model"

/**
 * The “Island” entrypoint.  Consumers import this file:
 *
 *    import { Drawer } from '@/components/drawer'
 *
 * and use <Drawer open={...} ...>...</Drawer> in their JSX.
 */
export const Drawer = createIsland<DrawerProps>({
  name: "Drawer",
  Server: DrawerServer,
  loadLazy: () => import("./Drawer.lazy"),
})

export default Drawer
