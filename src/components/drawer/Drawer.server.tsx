import { DrawerView } from './Drawer.view'

import type { DrawerProps } from './Drawer.model'
import type { JSX } from "react"

/**
 * RSC entry: purely static server render.
 * It will render exactly the same markup (backdrop + container),
 * but no interactive logic (focus‐trap, key events).
 */
export default function DrawerServer(props: DrawerProps): JSX.Element | null {
  return <DrawerView {...props} />
}
