import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import DynamicListClient from "./DynamicList.client"
import DynamicListServer from "./DynamicList.server"

import type { DynamicListProps } from "./DynamicList.model"

export default createLazyWrapper<DynamicListProps>({
  name: "DynamicList",
  Client: DynamicListClient,
  Server: DynamicListServer,
})
