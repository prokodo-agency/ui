import { isString } from "@/helpers/validations"

import { RTEView } from "./RTE.view"

import type { RTEProps } from "./RTE.model"
import type { JSX } from "react"

function stripHtml(html?: string): string {
  if (!isString(html)) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export default function RTEServer(props: RTEProps): JSX.Element {
  const { value, onChange, ...rest } = props
  void onChange

  const v = stripHtml(value)

  return (
    <RTEView {...rest} readOnly htmlValue={v} showResize={false} value={v} />
  )
}
