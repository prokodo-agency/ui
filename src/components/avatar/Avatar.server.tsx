import { AvatarView } from "./Avatar.view"

import type { AvatarProps } from "./Avatar.model"
import type { JSX } from "react"

export default function AvatarServer(props: AvatarProps): JSX.Element {
  return <AvatarView {...props} />
}
