import { createIsland } from "@/helpers/createIsland"

import { RichTextServer } from "./RichText.server"

import type { RichTextProps } from "./RichText.model"

export const RichText = createIsland<RichTextProps>({
  name: "RichText",
  Server: RichTextServer,
  loadLazy: () => import('./RichText.lazy'),
  isInteractive: (props) =>
    Boolean(props.overrideParagraph) || Boolean(props.animated),
})
