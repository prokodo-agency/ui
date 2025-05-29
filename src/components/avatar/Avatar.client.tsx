"use client"

import { AvatarView } from "./Avatar.view"
import type { AvatarProps } from "./Avatar.model"

export default function AvatarClient(props: AvatarProps) {
  return <AvatarView {...props} />
}
