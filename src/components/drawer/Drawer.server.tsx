import { DrawerView } from './Drawer.view'
import type { DrawerProps } from './Drawer.model'

/**
 * RSC entry: purely static server render.
 * It will render exactly the same markup (backdrop + container),
 * but no interactive logic (focus‐trap, key events).
 */
export default function DrawerServer(props: DrawerProps) {
  if (props?.open) return null
  return <DrawerView {...props} />
}
