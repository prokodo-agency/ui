import { DynamicListView } from "./DynamicList.view"

import type { DynamicListProps } from "./DynamicList.model"
import type { ReactNode } from "react"

export default function DynamicListServer(props: DynamicListProps): ReactNode {
  const { buttonDeleteProps, ...rest } = props
  return <DynamicListView {...rest} buttonDeleteProps={{
    ...buttonDeleteProps,
    onClick: undefined
  }} />
}