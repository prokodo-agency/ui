import { BaseLinkView } from "./BaseLink.view"

import type { BaseLinkProps } from "./BaseLink.model"
import type { JSX } from "react"

export default function BaseLinkServer(props: BaseLinkProps): JSX.Element {
  return <BaseLinkView {...props} />
}