import { createIsland } from "@/helpers/createIsland"

import AvatarServer from "./Avatar.server"

import type { AvatarProps } from "./Avatar.model"

export const Avatar = createIsland<AvatarProps>({
  name: "Avatar",
  Server: AvatarServer,
  loadLazy: /* istanbul ignore next */ () => import("./Avatar.lazy"),
})
