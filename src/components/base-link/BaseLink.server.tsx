import { BaseLinkView } from "./BaseLink.view"
import type { BaseLinkProps } from "./BaseLink.model"

export default function BaseLinkServer(props: BaseLinkProps) {
  return <BaseLinkView {...props} />
}