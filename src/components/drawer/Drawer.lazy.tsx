'use client'
import { createLazyWrapper } from '@/helpers/createLazyWrapper'
import DrawerClient from './Drawer.client'
import DrawerServer from './Drawer.server'
import type { DrawerProps } from './Drawer.model'

/**
 * We wrap DrawerClient/DrawerServer in a LazyWrapper,
 * so that on the server we render <DrawerServer>, but
 * on the client we hydrate into <DrawerClient>.
 */
export default createLazyWrapper<DrawerProps>({
  name: 'Drawer',
  Client: DrawerClient,
  Server: DrawerServer,
  isInteractive: () => true
})
