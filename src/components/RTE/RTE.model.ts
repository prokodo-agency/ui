import { type QuillOptions } from "quill"

import type { InputProps } from "../input/Input.model"
// eslint-disable-next-line no-duplicate-imports
import type Quill from "quill"

export type RTEFeature =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "ul"
  | "ol"
  | "link"
  | "unlink"
  | "undo"
  | "redo"

type RTEInputProps = Omit<
  InputProps,
  | "multiline"
  | "type"
  | "value"
  | "onChange"
  | "customRegexPattern"
  | "renderNode"
>

export type RTEOnQuillInit = (q: Quill) => void

export type RTEProps = RTEInputProps & {
  /** HTML value */
  value?: string
  /** HTML value */
  rteOptions?: Omit<QuillOptions, "placeholder" | "theme"> & {
    onInit?: RTEOnQuillInit
  }
  /** Optional toolbar config */
  rteToolbar?: RTEFeature[]
  /** Quill-driven change */
  onChange?: (html: string, meta: { text: string }) => void
}
