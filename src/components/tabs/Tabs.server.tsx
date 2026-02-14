import { TabsView } from "./Tabs.view"

import type { TabsProps } from "./Tabs.model"
import type { JSX } from "react"

export default function TabsServer<Value extends string = string>(
  props: TabsProps<Value>,
): JSX.Element {
  return <TabsView {...props} />
}
