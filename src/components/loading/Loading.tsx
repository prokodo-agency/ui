import { createIsland } from "@/helpers/createIsland"

import LoadingServer from "./Loading.server"

import type { LoadingProps } from "./Loading.model"

export const Loading = createIsland<LoadingProps>({
  name: "Loading",
  Server: LoadingServer,
  loadLazy: () => import("./Loading.lazy")
})

export default Loading
