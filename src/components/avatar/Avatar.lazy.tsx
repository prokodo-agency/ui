import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import AvatarClient from "./Avatar.client"
import AvatarServer from "./Avatar.server"
import type { AvatarProps } from "./Avatar.model"

export default createLazyWrapper<AvatarProps>({
  name: "Avatar",
  Client: AvatarClient,
  Server: AvatarServer,
})
