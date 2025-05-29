import { AvatarView } from "./Avatar.view"
import type { AvatarProps } from "./Avatar.model"

export default function AvatarServer(props: AvatarProps) {
  return <AvatarView {...props} />
}
