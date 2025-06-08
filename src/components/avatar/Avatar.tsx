import { createIsland } from "@/helpers/createIsland"

import AvatarServer from "./Avatar.server"

import type { AvatarProps } from "./Avatar.model"

export const Avatar = createIsland<AvatarProps>({
  name: "Avatar",
  Server: AvatarServer,
  loadLazy: () => import("./Avatar.lazy"),
})
