import { createIsland } from "@/helpers/createIsland"

import { RichTextServer } from "./RichText.server"

import type { RichTextProps } from "./RichText.model"

export const RichText = createIsland<RichTextProps>({
  name: "RichText",
  Server: RichTextServer,
  loadLazy: /* istanbul ignore next */ () => import("./RichText.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
